"use client"

import { motion } from "framer-motion"
<<<<<<< HEAD
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter() // ✅ Hook must be declared here at the top level

=======
import { useLanguage } from "@/lib/language-context"

export default function HeroSection() {
  const { t } = useLanguage()
  
>>>>>>> d70ff4d3929aec136059f9d6d62b1bd8d36b8133
  const scrollToBooking = () => {
    const element = document.getElementById("booking-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const handleBookNow = () => {
    router.push("/yachts") // ✅ Works perfectly now
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-blue-900 to-primary">
<<<<<<< HEAD
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
=======
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 text-balance">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={scrollToBooking}
            className="px-8 py-4 bg-accent text-primary font-bold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition-all transform hover:scale-105"
>>>>>>> d70ff4d3929aec136059f9d6d62b1bd8d36b8133
          >
            {t("hero.bookNow")}
          </button>

          <button className="px-8 py-4 bg-white/20 text-white font-bold rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all">
            {t("hero.chatWithMarina")}
          </button>
        </div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mt-16 text-6xl"
        >
          🚤
        </motion.div>
      </div>
    </section>
  )
}