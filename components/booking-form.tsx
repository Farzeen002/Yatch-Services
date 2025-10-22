"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface BookingFormProps {
  onBooking: (booking: any) => void
}

export default function BookingForm({ onBooking }: BookingFormProps) {
  const [formData, setFormData] = useState({
    yachtName: "Luxury Catamaran",
    date: "",
    guests: 4,
  })

  const yachts = [
    { name: "Luxury Catamaran", price: 5000 },
    { name: "Private Speedboat", price: 3000 },
    { name: "Mega Yacht", price: 15000 },
    { name: "Sailing Vessel", price: 4000 },
  ]

  const selectedYacht = yachts.find((y) => y.name === formData.yachtName)
  const totalPrice = selectedYacht ? selectedYacht.price * (formData.guests / 4) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.date) {
      onBooking({
        ...formData,
        totalPrice,
        timestamp: new Date().toISOString(),
      })
      setFormData({ yachtName: "Luxury Catamaran", date: "", guests: 4 })
      alert("Booking confirmed! Reference ID: #" + Math.random().toString(36).substr(2, 9).toUpperCase())
    }
  }

  return (
    <section id="booking-section" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-primary mb-2 text-center">Reserve Your Yacht</h2>
          <p className="text-gray-600 text-center mb-8">Dynamic pricing based on yacht and guest count</p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-6">
              {/* Yacht Selection */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3">Select Yacht</label>
                <select
                  value={formData.yachtName}
                  onChange={(e) => setFormData({ ...formData, yachtName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {yachts.map((yacht) => (
                    <option key={yacht.name} value={yacht.name}>
                      {yacht.name} - ${yacht.price}/day
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3">Booking Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-accent/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Price:</span>
                  <span className="text-3xl font-bold text-accent">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-lg"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
