"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  ArrowLeft,
  CreditCard,
  Ship
} from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Image from "next/image"

interface BookingDetails {
  id: string
  yacht_id: string
  yacht_name: string
  yacht_type: string
  yacht_location: string
  yacht_images: string[]
  start_date: string
  end_date: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'approved' | 'checked' | 'cancelled'
  payment_id?: string
  payment_status?: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function BookingDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingId, setBookingId] = useState<string>("")

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setBookingId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (!bookingId) return
    fetchBookingDetails()
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bookings/${bookingId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch booking details')
      }

      // Transform the data to match our interface
      const transformedBooking: BookingDetails = {
        ...data.booking,
        yacht_name: data.booking.yachts?.name || 'Unknown Yacht',
        yacht_type: data.booking.yachts?.type || 'Yacht',
        yacht_location: data.booking.yachts?.location || 'Unknown Location',
        yacht_images: data.booking.yachts?.images || []
      }

      setBooking(transformedBooking)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock, label: 'Pending Review' },
      confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle, label: 'Confirmed' },
      approved: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle, label: 'Approved' },
      checked: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Eye, label: 'Checked In' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, label: 'Cancelled' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-2 px-4 py-2 text-base border-2`}>
        <Icon className="h-5 w-5" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Payment Pending' },
      completed: { color: 'bg-green-100 text-green-800 border-green-300', label: 'Completed' },
      failed: { color: 'bg-red-100 text-red-800 border-red-300', label: 'Payment Failed' }
    }

    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge className={`${config.color} px-4 py-2 text-base border-2`}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getBookingDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const downloadBookingPDF = () => {
    if (!booking) return

    const content = `
═══════════════════════════════════════════════════════
           YACHT BOOKING CONFIRMATION
═══════════════════════════════════════════════════════

Booking ID: ${booking.id}

YACHT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Yacht Name:     ${booking.yacht_name}
Type:           ${booking.yacht_type}
Location:       ${booking.yacht_location}

BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Check-in:       ${formatDate(booking.start_date)}
Check-out:      ${formatDate(booking.end_date)}
Duration:       ${getBookingDuration(booking.start_date, booking.end_date)} days
Guests:         ${booking.guests} people

PAYMENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Price:    ${formatCurrency(booking.total_price)}
Payment ID:     ${booking.payment_id || 'N/A'}
Payment Status: ${booking.payment_status || 'N/A'}

BOOKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status:         ${booking.status.toUpperCase()}
Booked On:      ${formatDate(booking.created_at)} at ${formatTime(booking.created_at)}
Last Updated:   ${formatDate(booking.updated_at)} at ${formatTime(booking.updated_at)}

═══════════════════════════════════════════════════════
Thank you for choosing our yacht services!
For inquiries, contact: support@yachtservices.com
═══════════════════════════════════════════════════════
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-${booking.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/bookings")}>View All Bookings</Button>
        </div>
        <Footer />
      </main>
    )
  }

  const duration = getBookingDuration(booking.start_date, booking.end_date)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/bookings")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Yacht Image Header */}
          <Card className="overflow-hidden mb-6">
            <div className="relative h-64 md:h-80">
              {booking.yacht_images && booking.yacht_images.length > 0 ? (
                <img
                  src={booking.yacht_images[0]}
                  alt={booking.yacht_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center">
                  <Ship className="h-24 w-24 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{booking.yacht_name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {booking.yacht_location}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    {booking.yacht_type}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Booking Status</span>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payment Status</span>
                      {getPaymentStatusBadge(booking.payment_status || 'pending')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Booking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Check-in Date</p>
                      <p className="text-lg font-semibold">{formatDate(booking.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Check-out Date</p>
                      <p className="text-lg font-semibold">{formatDate(booking.end_date)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-lg font-semibold">{duration} {duration === 1 ? 'day' : 'days'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="text-lg font-semibold">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking ID */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Booking Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Booking ID</p>
                      <p className="font-mono text-sm font-semibold">{booking.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Payment Summary */}
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{duration} {duration === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Price</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(booking.total_price)}
                      </span>
                    </div>
                  </div>

                  {booking.payment_id && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">Payment ID</p>
                          <p className="font-mono text-xs font-semibold break-all">{booking.payment_id}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Booking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Booking Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Booked On</p>
                    <p className="font-semibold">{formatDate(booking.created_at)}</p>
                    <p className="text-xs text-gray-500">{formatTime(booking.created_at)}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-semibold">{formatDate(booking.updated_at)}</p>
                    <p className="text-xs text-gray-500">{formatTime(booking.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={downloadBookingPDF}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => router.push(`/yachts/${booking.yacht_id}`)}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Yacht Details
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
