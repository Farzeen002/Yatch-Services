"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import heroYacht from "@/public/assets/hero-yacht.jpg"
import { useLanguage } from "@/lib/language-context"

export default function HeroSection() {
  const router = useRouter()
  const { t } = useLanguage()

  const scrollToYachts = () => {
    const element = document.getElementById("yachts")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const handleBookNow = () => {
    router.push("/yachts")
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <video
          src="/assets/yacht-3.mp4" // 🎥 place your video in public/assets/
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/90" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full mb-6 border border-accent/30">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">AI-Powered Yacht Booking</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 text-balance leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 text-balance max-w-3xl mx-auto">
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
            onClick={scrollToYachts}
            className="px-8 py-4 gradient-gold font-bold rounded-xl hover:shadow-glow transition-all transform hover:scale-105 text-lg"
          >
            {t("hero.bookNow")}
          </button>
          <button 
            className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground font-bold rounded-xl backdrop-blur-sm border-2 border-primary-foreground/30 hover:bg-primary-foreground/20 transition-all text-lg"
          >
            {t("hero.chatWithMarina")}
          </button>
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "500+", label: "Premium Yachts" },
            { value: "50k+", label: "Happy Clients" },
            { value: "120+", label: "Destinations" }
          ].map((stat, i) => (
            <div key={i} className="backdrop-blur-sm bg-primary-foreground/10 p-6 rounded-2xl border border-primary-foreground/20">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}
