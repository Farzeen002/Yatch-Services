"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface Booking {
  id: string
  yacht_id: string
  user_id: string
  start_date: string
  end_date: string
  guests: number
  total_price: number
  status: string
  created_at: string
  updated_at: string
  yachts?: {
    name: string
    type: string
    location: string
  }
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    try {
      const url = new URL('/api/bookings', window.location.origin)
      if (filter !== 'all') {
        url.searchParams.set('status', filter)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings')
      }

      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update booking')
      }

      // Refresh bookings
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      alert(error instanceof Error ? error.message : 'Failed to update booking status')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Manage Bookings
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            View and manage all yacht bookings
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === filterOption.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        <div className="grid gap-6">
        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
              <div className="text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p>There are no bookings matching your current filter.</p>
              </div>
          </Card>
        ) : (
            bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Yacht Image */}
                    <div className="bg-linear-to-br from-primary to-blue-900 p-8 flex items-center justify-center w-full md:w-48 h-48">
                      <span className="text-6xl">{booking.image}</span>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {booking.yachts?.name || 'Unknown Yacht'}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{booking.yachts?.type}</Badge>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.yachts?.location}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} border-0`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                            </Badge>
                        </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{formatDate(booking.start_date)}</div>
                            <div className="text-muted-foreground">Start Date</div>
                          </div>
                          </div>
                          <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{formatDate(booking.end_date)}</div>
                            <div className="text-muted-foreground">End Date</div>
                          </div>
                          </div>
                          <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{booking.guests} guests</div>
                            <div className="text-muted-foreground">
                              {calculateNights(booking.start_date, booking.end_date)} nights
                            </div>
                          </div>
                          </div>
                          <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">${booking.total_price.toLocaleString()}</div>
                            <div className="text-muted-foreground">Total Price</div>
                          </div>
                          </div>
                        </div>
                      </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </Button>
                          <Button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Booking
                        </Button>
                      )}
                      {booking.status === 'cancelled' && (
                        <Button
                          onClick={() => updateBookingStatus(booking.id, 'pending')}
                          variant="outline"
                          className="w-full"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
        )}
        </div>
      </div>
    </section>
  )
}
