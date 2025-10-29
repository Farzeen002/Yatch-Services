"use client"

import { useLanguage } from "@/lib/language-context"
import { Languages, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LanguageSwitcher() {
  const { language, toggleLanguage, isTranslating } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      disabled={isTranslating}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300 ${
        isTranslating ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:scale-105'
      }`}
      aria-label="Toggle language"
    >
      <AnimatePresence mode="wait">
        {isTranslating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Languages className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {language === 'en' ? (
            <motion.div
              key="en"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">🇺🇸</span>
              <span className="text-sm font-semibold">English</span>
            </motion.div>
          ) : (
            <motion.div
              key="ar"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">🇸🇦</span>
              <span className="text-sm font-semibold">العربية</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Toggle indicator */}
      <div className="ml-1 flex items-center gap-0.5">
        <div className={`w-1.5 h-1.5 rounded-full ${language === 'en' ? 'bg-white' : 'bg-white/40'}`} />
        <div className={`w-1.5 h-1.5 rounded-full ${language === 'ar' ? 'bg-white' : 'bg-white/40'}`} />
      </div>
    </button>
  )
}

