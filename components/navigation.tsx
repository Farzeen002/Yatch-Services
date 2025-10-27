"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Anchor, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Menu as HeadlessMenu } from "@headlessui/react"
import LoginPopup from "./LoginPopup"
import ProfileModal from "./ProfileModal"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [loginPopupOpen, setLoginPopupOpen] = useState(false)
  const [showLoginLink, setShowLoginLink] = useState(false)
  const [user, setUser] = useState<{ name: string; image: string; role: string } | null>(null)

  const links = [
    { href: "/", label: "Home" },
    { href: "/admin", label: "Dashboard" },
    { href: "/yachts", label: "Yachts" },
    { href: "/bookings", label: "Bookings" },
    { href: "/invoices", label: "Invoices" },
    { href: "/Staff", label: "Staff" },
    { href: "/user", label: "My Bookings" },
  ]

  // Fetch user profile
 useEffect(() => {
  const fetchUser = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) return

    const user = authData.user

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username, profile_image, role_type")
      .eq("id", user.id)
      .single()

    if (profileError) return

    // ✅ Choose the best image source available
    const finalImage =
      profile?.profile_image && profile.profile_image.trim() !== ""
        ? profile.profile_image
        : user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          "/profile-placeholder.png"

    setUser({
      name:
        profile?.username ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User",
      image: finalImage,
      role: profile?.role_type || "user",
    })
  }

  fetchUser()
}, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const visibleLinks = links.filter((link) => {
    if (
      (link.href === "/admin" ||
        link.href === "/bookings" ||
        link.href === "/invoices" ||
        link.href === "/Staff") &&
      user?.role !== "admin"
    ) return false
    if (link.href === "/user" && user?.role !== "user") return false
    return true
  })

  // Show login popup once per session
  useEffect(() => {
    const labels = visibleLinks.map((link) => link.label)
    const onlyHomeAndYachts = labels.length === 2 && labels.includes("Home") && labels.includes("Yachts")
    const popupShown = sessionStorage.getItem("loginPopupShown")

    if (onlyHomeAndYachts && !user && !popupShown) {
      const timer = setTimeout(() => {
        setLoginPopupOpen(true)
        sessionStorage.setItem("loginPopupShown", "true")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visibleLinks, user])

  const handleLoginCancel = () => {
    setLoginPopupOpen(false)
    setShowLoginLink(true)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-ocean rounded-xl flex items-center justify-center shadow-luxury">
              <Anchor className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Marina</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href === "/yachts" && user?.role === "admin" ? "/admin/yachts" : link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!user && showLoginLink && (
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Login
              </Link>
            )}

            {user && (
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button className="flex items-center gap-2 focus:outline-none">
                  <img src={user.image} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
                  <span className="font-medium text-sm">{user.name}</span>
                </HeadlessMenu.Button>

                <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setProfileOpen(true)}
                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`}
                      >
                        Profile
                      </button>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`}
                      >
                        Logout
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </HeadlessMenu.Items>
              </HeadlessMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-background flex flex-col pb-4">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href === "/yachts" && user?.role === "admin" ? "/admin/yachts" : link.href}
                className={`block px-4 py-2 rounded text-sm font-medium ${
                  pathname === link.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!user && showLoginLink && (
              <Link
                href="/login"
                className="block px-4 py-2 rounded text-sm font-medium text-primary hover:bg-muted"
              >
                Login
              </Link>
            )}

            {user && (
              <div className="border-t pt-3 mt-3 px-4 flex flex-col gap-1">
                <button onClick={() => setProfileOpen(true)} className="text-left text-sm py-1 hover:underline">
                  Profile
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      router.push("/admin")
                      setIsOpen(false)
                    }}
                    className="text-left text-sm py-1 hover:underline"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="text-left text-sm py-1 text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <LoginPopup open={loginPopupOpen} onClose={handleLoginCancel} />
    </nav>
  )
}
