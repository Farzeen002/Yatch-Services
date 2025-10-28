"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import PaymentComponent from "./payment-component"
import { toast } from "sonner"

interface Yacht {
  id: number
  name: string
  type: string
  price: number
  capacity: number
  length: string
  location: string
}

interface BookingFormProps {
  yacht: Yacht
  onBookingComplete?: (bookingId: string) => void
}

export default function BookingForm({ yacht, onBookingComplete }: BookingFormProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details')
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    guests: 1,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const days = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))
    return yacht.price * days
  }

  const handleSubmitDetails = async () => {
    if (!formData.startDate || !formData.endDate || !formData.contactName || !formData.contactEmail) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.guests > yacht.capacity) {
      toast.error(`This yacht can only accommodate ${yacht.capacity} guests`)
      return
    }

    if (formData.startDate >= formData.endDate) {
      toast.error('End date must be after start date')
      return
    }

    setIsLoading(true)
    try {
      // Here you would typically create a booking in your database
      // For now, we'll simulate it
      const mockBookingId = `booking_${Date.now()}`
      setBookingId(mockBookingId)
      setStep('payment')
      toast.success('Booking details saved! Proceed to payment.')
    } catch (error) {
      console.error('Booking creation error:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentId: string) => {
    setStep('confirmation')
    toast.success('Payment successful! Your booking is confirmed.')
    onBookingComplete?.(bookingId!)
  }

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          step === 'details' ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600"
        )}>
          1
        </div>
        <div className="w-16 h-1 bg-gray-200 rounded"></div>
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          step === 'payment' ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600"
        )}>
          2
        </div>
        <div className="w-16 h-1 bg-gray-200 rounded"></div>
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          step === 'confirmation' ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600"
        )}>
          3
        </div>
      </div>

      {/* Step 1: Booking Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Complete your yacht charter booking for {yacht.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Yacht Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{yacht.name}</h3>
              <p className="text-gray-600">{yacht.type} • {yacht.length} • {yacht.location}</p>
              <p className="text-sm text-gray-500">Capacity: {yacht.capacity} guests</p>
              <p className="text-lg font-semibold text-primary">${yacht.price}/day</p>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Guest Count */}
            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests *</Label>
              <Select
                value={formData.guests.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, guests: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of guests" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: yacht.capacity }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'guest' : 'guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Full Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <textarea
                id="specialRequests"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special requests or requirements?"
              />
            </div>

            {/* Price Summary */}
            {formData.startDate && formData.endDate && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Price Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Daily Rate:</span>
                    <span>${yacht.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmitDetails}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Payment */}
      {step === 'payment' && bookingId && (
        <PaymentComponent
          bookingId={bookingId}
          amount={calculateTotalPrice()}
          yachtName={yacht.name}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      {/* Step 3: Confirmation */}
      {step === 'confirmation' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Booking Confirmed!</CardTitle>
            <CardDescription>
              Your yacht charter has been successfully booked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Booking Details</h3>
              <div className="space-y-1 text-sm text-green-700">
                <div><strong>Yacht:</strong> {yacht.name}</div>
                <div><strong>Dates:</strong> {formData.startDate && formData.endDate ? 
                  `${format(formData.startDate, "PPP")} - ${format(formData.endDate, "PPP")}` : 'N/A'}</div>
                <div><strong>Guests:</strong> {formData.guests}</div>
                <div><strong>Total:</strong> ${calculateTotalPrice().toLocaleString()}</div>
                <div><strong>Booking ID:</strong> {bookingId}</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              You will receive a confirmation email with all the details and next steps. 
              Our team will contact you within 24 hours to finalize your charter arrangements.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}