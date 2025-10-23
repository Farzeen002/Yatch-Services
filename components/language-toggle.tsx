"use client"

import { useLanguage } from "@/lib/language-context"
import { Globe, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function LanguageToggle() {
  const { language, toggleLanguage, isTranslating } = useLanguage()

  return (
    <motion.button
      onClick={toggleLanguage}
      disabled={isTranslating}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isTranslating ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Globe size={18} />
      )}
      <span className="font-medium text-sm">
        {language === "en" ? "العربية" : "English"}
      </span>
    </motion.button>
  )
}