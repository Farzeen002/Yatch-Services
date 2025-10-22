"use client"
import Navigation from "@/components/navigation"
import YachtsCatalog from "@/components/yachts-catalog"
import Chatbot from "@/components/chatbot"
import Footer from "@/components/footer"

export default function YachtsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <YachtsCatalog />
      <Chatbot />
      <Footer />
    </main>
  )
}
