"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, DollarSign, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
// Removed direct Supabase client - using API routes instead

interface Booking {
  id: string
  yacht_id: string
  yacht_name: string
  start_date: string
  end_date: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'approved' | 'checked'
  payment_id?: string
  payment_status?: 'pending' | 'completed' | 'failed'
  user_name?: string
  user_email?: string
  created_at: string
  updated_at: string
}

interface BookingsManagementProps {
  onStatusUpdate?: () => void
}

export default function BookingsManagement({ onStatusUpdate }: BookingsManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const url = new URL('/api/bookings', window.location.origin)
      if (statusFilter !== 'all') {
        url.searchParams.set('status', statusFilter)
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
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId)
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update booking status')
      }

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus as any }
            : booking
        )
      )
      
      onStatusUpdate?.()
    } catch (error) {
      console.error('Error updating booking:', error)
      alert(error instanceof Error ? error.message : 'Error updating booking status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      checked: { color: 'bg-purple-100 text-purple-800', icon: Eye },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Bookings Management
          </CardTitle>
          <CardDescription className="text-emerald-100">
            Manage yacht bookings and reservations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-emerald-700 font-medium">Filter by status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="checked">Checked</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={fetchBookings}
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Refresh
            </Button>
          </div>

          {/* Bookings Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-emerald-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
              <p className="text-emerald-600 text-lg font-medium">No bookings found</p>
              <p className="text-emerald-500">Bookings will appear here when customers make reservations.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-emerald-200">
                    <TableHead className="text-emerald-700 font-semibold">Yacht</TableHead>
                    <TableHead className="text-emerald-700 font-semibold">Customer</TableHead>
                    <TableHead className="text-emerald-700 font-semibold">Dates</TableHead>
                    <TableHead className="text-emerald-700 font-semibold">Guests</TableHead>
                    <TableHead className="text-emerald-700 font-semibold">Total</TableHead>
                    <TableHead className="text-emerald-700 font-semibold">Status</TableHead>
                    <TableHead className="text-emerald-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-emerald-100 hover:bg-emerald-50"
                    >
                      <TableCell className="font-medium text-emerald-800">
                        {booking.yacht_name}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-emerald-800">{booking.user_name}</p>
                          <p className="text-sm text-emerald-600">{booking.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                          <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-emerald-500" />
                          <span>{booking.guests}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-emerald-700">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(booking.total_price)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={updatingStatus === booking.id}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                disabled={updatingStatus === booking.id}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'approved')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={updatingStatus === booking.id}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                disabled={updatingStatus === booking.id}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, 'checked')}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              disabled={updatingStatus === booking.id}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mark Checked
                            </Button>
                          )}
                          {booking.status === 'checked' && (
                            <span className="text-sm text-gray-500 italic">Completed</span>
                          )}
                          {booking.status === 'cancelled' && (
                            <span className="text-sm text-red-500 italic">Cancelled</span>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
