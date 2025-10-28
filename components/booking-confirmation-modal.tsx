"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X, Calendar, Users, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  bookingDetails: {
    yachtName: string
    totalPrice: number
    startDate: Date
    endDate: Date | null
    guests: number
    bookingId: string
    paymentId?: string
  }
}

export default function BookingConfirmationModal({ 
  isOpen, 
  onClose, 
  bookingDetails 
}: BookingConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600">
              Your yacht reservation has been successfully created
            </p>
          </div>

          {/* Booking Details */}
          <Card className="p-4 mb-6 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Yacht</span>
                <span className="font-semibold">{bookingDetails.yachtName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Booking ID</span>
                <Badge variant="secondary" className="font-mono">
                  {bookingDetails.bookingId.substring(0, 8)}...
                </Badge>
              </div>
              
              {bookingDetails.paymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment ID</span>
                  <Badge variant="secondary" className="font-mono">
                    {bookingDetails.paymentId}
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dates</span>
                <span className="font-semibold">
                  {bookingDetails.startDate.toLocaleDateString()}
                  {bookingDetails.endDate && ` - ${bookingDetails.endDate.toLocaleDateString()}`}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Guests</span>
                <span className="font-semibold">{bookingDetails.guests} people</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${bookingDetails.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900">What's Next?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>You'll receive a confirmation email shortly</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Our team will contact you to finalize details</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Payment will be processed closer to your trip date</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would navigate to booking management
                alert("Redirecting to booking management...")
                onClose()
              }}
              className="flex-1"
            >
              View Booking
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
