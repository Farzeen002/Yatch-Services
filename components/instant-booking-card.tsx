"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, Zap, Shield, CreditCard } from "lucide-react"
import BookingCalendar from "./booking-calendar"
import BookingConfirmationModal from "./booking-confirmation-modal"

interface InstantBookingCardProps {
  yacht: {
    id: number
    name: string
    type: string
    price: number
    guests: number
    amenities: string[]
    unavailableDates: Date[]
  }
  className?: string
}

export default function InstantBookingCard({ yacht, className = "" }: InstantBookingCardProps) {
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date | null; isMultiDay: boolean } | null>(null)
  const [guests, setGuests] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  const calculateTotalPrice = () => {
    if (!selectedDates) return yacht.price
    
    if (selectedDates.isMultiDay && selectedDates.end) {
      const nights = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
      return yacht.price * nights
    }
    
    return yacht.price
  }

  const handleInstantBook = () => {
    if (!selectedDates) {
      alert("Please select your dates first")
      return
    }

    const totalPrice = calculateTotalPrice()
    const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase()
    
    setBookingDetails({
      yachtName: yacht.name,
      totalPrice,
      startDate: selectedDates.start,
      endDate: selectedDates.end,
      guests,
      bookingId
    })
    
    setShowConfirmation(true)
  }

  const getDateRangeText = () => {
    if (!selectedDates?.start) return "Select dates"
    
    if (selectedDates.isMultiDay && selectedDates.end) {
      const nights = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
      return `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()} (${nights} nights)`
    }
    
    return selectedDates.start.toLocaleDateString()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-6 ${className}`}
      >
        <Card className="p-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-900">Instant Book</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Available
            </Badge>
          </div>

          {/* Price Display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                ${yacht.price.toLocaleString()}
              </span>
              <span className="text-gray-600">/day</span>
            </div>
            {selectedDates && (
              <div className="mt-2">
                <div className="text-sm text-gray-600">Total for selected dates:</div>
                <div className="text-xl font-bold text-primary">
                  ${calculateTotalPrice().toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Select Dates
            </Label>
            <BookingCalendar
              onDateSelect={setSelectedDates}
              unavailableDates={yacht.unavailableDates}
              yachtId={yacht.id}
            />
          </div>

          {/* Guest Count */}
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Number of Guests
            </Label>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Input
                type="number"
                min="1"
                max={yacht.guests}
                value={guests}
                onChange={(e) => setGuests(Math.min(parseInt(e.target.value) || 1, yacht.guests))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">max {yacht.guests}</span>
            </div>
          </div>

          {/* Quick Summary */}
          {selectedDates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Yacht</span>
                  <span className="font-medium">{yacht.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates</span>
                  <span className="font-medium">{getDateRangeText()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{guests} people</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Instant Book Button */}
          <Button
            onClick={handleInstantBook}
            disabled={!selectedDates}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            ⚡ INSTANT BOOK
          </Button>

          {/* Trust Indicators */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure booking with SSL encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>You won't be charged yet</span>
            </div>
          </div>

          {/* Special Offers */}
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">Special Offer</span>
            </div>
            <p className="text-xs text-orange-700">
              Book for 3+ days and get 10% off your total booking!
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        bookingDetails={bookingDetails}
      />
    </>
  )
}
