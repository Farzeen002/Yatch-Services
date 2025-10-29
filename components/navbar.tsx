"use client"

import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-ocean rounded-xl flex items-center justify-center shadow-luxury">
            <Anchor className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Marassi Gulf Entertainment</h1>
        </div>

        <div className="hidden md:flex gap-8">
          <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </a>
          <a href="#yachts" className="text-foreground hover:text-primary transition-colors font-medium">
            Yachts
          </a>
          <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
            Features
          </a>
          <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">
            Reviews
          </a>
        </div>

        <button className="px-6 py-2 gradient-gold rounded-lg font-bold text-accent-foreground hover:shadow-glow transition-all transform hover:scale-105">
          Book Now
        </button>
      </div>
    </motion.nav>
  );
}