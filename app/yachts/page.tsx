"use client"
import Navigation from "@/components/navigation"
import YachtsCatalog from "@/components/yachts-catalog"
import Chatbot from "@/components/chatbot"
import Footer from "@/components/footer"

export default function YachtsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Ocean Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      <Navigation />
      <YachtsCatalog />
      <Chatbot />
      <Footer />
    </main>
  )
}
