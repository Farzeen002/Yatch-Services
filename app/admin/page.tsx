"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import Chatbot from "@/components/chatbot"
import Footer from "@/components/footer"

export default function AdminPage() {
  const [bookings] = useState([
    {
      id: 1,
      yachtName: "Luxury Catamaran",
      date: "2024-12-15",
      guests: 8,
      totalPrice: 5000,
      status: "Pending",
    },
    {
      id: 2,
      yachtName: "Motor Yacht",
      date: "2024-12-20",
      guests: 6,
      totalPrice: 3500,
      status: "Confirmed",
    },
    {
      id: 3,
      yachtName: "Sailing Yacht",
      date: "2024-12-25",
      guests: 4,
      totalPrice: 2800,
      status: "Pending",
    },
  ])

  const [chatMessages] = useState([
    {
      sender: "user",
      text: "What is the best yacht for a family of 6?",
    },
    {
      sender: "marina",
      text: "I recommend our Motor Yacht - it's spacious, comfortable, and perfect for families!",
    },
    {
      sender: "user",
      text: "What about availability in December?",
    },
    {
      sender: "marina",
      text: "We have excellent availability throughout December. Would you like to book?",
    },
  ])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <AdminDashboard bookings={bookings} chatMessages={chatMessages} />
      <Chatbot />
      <Footer />
    </main>
  )
}
