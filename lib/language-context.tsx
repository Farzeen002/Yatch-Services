"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, { en: string; ar: string }> = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.yachts": { en: "Yachts", ar: "اليخوت" },
  "nav.bookings": { en: "Bookings", ar: "الحجوزات" },
  "nav.admin": { en: "Admin", ar: "الإدارة" },
  
  // Hero Section
  "hero.title": { en: "Book Your Private Yacht in Minutes", ar: "احجز يختك الخاص في ثوانٍ" },
  "hero.subtitle": { en: "Experience luxury yacht booking powered by AI. Marina makes it effortless.", ar: "استمتع بحجز اليخوت الفاخرة بتقنية الذكاء الاصطناعي. مارينا تجعل الأمر سهلاً" },
  "hero.bookNow": { en: "Book Now", ar: "احجز الآن" },
  "hero.chatWithMarina": { en: "Chat with Marina", ar: "تحدث مع مارينا" },
  
  // Featured Yachts
  "yachts.title": { en: "Featured Yachts", ar: "اليخوت المميزة" },
  "yachts.subtitle": { en: "Explore our handpicked collection of premium yachts available for your next adventure", ar: "اكتشف مجموعتنا المختارة من اليخوت الفاخرة المتاحة لمغامرتك القادمة" },
  "yachts.reviews": { en: "reviews", ar: "تقييم" },
  "yachts.viewDetails": { en: "View Details", ar: "عرض التفاصيل" },
  "yachts.perDay": { en: "/day", ar: "/يوم" },
  
  // Footer
  "footer.description": { en: "Experience luxury yacht booking powered by AI. Your adventure awaits.", ar: "استمتع بحجز اليخوت الفاخرة بتقنية الذكاء الاصطناعي. مغامرتك في انتظارك" },
  "footer.quickLinks": { en: "Quick Links", ar: "روابط سريعة" },
  "footer.support": { en: "Support", ar: "الدعم" },
  "footer.contact": { en: "Contact", ar: "اتصل بنا" },
  "footer.helpCenter": { en: "Help Center", ar: "مركز المساعدة" },
  "footer.contactUs": { en: "Contact Us", ar: "اتصل بنا" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.terms": { en: "Terms of Service", ar: "شروط الخدمة" },
  "footer.rights": { en: "All rights reserved", ar: "جميع الحقوق محفوظة" },
  
  // Chatbot
  "chat.assistant": { en: "Marina AI Assistant", ar: "مساعد مارينا الذكي" },
  "chat.support": { en: "Instant yacht booking support", ar: "دعم فوري لحجز اليخوت" },
  "chat.greeting": { en: "Hi! I'm Marina, your AI yacht booking assistant. How can I help you today?", ar: "مرحباً! أنا مارينا، مساعدك الذكي لحجز اليخوت. كيف يمكنني مساعدتك اليوم؟" },
  "chat.placeholder": { en: "Ask me anything...", ar: "اسألني أي شيء..." },
  "chat.send": { en: "Send", ar: "إرسال" },
  "chat.instantResponse": { en: "Instant response", ar: "رد فوري" },
  
  // Quick Options
  "quick.viewYachts": { en: "View available yachts", ar: "عرض اليخوت المتاحة" },
  "quick.pricing": { en: "What's the pricing?", ar: "ما هي الأسعار؟" },
  "quick.checkBookings": { en: "Check my bookings", ar: "تحقق من حجوزاتي" },
  "quick.bookYacht": { en: "Book a yacht", ar: "احجز يختاً" },
  "quick.specialRequests": { en: "Special requests", ar: "طلبات خاصة" },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved) setLanguage(saved)
  }, [])

  const toggleLanguage = async () => {
    setIsTranslating(true)
    const newLang = language === "en" ? "ar" : "en"
    
    // Simulate translation delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setLanguage(newLang)
    localStorage.setItem("language", newLang)
    setIsTranslating(false)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isTranslating }}>
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}