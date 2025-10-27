// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar, Users, DollarSign, MapPin, Clock, CheckCircle, XCircle, Eye, Download } from "lucide-react"

// interface UserBooking {
//   id: string
//   yacht_id: string
//   yacht_name: string
//   start_date: string
//   end_date: string
//   guests: number
//   total_price: number
//   status: 'pending' | 'confirmed' | 'approved' | 'checked' | 'cancelled'
//   payment_id?: string
//   payment_status?: 'pending' | 'completed' | 'failed'
//   created_at: string
//   updated_at: string
// }

// export default function UserBookings() {
//   const [bookings, setBookings] = useState<UserBooking[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [statusFilter, setStatusFilter] = useState<string>('all')

//   useEffect(() => {
//     fetchBookings()
//   }, [statusFilter])

//   const fetchBookings = async () => {
//     try {
//       setIsLoading(true)
//       const url = new URL('/api/bookings', window.location.origin)
//       if (statusFilter !== 'all') {
//         url.searchParams.set('status', statusFilter)
//       }

//       const response = await fetch(url.toString())
//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to fetch bookings')
//       }

//       setBookings(data.bookings || [])
//     } catch (error) {
//       console.error('Error fetching bookings:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Review' },
//       confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
//       approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
//       checked: { color: 'bg-purple-100 text-purple-800', icon: Eye, label: 'Checked In' },
//       cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' }
//     }

//     const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
//     const Icon = config.icon

//     return (
//       <Badge className={`${config.color} flex items-center gap-1`}>
//         <Icon className="h-3 w-3" />
//         {config.label}
//       </Badge>
//     )
//   }

//   const getPaymentStatusBadge = (paymentStatus: string) => {
//     const statusConfig = {
//       pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Payment Pending' },
//       completed: { color: 'bg-green-100 text-green-800', label: 'Paid' },
//       failed: { color: 'bg-red-100 text-red-800', label: 'Payment Failed' }
//     }

//     const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.pending

//     return (
//       <Badge className={`${config.color} text-xs`}>
//         {config.label}
//       </Badge>
//     )
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount)
//   }

//   const getBookingDuration = (startDate: string, endDate: string) => {
//     const start = new Date(startDate)
//     const end = new Date(endDate)
//     const diffTime = Math.abs(end.getTime() - start.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   const downloadBookingDetails = (booking: UserBooking) => {
//     const content = `
// Booking Details
// ===============
// Booking ID: ${booking.id}
// Yacht: ${booking.yacht_name}
// Dates: ${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}
// Duration: ${getBookingDuration(booking.start_date, booking.end_date)} days
// Guests: ${booking.guests}
// Total Price: ${formatCurrency(booking.total_price)}
// Status: ${booking.status}
// Payment Status: ${booking.payment_status || 'N/A'}
// Created: ${formatDate(booking.created_at)}
//     `.trim()

//     const blob = new Blob([content], { type: 'text/plain' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `booking-${booking.id}.txt`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
//       <div className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="mb-8"
//         >
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
//           <p className="text-gray-600">View and manage your yacht reservations</p>
//         </motion.div>

//         {/* Filters */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.1 }}
//           className="mb-6"
//         >
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <label className="text-gray-700 font-medium">Filter by status:</label>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-48">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Bookings</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="confirmed">Confirmed</SelectItem>
//                   <SelectItem value="approved">Approved</SelectItem>
//                   <SelectItem value="checked">Checked In</SelectItem>
//                   <SelectItem value="cancelled">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button 
//               onClick={fetchBookings}
//               variant="outline"
//               size="sm"
//             >
//               Refresh
//             </Button>
//           </div>
//         </motion.div>

//         {/* Bookings List */}
//         {isLoading ? (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
//             ))}
//           </div>
//         ) : bookings.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-center py-12"
//           >
//             <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
//             <p className="text-gray-500 mb-6">You haven't made any yacht reservations yet.</p>
//             <Button onClick={() => window.location.href = '/yachts'}>
//               Browse Yachts
//             </Button>
//           </motion.div>
//         ) : (
//           <div className="space-y-6">
//             {bookings.map((booking, index) => (
//               <motion.div
//                 key={booking.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: index * 0.1 }}
//               >
//                 <Card className="hover:shadow-lg transition-shadow duration-300">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <CardTitle className="text-xl mb-2">{booking.yacht_name}</CardTitle>
//                         <CardDescription className="text-sm">
//                           Booking ID: {booking.id}
//                         </CardDescription>
//                       </div>
//                       <div className="flex gap-2">
//                         {getStatusBadge(booking.status)}
//                         {booking.payment_status && getPaymentStatusBadge(booking.payment_status)}
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-blue-600" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">Dates</p>
//                           <p className="text-sm text-gray-600">
//                             {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <Clock className="h-4 w-4 text-green-600" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">Duration</p>
//                           <p className="text-sm text-gray-600">
//                             {getBookingDuration(booking.start_date, booking.end_date)} days
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4 text-purple-600" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">Guests</p>
//                           <p className="text-sm text-gray-600">{booking.guests} people</p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <DollarSign className="h-4 w-4 text-orange-600" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">Total Price</p>
//                           <p className="text-sm text-gray-600 font-semibold">
//                             {formatCurrency(booking.total_price)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between pt-4 border-t">
//                       <div className="text-sm text-gray-500">
//                         Booked on {formatDate(booking.created_at)}
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => downloadBookingDetails(booking)}
//                         >
//                           <Download className="h-4 w-4 mr-2" />
//                           Download
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => window.location.href = `/yachts/${booking.yacht_id}`}
//                         >
//                           <Eye className="h-4 w-4 mr-2" />
//                           View Yacht
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, DollarSign, Clock, CheckCircle, XCircle, Eye, Download, User, MapPin } from "lucide-react"

