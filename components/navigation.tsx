"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Menu as HeadlessMenu } from "@headlessui/react"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; image: string; role: string } | null>(null)

  const links = [
    { href: "/", label: "Home" },
    { href: "/yachts", label: "Yachts" },
    { href: "/bookings", label: "Bookings" },
  ]

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) return

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("username, profile_image, role_type")
        .eq("id", authData.user.id)
        .single()

      if (profileError) {
        console.error("Failed to fetch profile:", profileError.message)
        return
      }

      setUser({
        name: profile.username || "User",
        image: profile.profile_image || "/profile-placeholder.png",
        role: profile.role_type || "user",
      })
    }

    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">Marina</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Profile Dropdown */}
            {user && (
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button className="flex items-center gap-2 focus:outline-none">
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-medium text-sm">{user.name}</span>
                </HeadlessMenu.Button>

                <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm`}
                        onClick={() => router.push("/profile")}
                      >
                        Profile
                      </button>
                    )}
                  </HeadlessMenu.Item>

                  {/* Show Dashboard only for admin */}
                  {user.role === "admin" && (
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm`}
                          onClick={() => router.push("/admin")}
                        >
                          Dashboard
                        </button>
                      )}
                    </HeadlessMenu.Item>
                  )}

                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-red-600`}
                        onClick={handleLogout}
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
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-background flex flex-col pb-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded text-sm font-medium ${
                  pathname === link.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsOpen(false)} // close menu on click
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <div className="border-t pt-3 mt-3 px-4 flex flex-col gap-1">
                <button
                  onClick={() => {
                    router.push("/profile")
                    setIsOpen(false)
                  }}
                  className="text-left text-sm py-1 hover:underline"
                >
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
    </nav>
  )
}