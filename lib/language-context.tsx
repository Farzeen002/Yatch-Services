"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
  isTranslating: boolean
  translateDynamic: (text: string) => Promise<string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, { en: string; ar: string }> = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.yachts": { en: "Yachts", ar: "اليخوت" },
  "nav.bookings": { en: "Bookings", ar: "الحجوزات" },
  "nav.admin": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.support": { en: "Customer Support", ar: "دعم العملاء" },
  "nav.myBookings": { en: "My Bookings", ar: "حجوزاتي" },
  "nav.invoices": { en: "Invoices", ar: "الفواتير" },
  "nav.staff": { en: "Staff", ar: "الموظفين" },
  "nav.login": { en: "Login", ar: "تسجيل الدخول" },
  "nav.profile": { en: "Profile", ar: "الملف الشخصي" },
  "nav.logout": { en: "Logout", ar: "تسجيل الخروج" },
  
  // Hero Section
  "hero.title": { en: "Experience Luxury on the Water", ar: "تجربة الفخامة على الماء" },
  "hero.subtitle": { en: "Book your dream yacht with Marassi Gulf - powered by Marassi AI", ar: "احجز يخت أحلامك مع مراسي الخليج - مدعوم بمراسي الذكاء الاصطناعي" },
  "hero.bookNow": { en: "Browse Yachts", ar: "تصفح اليخوت" },
  "hero.chatWithMarina": { en: "Learn More", ar: "اعرف المزيد" },
  
  // Features
  "features.title": { en: "Why Choose Marassi Gulf?", ar: "لماذا تختار مراسي الخليج؟" },
  "features.instant.title": { en: "Instant Booking", ar: "حجز فوري" },
  "features.instant.desc": { en: "Book your yacht instantly with our streamlined process", ar: "احجز يختك على الفور بعمليتنا المبسطة" },
  "features.ai.title": { en: "AI-Powered Assistance", ar: "مساعدة مدعومة بالذكاء الاصطناعي" },
  "features.ai.desc": { en: "Get personalized yacht recommendations with Marassi AI", ar: "احصل على توصيات مخصصة لليخوت مع مراسي الذكاء الاصطناعي" },
  "features.support.title": { en: "24/7 Support", ar: "دعم على مدار الساعة" },
  "features.support.desc": { en: "Our team is always here to help you", ar: "فريقنا موجود دائماً لمساعدتك" },
  "features.fleet.title": { en: "Luxury Fleet", ar: "أسطول فاخر" },
  "features.fleet.desc": { en: "Choose from our premium selection of yachts", ar: "اختر من مجموعتنا المتميزة من اليخوت" },
  
  // Featured Yachts
  "yachts.title": { en: "Featured Yachts", ar: "اليخوت المميزة" },
  "yachts.subtitle": { en: "Explore our handpicked collection of premium yachts available for your next adventure", ar: "اكتشف مجموعتنا المختارة من اليخوت الفاخرة المتاحة لمغامرتك القادمة" },
  "yachts.reviews": { en: "reviews", ar: "تقييم" },
  "yachts.viewDetails": { en: "View Details", ar: "عرض التفاصيل" },
  "yachts.perDay": { en: "/day", ar: "/يوم" },
  "yachts.guests": { en: "guests", ar: "ضيوف" },
  "yachts.location": { en: "Location", ar: "الموقع" },
  "yachts.capacity": { en: "Capacity", ar: "السعة" },
  "yachts.bookNow": { en: "Book Now", ar: "احجز الآن" },
  "yachts.browseAll": { en: "Browse All Yachts", ar: "تصفح جميع اليخوت" },
  
  // Footer
  "footer.description": { en: "Experience luxury on the water with Marassi Gulf - powered by Marassi AI", ar: "استمتع بالفخامة على الماء مع مراسي الخليج - مدعوم بمراسي الذكاء الاصطناعي" },
  "footer.quickLinks": { en: "Quick Links", ar: "روابط سريعة" },
  "footer.home": { en: "Home", ar: "الرئيسية" },
  "footer.yachts": { en: "Yachts", ar: "اليخوت" },
  "footer.about": { en: "About Us", ar: "من نحن" },
  "footer.contact": { en: "Contact", ar: "اتصل بنا" },
  "footer.legal": { en: "Legal", ar: "قانوني" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.terms": { en: "Terms of Service", ar: "شروط الخدمة" },
  "footer.refund": { en: "Refund Policy", ar: "سياسة الاسترداد" },
  "footer.contactInfo": { en: "Contact Info", ar: "معلومات الاتصال" },
  "footer.address": { en: "Marassi Gulf Marina, Jeddah, Saudi Arabia", ar: "مرسى مراسي الخليج، جدة، المملكة العربية السعودية" },
  "footer.phone": { en: "Phone", ar: "الهاتف" },
  "footer.email": { en: "Email", ar: "البريد الإلكتروني" },
  "footer.support": { en: "support@marassigulf.com", ar: "support@marassigulf.com" },
  "footer.copyright": { en: "© 2024 Marassi Gulf. All rights reserved.", ar: "© 2024 مراسي الخليج. جميع الحقوق محفوظة." },
  "footer.rights": { en: "All rights reserved", ar: "جميع الحقوق محفوظة" },
  "footer.helpCenter": { en: "Help Center", ar: "مركز المساعدة" },
  "footer.contactUs": { en: "Contact Us", ar: "اتصل بنا" },
  
  // Support Page
  "support.title": { en: "How can we help you?", ar: "كيف يمكننا مساعدتك؟" },
  "support.subtitle": { en: "Choose from the options below or chat with Marassi AI", ar: "اختر من الخيارات أدناه أو تحدث مع مراسي الذكاء الاصطناعي" },
  "support.startChat": { en: "Start Chat", ar: "ابدأ المحادثة" },
  "support.faq": { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  "support.booking": { en: "Booking Inquiries", ar: "استفسارات الحجز" },
  "support.payment": { en: "Payment & Refunds", ar: "الدفع والاسترداد" },
  "support.technical": { en: "Technical Support", ar: "الدعم التقني" },
  "support.emailTitle": { en: "Email Support", ar: "الدعم عبر البريد الإلكتروني" },
  "support.emailDesc": { en: "Get answers within 24 hours", ar: "احصل على إجابات خلال 24 ساعة" },
  "support.callTitle": { en: "Call Us", ar: "اتصل بنا" },
  "support.callDesc": { en: "Available 24/7 for emergencies", ar: "متاح على مدار الساعة للطوارئ" },
  "support.chatTitle": { en: "Live Chat", ar: "دردشة مباشرة" },
  "support.chatDesc": { en: "Instant support from our team", ar: "دعم فوري من فريقنا" },
  
  // Chatbot
  "chat.assistant": { en: "Marassi AI", ar: "مراسي الذكاء الاصطناعي" },
  "chat.support": { en: "Your Luxury Yacht Booking Assistant", ar: "مساعدك في حجز اليخوت الفاخرة" },
  "chat.greeting": { en: "Welcome to Marassi Gulf! 🛥️ I'm Marassi AI, your personal yacht booking assistant. How can I help you today?", ar: "مرحباً بك في مراسي الخليج! 🛥️ أنا مراسي الذكاء الاصطناعي، مساعدك الشخصي لحجز اليخوت. كيف يمكنني مساعدتك اليوم؟" },
  "chat.placeholder": { en: "Ask me about yachts, bookings, or anything else...", ar: "اسألني عن اليخوت أو الحجوزات أو أي شيء آخر..." },
  "chat.send": { en: "Send", ar: "إرسال" },
  "chat.clear": { en: "Clear chat", ar: "مسح المحادثة" },
  "chat.instantResponse": { en: "Instant response", ar: "رد فوري" },
  
  // Booking
  "booking.selectDates": { en: "Select Dates", ar: "اختر التواريخ" },
  "booking.guests": { en: "Number of Guests", ar: "عدد الضيوف" },
  "booking.submit": { en: "Check Availability", ar: "تحقق من التوفر" },
  "booking.total": { en: "Total Price", ar: "السعر الإجمالي" },
  "booking.confirm": { en: "Confirm Booking", ar: "تأكيد الحجز" },
  "booking.reference": { en: "Booking Reference", ar: "رقم الحجز" },
  "booking.status": { en: "Status", ar: "الحالة" },
  "booking.payment": { en: "Payment Status", ar: "حالة الدفع" },
  
  // Common
  "common.loading": { en: "Loading...", ar: "جاري التحميل..." },
  "common.error": { en: "Error", ar: "خطأ" },
  "common.success": { en: "Success", ar: "نجح" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.close": { en: "Close", ar: "إغلاق" },
  "common.viewMore": { en: "View More", ar: "عرض المزيد" },
  "common.search": { en: "Search", ar: "بحث" },
  
  // Quick Options
  "quick.viewYachts": { en: "View available yachts", ar: "عرض اليخوت المتاحة" },
  "quick.pricing": { en: "What's the pricing?", ar: "ما هي الأسعار؟" },
  "quick.checkBookings": { en: "Check my bookings", ar: "تحقق من حجوزاتي" },
  "quick.bookYacht": { en: "Book a yacht", ar: "احجز يختاً" },
  "quick.specialRequests": { en: "Special requests", ar: "طلبات خاصة" },
  
  // Login Page
  "login.title": { en: "Welcome Back", ar: "مرحباً بعودتك" },
  "login.subtitle": { en: "Sign in to continue", ar: "سجل الدخول للمتابعة" },
  "login.googleButton": { en: "Continue with Google", ar: "المتابعة بحساب جوجل" },
  "login.signingIn": { en: "Signing in...", ar: "جاري تسجيل الدخول..." },
  "login.terms": { en: "By continuing, you agree to our Terms of Service and Privacy Policy", ar: "بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية" },
  "login.error": { en: "Login failed", ar: "فشل تسجيل الدخول" },
  
  // Featured Yachts
  "featured.badge": { en: "Featured Collection", ar: "المجموعة المميزة" },
  "featured.title": { en: "Premium Yachts", ar: "يخوت فاخرة" },
  "featured.subtitle": { en: "Handpicked collection of the world's finest yachts, ready for your next luxury adventure", ar: "مجموعة مختارة بعناية من أفخم اليخوت في العالم، جاهزة لمغامرتك الفاخرة القادمة" },
  "featured.reviews": { en: "reviews", ar: "تقييم" },
  "featured.guests": { en: "guests", ar: "ضيوف" },
  "featured.length": { en: "Length", ar: "الطول" },
  "featured.viewAll": { en: "View All Yachts", ar: "عرض جميع اليخوت" },
  
  // Services/Features
  "services.title": { en: "Why Choose Marassi Gulf?", ar: "لماذا تختار مراسي الخليج؟" },
  "services.subtitle": { en: "Experience the future of luxury yacht booking", ar: "اختبر مستقبل حجز اليخوت الفاخرة" },
  "services.aiBooking": { en: "AI-Powered Booking", ar: "حجز مدعوم بالذكاء الاصطناعي" },
  "services.aiBookingDesc": { en: "Instant yacht bookings with intelligent recommendations powered by advanced AI technology", ar: "حجز يخت فوري مع توصيات ذكية مدعومة بتقنية الذكاء الاصطناعي المتقدمة" },
  "services.smartSchedule": { en: "Smart Scheduling", ar: "جدولة ذكية" },
  "services.smartScheduleDesc": { en: "Automated calendar management and booking optimization to maximize your yacht utilization", ar: "إدارة التقويم الآلي وتحسين الحجز لتحقيق أقصى استفادة من يختك" },
  "services.securePayment": { en: "Secure Payments", ar: "مدفوعات آمنة" },
  "services.securePaymentDesc": { en: "Bank-level security with instant payment processing and automated invoicing system", ar: "أمان بمستوى البنوك مع معالجة فورية للدفع ونظام فوترة آلي" },
  "services.staffManagement": { en: "Staff Management", ar: "إدارة الموظفين" },
  "services.staffManagementDesc": { en: "Comprehensive crew scheduling, certification tracking, and performance management", ar: "جدولة شاملة للطاقم، تتبع الشهادات، وإدارة الأداء" },
  "services.analytics": { en: "Analytics Dashboard", ar: "لوحة التحليلات" },
  "services.analyticsDesc": { en: "Real-time insights and detailed reports to grow your yacht charter business", ar: "رؤى فورية وتقارير مفصلة لتنمية أعمال استئجار اليخوت الخاصة بك" },
  "services.multiLocation": { en: "Multi-Location Support", ar: "دعم متعدد المواقع" },
  "services.multiLocationDesc": { en: "Manage multiple marinas and destinations from a single powerful platform", ar: "إدارة عدة مراسي ووجهات من منصة واحدة قوية" },
  
  // Benefits
  "benefits.fasterBooking": { en: "50% Faster Booking Process", ar: "عملية حجز أسرع بنسبة 50%" },
  "benefits.revenue": { en: "35% Revenue Increase", ar: "زيادة الإيرادات بنسبة 35%" },
  "benefits.satisfaction": { en: "98% Customer Satisfaction", ar: "رضا العملاء بنسبة 98%" },
  "benefits.security": { en: "Enterprise-Grade Security", ar: "أمان على مستوى المؤسسات" },
  
  // Yacht Details
  "yacht.bookingTitle": { en: "Book This Yacht", ar: "احجز هذا اليخت" },
  "yacht.checkIn": { en: "Check-in Date", ar: "تاريخ الوصول" },
  "yacht.checkOut": { en: "Check-out Date", ar: "تاريخ المغادرة" },
  "yacht.numberOfGuests": { en: "Number of Guests", ar: "عدد الضيوف" },
  "yacht.totalPrice": { en: "Total Price", ar: "السعر الإجمالي" },
  "yacht.perDay": { en: "per day", ar: "في اليوم" },
  "yacht.days": { en: "days", ar: "أيام" },
  "yacht.bookNow": { en: "Book Now", ar: "احجز الآن" },
  "yacht.overview": { en: "Overview", ar: "نظرة عامة" },
  "yacht.amenities": { en: "Amenities", ar: "وسائل الراحة" },
  "yacht.specifications": { en: "Specifications", ar: "المواصفات" },
  "yacht.location": { en: "Location", ar: "الموقع" },
  "yacht.available": { en: "Available", ar: "متاح" },
  "yacht.unavailable": { en: "Unavailable", ar: "غير متاح" },
  
  // User Bookings
  "userBookings.title": { en: "My Bookings", ar: "حجوزاتي" },
  "userBookings.subtitle": { en: "View and manage your yacht bookings", ar: "عرض وإدارة حجوزات اليخت الخاصة بك" },
  "userBookings.noBookings": { en: "No bookings yet", ar: "لا توجد حجوزات بعد" },
  "userBookings.noBookingsDesc": { en: "Start your luxury yacht adventure today!", ar: "ابدأ مغامرتك على اليخت الفاخر اليوم!" },
  "userBookings.browseYachts": { en: "Browse Yachts", ar: "تصفح اليخوت" },
  "userBookings.bookingRef": { en: "Booking Reference", ar: "رقم الحجز" },
  "userBookings.yacht": { en: "Yacht", ar: "اليخت" },
  "userBookings.dates": { en: "Dates", ar: "التواريخ" },
  "userBookings.guests": { en: "Guests", ar: "الضيوف" },
  "userBookings.total": { en: "Total", ar: "المجموع" },
  "userBookings.status": { en: "Status", ar: "الحالة" },
  "userBookings.paymentStatus": { en: "Payment", ar: "الدفع" },
  "userBookings.viewDetails": { en: "View Details", ar: "عرض التفاصيل" },
  "userBookings.cancelBooking": { en: "Cancel Booking", ar: "إلغاء الحجز" },
  
  // Booking Status
  "status.pending": { en: "Pending", ar: "قيد الانتظار" },
  "status.confirmed": { en: "Confirmed", ar: "مؤكد" },
  "status.cancelled": { en: "Cancelled", ar: "ملغى" },
  "status.completed": { en: "Completed", ar: "مكتمل" },
  "status.paid": { en: "Paid", ar: "مدفوع" },
  "status.unpaid": { en: "Unpaid", ar: "غير مدفوع" },
  "status.refunded": { en: "Refunded", ar: "مسترد" },
  
  // Forms
  "form.required": { en: "This field is required", ar: "هذا الحقل مطلوب" },
  "form.invalidEmail": { en: "Invalid email address", ar: "عنوان بريد إلكتروني غير صالح" },
  "form.invalidPhone": { en: "Invalid phone number", ar: "رقم هاتف غير صالح" },
  "form.submit": { en: "Submit", ar: "إرسال" },
  "form.submitting": { en: "Submitting...", ar: "جاري الإرسال..." },
  "form.name": { en: "Full Name", ar: "الاسم الكامل" },
  "form.email": { en: "Email Address", ar: "البريد الإلكتروني" },
  "form.phone": { en: "Phone Number", ar: "رقم الهاتف" },
  "form.message": { en: "Message", ar: "الرسالة" },
  "form.subject": { en: "Subject", ar: "الموضوع" },
  
  // Admin Dashboard
  "admin.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "admin.totalBookings": { en: "Total Bookings", ar: "إجمالي الحجوزات" },
  "admin.totalRevenue": { en: "Total Revenue", ar: "إجمالي الإيرادات" },
  "admin.activeYachts": { en: "Active Yachts", ar: "اليخوت النشطة" },
  "admin.customers": { en: "Customers", ar: "العملاء" },
  "admin.recentBookings": { en: "Recent Bookings", ar: "الحجوزات الأخيرة" },
  "admin.viewAll": { en: "View All", ar: "عرض الكل" },
  "admin.addYacht": { en: "Add Yacht", ar: "إضافة يخت" },
  "admin.editYacht": { en: "Edit Yacht", ar: "تعديل اليخت" },
  "admin.deleteYacht": { en: "Delete Yacht", ar: "حذف اليخت" },
  
  // Invoices
  "invoice.title": { en: "Invoices", ar: "الفواتير" },
  "invoice.number": { en: "Invoice Number", ar: "رقم الفاتورة" },
  "invoice.date": { en: "Date", ar: "التاريخ" },
  "invoice.dueDate": { en: "Due Date", ar: "تاريخ الاستحقاق" },
  "invoice.amount": { en: "Amount", ar: "المبلغ" },
  "invoice.download": { en: "Download PDF", ar: "تحميل PDF" },
  "invoice.print": { en: "Print", ar: "طباعة" },
  "invoice.payNow": { en: "Pay Now", ar: "ادفع الآن" },
  
  // Testimonials
  "testimonials.title": { en: "What Our Clients Say", ar: "ماذا يقول عملاؤنا" },
  "testimonials.subtitle": { en: "Join thousands of satisfied yacht enthusiasts", ar: "انضم إلى آلاف عشاق اليخوت الراضين" },
  
  // Stats
  "stats.yachts": { en: "Premium Yachts", ar: "يخوت فاخرة" },
  "stats.clients": { en: "Happy Clients", ar: "عملاء سعداء" },
  "stats.destinations": { en: "Destinations", ar: "وجهات" },
  "stats.satisfaction": { en: "Satisfaction Rate", ar: "معدل الرضا" },
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
    
    // Small delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 200))
    
    setLanguage(newLang)
    localStorage.setItem("language", newLang)
    
    // Apply RTL/LTR direction
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = newLang
    
    setIsTranslating(false)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  const translateDynamic = async (text: string): Promise<string> => {
    if (language === "en" || !text) return text
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: language }),
      })
      
      if (!response.ok) return text
      
      const data = await response.json()
      return data.translatedText || text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isTranslating, translateDynamic }}>
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