"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, AlertCircle, CheckCircle, User, LogIn } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import PaymentComponent from "./payment-component"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

interface Yacht {
  id: string
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

interface User {
  id: string
  email: string
  full_name?: string
}

export default function SmartBookingForm({ yacht, onBookingComplete }: BookingFormProps) {
  const [step, setStep] = useState<'details' | 'availability' | 'payment' | 'confirmation'>('details')
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [availability, setAvailability] = useState<any>(null)
  const [pricing, setPricing] = useState<any>(null)
  const [formData, setFormData] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    guests: 1,
    specialRequests: '',
  })

  const supabase = createClient()

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name
        })
      }
    }
    checkUser()
  }, [])

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const days = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))
    const basePrice = yacht.price * days
    const serviceCharge = basePrice * 0.1
    const tax = (basePrice + serviceCharge) * 0.15
    return basePrice + serviceCharge + tax
  }

  const checkAvailability = async () => {
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select start and end dates')
      return
    }

    if (formData.guests > yacht.capacity) {
      toast.error(`This yacht can only accommodate ${yacht.capacity} guests`)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yachtId: yacht.id,
          startDate: formData.startDate.toISOString().split('T')[0],
          endDate: formData.endDate.toISOString().split('T')[0],
          guests: formData.guests,
          specialRequests: formData.specialRequests
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresAuth) {
          toast.error('Please log in to make a booking')
          return
        }
        toast.error(data.error || 'Failed to check availability')
        return
      }

      setAvailability(data.availability)
      setPricing(data.pricing)
      setBookingId(data.booking.id)
      setStep('payment')
      toast.success('Availability confirmed! Proceed to payment.')
    } catch (error) {
      console.error('Availability check error:', error)
      toast.error('Failed to check availability. Please try again.')
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

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      toast.error('Login failed. Please try again.')
    }
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
          step === 'availability' ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600"
        )}>
          2
        </div>
        <div className="w-16 h-1 bg-gray-200 rounded"></div>
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          step === 'payment' ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600"
        )}>
          3
        </div>
        <div className="w-16 h-1 bg-gray-200 rounded"></div>
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          step === 'confirmation' ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600"
        )}>
          4
        </div>
      </div>

      {/* Authentication Check */}
      {!user && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <LogIn className="h-5 w-5" />
              Login Required
            </CardTitle>
            <CardDescription className="text-orange-700">
              You need to be logged in to make a booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full">
              <User className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Booking Details */}
      {step === 'details' && user && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Complete your yacht charter booking for {yacht.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Logged in as: {user.full_name || user.email}</span>
              </div>
            </div>

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
                      disabled={(date) => date < new Date()}
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
                      disabled={(date) => date < (formData.startDate || new Date())}
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
                  <div className="flex justify-between">
                    <span>Service Charge (10%):</span>
                    <span>${(yacht.price * Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (15%):</span>
                    <span>${(calculateTotalPrice() * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={checkAvailability}
              disabled={isLoading || !formData.startDate || !formData.endDate}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Availability...
                </>
              ) : (
                'Check Availability & Proceed'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Payment */}
      {step === 'payment' && bookingId && (
        <div className="space-y-4">
          {availability && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Availability Confirmed
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                <p> Yacht is available for your selected dates</p>
                <p> Capacity confirmed: {formData.guests} guests</p>
                <p> Remaining capacity: {availability.remainingCapacity} guests</p>
              </CardContent>
            </Card>
          )}
          
          <PaymentComponent
            bookingId={bookingId}
            amount={pricing?.totalPrice || calculateTotalPrice()}
            yachtName={yacht.name}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
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
                <div><strong>Total:</strong> ${(pricing?.totalPrice || calculateTotalPrice()).toLocaleString()}</div>
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



