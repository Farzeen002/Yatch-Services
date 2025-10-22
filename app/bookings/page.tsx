"use client"

import Navigation from "@/components/navigation"
import BookingsManagement from "@/components/bookings-management"
import Chatbot from "@/components/chatbot"
import Footer from "@/components/footer"

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <BookingsManagement />
      <Chatbot />
      <Footer />
    </main>
  )
}
