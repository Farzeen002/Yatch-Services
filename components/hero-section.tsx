"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter() // ✅ Hook must be declared here at the top level

  const scrollToBooking = () => {
    const element = document.getElementById("booking-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const handleBookNow = () => {
    router.push("/yachts") // ✅ Works perfectly now
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-blue-900 to-primary">
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Book Your Private Yacht in Seconds
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8">
          Experience luxury yacht booking powered by AI. Marina makes it effortless.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBookNow}
            className="px-8 py-4 bg-accent text-primary font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition-all transform hover:scale-105 animate-glow"
          >
            Book Now
          </button>

          <button className="px-8 py-4 bg-white/20 text-white font-bold rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all">
            Chat with Marina
          </button>
        </div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="mt-16 text-6xl animate-float"
        >
          🚤
        </motion.div>
      </div>
    </section>
  )
}
