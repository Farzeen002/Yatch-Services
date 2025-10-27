"use client"

import { useState } from "react"
import InstantBookingCard from "@/components/instant-booking-card"

export default function TestBookingPage() {
  const [testYacht] = useState({
    id: "test-yacht-1",
    name: "Test Yacht",
    type: "Motor Yacht",
    price: 5000,
    guests: 8,
    amenities: ["WiFi", "Air Conditioning", "Jacuzzi"],
    unavailableDates: []
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Instant Booking</h1>
        <InstantBookingCard yacht={testYacht} />
      </div>
    </div>
  )
}

