"use client"

import { motion } from "framer-motion"

interface NavbarProps {
  currentPage: "home" | "admin"
  setCurrentPage: (page: "home" | "admin") => void
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">⛵</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Marina</h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentPage("home")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === "home" ? "bg-primary text-white" : "text-primary hover:bg-primary/10"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage("admin")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === "admin" ? "bg-primary text-white" : "text-primary hover:bg-primary/10"
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