interface UserBooking {
  id: string
  yacht_id: string
  yacht_name: string
  start_date: string
  end_date: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'approved' | 'checked' | 'cancelled'
  payment_id?: string
  payment_status?: 'pending' | 'completed' | 'failed'
  created_at: string
}

interface UserProfile {
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchUserProfile()
    fetchBookings()
  }, [statusFilter])

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile")
      const data = await res.json()
      if (res.ok) setUserProfile(data.profile)
    } catch (err) {
      console.error("Error loading user profile:", err)
    }
  }

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const url = new URL("/api/bookings", window.location.origin)
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter)
      const res = await fetch(url.toString())
      const data = await res.json()
      if (res.ok) setBookings(data.bookings || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)

  const getBookingDuration = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getStatusBadge = (status: string) => {
    const map = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
      approved: { label: "Approved", color: "bg-green-100 text-green-800" },
      checked: { label: "Checked In", color: "bg-purple-100 text-purple-800" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
    }
    const conf = map[status as keyof typeof map]
    return <Badge className={conf?.color}>{conf?.label}</Badge>
  }

  const downloadBookingPDF = (booking: UserBooking) => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Yacht Booking Confirmation", 14, 20)

    doc.setFontSize(12)
    doc.text(`Booking ID: ${booking.id}`, 14, 30)
    doc.text(`Yacht Name: ${booking.yacht_name}`, 14, 38)
    doc.text(`Dates: ${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`, 14, 46)
    doc.text(`Guests: ${booking.guests}`, 14, 54)
    doc.text(`Total Price: ${formatCurrency(booking.total_price)}`, 14, 62)
    doc.text(`Status: ${booking.status}`, 14, 70)
    doc.text(`Payment Status: ${booking.payment_status || "N/A"}`, 14, 78)
    doc.text(`Created On: ${formatDate(booking.created_at)}`, 14, 86)

    if (userProfile) {
      doc.text("User Information:", 14, 100)
      autoTable(doc, {
        startY: 105,
        head: [["Field", "Value"]],
        body: [
          ["Name", userProfile.full_name],
          ["Email", userProfile.email],
          ["Phone", userProfile.phone],
          ["Address", `${userProfile.address}, ${userProfile.city}, ${userProfile.state}, ${userProfile.country}`],
        ],
      })
    }

    doc.save(`Booking_${booking.id}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View, manage, and download your yacht reservations</p>
        </motion.div>

        {/* User Info */}
        {userProfile && (
          <Card className="mb-8 shadow-md border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <User className="h-5 w-5 text-blue-600" />
                User Profile
              </CardTitle>
              <CardDescription>Your personal information used for bookings</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <p><strong>Name:</strong> {userProfile.full_name}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Phone:</strong> {userProfile.phone}</p>
              <p><strong>Address:</strong> {`${userProfile.address}, ${userProfile.city}, ${userProfile.state}, ${userProfile.country}`}</p>
            </CardContent>
          </Card>
        )}

        {/* Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 items-center">
            <label className="text-gray-700 font-medium">Filter by status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Bookings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="checked">Checked In</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={fetchBookings}>Refresh</Button>
        </div>

        {/* Bookings */}
        {isLoading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">You haven’t booked any yachts.</p>
            <Button onClick={() => (window.location.href = "/yachts")}>Browse Yachts</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{b.yacht_name}</CardTitle>
                      <CardDescription className="text-sm">Booking ID: {b.id}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(b.status)}
                      {b.payment_status && (
                        <Badge className={
                          b.payment_status === "completed"
                            ? "bg-green-100 text-green-800"
                            : b.payment_status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }>
                          {b.payment_status === "completed"
                            ? "Paid"
                            : b.payment_status === "failed"
                            ? "Failed"
                            : "Pending"}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <Info label="Dates" value={`${formatDate(b.start_date)} - ${formatDate(b.end_date)}`} />
                      <Info label="Duration" value={`${getBookingDuration(b.start_date, b.end_date)} days`} />
                      <Info label="Guests" value={`${b.guests} people`} />
                      <Info label="Total Price" value={formatCurrency(b.total_price)} />
                    </div>

                    <div className="flex justify-between items-center border-t pt-4">
                      <p className="text-xs text-gray-500">Booked on {formatDate(b.created_at)}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => downloadBookingPDF(b)}>
                          <Download className="h-4 w-4 mr-2" /> PDF
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => (window.location.href = `/yachts/${b.yacht_id}`)}>
                          <Eye className="h-4 w-4 mr-2" /> View Yacht
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 🧩 Small info subcomponent
const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value}</p>
  </div>
)
