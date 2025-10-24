"use client"

import Navigation from "@/components/navigation"
import UserBookings from "@/components/user-bookings"
import Chatbot from "@/components/chatbot"
import Footer from "@/components/footer"

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <UserBookings />
      <Chatbot />
      <Footer />
    </main>
  )
}
