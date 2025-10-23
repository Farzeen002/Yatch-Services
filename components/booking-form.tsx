"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import BookingCalendar from "./booking-calendar"

interface BookingFormProps {
  onBooking: (booking: any) => void
}

export default function BookingForm({ onBooking }: BookingFormProps) {
  const [formData, setFormData] = useState({
    yachtName: "Luxury Catamaran",
    guests: 4,
  })
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date | null; isMultiDay: boolean } | null>(null)

  const yachts = [
    { name: "Luxury Catamaran", price: 5000, unavailableDates: [new Date(2024, 11, 15), new Date(2024, 11, 16)] },
    { name: "Private Speedboat", price: 3000, unavailableDates: [new Date(2024, 11, 10), new Date(2024, 11, 11)] },
    { name: "Mega Yacht", price: 15000, unavailableDates: [new Date(2024, 11, 20), new Date(2024, 11, 21)] },
    { name: "Sailing Vessel", price: 4000, unavailableDates: [new Date(2024, 11, 12), new Date(2024, 11, 13)] },
  ]

  const selectedYacht = yachts.find((y) => y.name === formData.yachtName)
  
  const calculateTotalPrice = () => {
    if (!selectedYacht || !selectedDates) return 0
    
    if (selectedDates.isMultiDay && selectedDates.end) {
      const nights = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
      return selectedYacht.price * nights * (formData.guests / 4)
    }
    
    return selectedYacht.price * (formData.guests / 4)
  }
  
  const totalPrice = calculateTotalPrice()

  const handleDateSelect = (dates: { start: Date; end: Date | null; isMultiDay: boolean }) => {
    setSelectedDates(dates)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDates) {
      onBooking({
        ...formData,
        dates: selectedDates,
        totalPrice,
        timestamp: new Date().toISOString(),
      })
      setFormData({ yachtName: "Luxury Catamaran", guests: 4 })
      setSelectedDates(null)
      alert("Booking confirmed! Reference ID: #" + Math.random().toString(36).substr(2, 9).toUpperCase())
    } else {
      alert("Please select your dates first")
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
                <label className="block text-sm font-semibold text-primary mb-3">Select Your Dates</label>
                <BookingCalendar
                  onDateSelect={handleDateSelect}
                  unavailableDates={selectedYacht?.unavailableDates || []}
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
