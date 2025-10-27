"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Anchor, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Menu as HeadlessMenu } from "@headlessui/react";
import LoginPopup from "./LoginPopup";
import ProfileModal from "./ProfileModal";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [showLoginLink, setShowLoginLink] = useState(false);
  const [user, setUser] = useState<{ name: string; image: string; role: string } | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const allLinks = [
    { href: "/", label: "Home" },
    { href: "/yachts", label: "Yachts" },
    { href: "/admin", label: "Dashboard", role: "admin" },
    { href: "/bookings", label: "Bookings", role: "admin" },
    { href: "/invoices", label: "Invoices", role: "admin" },
    { href: "/Staff", label: "Staff", role: "admin" },
    { href: "/user", label: "My Bookings", role: "user" },
  ];

  // ✅ Show base menu immediately
  const [visibleLinks, setVisibleLinks] = useState(
    allLinks.filter((l) => !l.role) // show public first
  );

  // ✅ Fetch user in background (non-blocking)
  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const [{ data: authData }, { data: profile }] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from("users").select("id, username, profile_image, role_type"),
        ]);

        if (!authData?.user) {
          if (!cancelled) {
            setUser(null);
            setUserLoaded(true);
          }
          return;
        }

        const userData = authData.user;
        const userProfile = profile?.find((p) => p.id === userData.id);
        const finalImage =
          userProfile?.profile_image?.trim() ||
          userData.user_metadata?.avatar_url ||
          "/profile-placeholder.png";

        if (!cancelled) {
          setUser({
            name:
              userProfile?.username ||
              userData.user_metadata?.full_name ||
              userData.email?.split("@")[0] ||
              "User",
            image: finalImage,
            role: userProfile?.role_type || "user",
          });
          setUserLoaded(true);
        }
      } catch {
        if (!cancelled) setUserLoaded(true);
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ Update visible links after user loads (fast switch)
  useEffect(() => {
    if (!userLoaded) return;

    const filtered = allLinks.filter((link) => {
      if (!link.role) return true;
      if (link.role === "admin" && user?.role === "admin") return true;
      if (link.role === "user" && user?.role === "user") return true;
      return false;
    });

    setVisibleLinks(filtered);
  }, [user, userLoaded]);

  // ✅ Popup logic (3s delay only for guests)
  useEffect(() => {
    if (!userLoaded) return;

    const labels = visibleLinks.map((l) => l.label);
    const onlyPublic = labels.length === 2 && labels.includes("Home") && labels.includes("Yachts");
    const popupShown = sessionStorage.getItem("loginPopupShown");

    if (onlyPublic && !user && !popupShown) {
      const timer = setTimeout(() => {
        setLoginPopupOpen(true);
        sessionStorage.setItem("loginPopupShown", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (onlyPublic && !user && popupShown) {
      setShowLoginLink(true);
    }
  }, [userLoaded, user, visibleLinks]);

  const handleLoginCancel = () => {
    setLoginPopupOpen(false);
    setShowLoginLink(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVisibleLinks(allLinks.filter((l) => !l.role)); // revert to base
    sessionStorage.removeItem("loginPopupShown");
    setShowLoginLink(true);
    router.push("/");
  };

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
                href={
                  link.href === "/yachts" && user?.role === "admin"
                    ? "/yachts"
                    : link.href
                }
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
                        onClick={() => setProfileOpen(true)}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        Profile
                      </button>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          active ? "bg-gray-100" : ""
                        }`}
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
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={
                  link.href === "/yachts" && user?.role === "admin"
                    ? "/admin/yachts"
                    : link.href
                }
                className={`block px-4 py-2 rounded text-sm font-medium ${
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
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
                <button
                  onClick={() => setProfileOpen(true)}
                  className="text-left text-sm py-1 hover:underline"
                >
                  Profile
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      router.push("/admin");
                      setIsOpen(false);
                    }}
                    className="text-left text-sm py-1 hover:underline"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
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
  );
}
