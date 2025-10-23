"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export default function HeroSection() {
  const { t } = useLanguage()
  
  const scrollToBooking = () => {
    const element = document.getElementById("booking-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-blue-900 to-primary">
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
          >
            {t("hero.bookNow")}
          </button>
          <button className="px-8 py-4 bg-white/20 text-white font-bold rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all">
            {t("hero.chatWithMarina")}
          </button>
        </motion.div>

        {/* Floating yacht illustration */}
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