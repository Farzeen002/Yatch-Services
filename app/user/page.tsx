// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar, Eye, Download, User } from "lucide-react"
// import Navigation from "@/components/navigation"
// import Footer from "@/components/footer"

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
// }

// interface UserProfile {
//   full_name: string
//   email: string
//   phone: string
//   address: string
//   city: string
//   state: string
//   country: string
// }

// export default function UserBookings() {
//   const [bookings, setBookings] = useState<UserBooking[]>([])
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [statusFilter, setStatusFilter] = useState<string>("all")

//   useEffect(() => {
//     fetchUserProfile()
//     fetchBookings()
//   }, [statusFilter])

//   const fetchUserProfile = async () => {
//     try {
//       const res = await fetch("/api/user/profile")
//       const data = await res.json()
//       if (res.ok) setUserProfile(data.profile)
//     } catch (err) {
//       console.error("Error loading user profile:", err)
//     }
//   }

//   const fetchBookings = async () => {
//     try {
//       setIsLoading(true)
//       const url = new URL("/api/bookings", window.location.origin)
//       if (statusFilter !== "all") url.searchParams.set("status", statusFilter)
//       const res = await fetch(url.toString())
//       const data = await res.json()
//       if (res.ok) setBookings(data.bookings || [])
//     } catch (error) {
//       console.error("Error fetching bookings:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

//   const getBookingDuration = (start: string, end: string) => {
//     const diffDays =
//       Math.floor(
//         (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
//       ) + 1
//     return Math.max(1, diffDays)
//   }

//   const getStatusBadge = (status: string) => {
//     const map = {
//       pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
//       confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
//       approved: { label: "Approved", color: "bg-green-100 text-green-800" },
//       checked: { label: "Checked In", color: "bg-purple-100 text-purple-800" },
//       cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
//     }
//     const conf = map[status as keyof typeof map]
//     return <Badge className={conf?.color}>{conf?.label}</Badge>
//   }

//   const downloadBookingPDF = (booking: UserBooking) => {
//     const doc = new jsPDF()
//     doc.setFontSize(16)
//     doc.text("Yacht Booking Confirmation", 14, 20)

//     doc.setFontSize(12)
//     doc.text(`Booking ID: ${booking.id}`, 14, 30)
//     doc.text(`Yacht Name: ${booking.yacht_name}`, 14, 38)
//     doc.text(`Dates: ${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`, 14, 46)
//     doc.text(`Guests: ${booking.guests}`, 14, 54)
//     doc.text(`Total Price: ${formatCurrency(booking.total_price)}`, 14, 62)
//     doc.text(`Status: ${booking.status}`, 14, 70)
//     doc.text(`Payment Status: ${booking.payment_status || "N/A"}`, 14, 78)
//     doc.text(`Created On: ${formatDate(booking.created_at)}`, 14, 86)

//     if (userProfile) {
//       doc.text("User Information:", 14, 100)
//       autoTable(doc, {
//         startY: 105,
//         head: [["Field", "Value"]],
//         body: [
//           ["Name", userProfile.full_name],
//           ["Email", userProfile.email],
//           ["Phone", userProfile.phone],
//           ["Address", `${userProfile.address}, ${userProfile.city}, ${userProfile.state}, ${userProfile.country}`],
//         ],
//       })
//     }

//     doc.save(`Booking_${booking.id}.pdf`)
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       <main className="max-w-7xl mx-auto px-4 py-10">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
//           <p className="text-gray-600">View, manage, and download your yacht reservations</p>
//         </motion.div>

//         {/* User Profile Card */}
//         {userProfile && (
//           <Card className="mb-6 shadow-md border border-gray-100">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
//                 <User className="h-5 w-5 text-blue-600" /> User Profile
//               </CardTitle>
//               <CardDescription>Your personal information used for bookings</CardDescription>
//             </CardHeader>
//             <CardContent className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
//               <p><strong>Name:</strong> {userProfile.full_name}</p>
//               <p><strong>Email:</strong> {userProfile.email}</p>
//               <p><strong>Phone:</strong> {userProfile.phone}</p>
//               <p><strong>Address:</strong> {`${userProfile.address}, ${userProfile.city}, ${userProfile.state}, ${userProfile.country}`}</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Filter and Refresh */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex gap-3 items-center">
//             <label className="text-gray-700 font-medium">Filter by status:</label>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-48">
//                 <SelectValue placeholder="All Bookings" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="confirmed">Confirmed</SelectItem>
//                 <SelectItem value="approved">Approved</SelectItem>
//                 <SelectItem value="checked">Checked In</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Button variant="outline" onClick={fetchBookings}>Refresh</Button>
//         </div>

//         {/* Bookings List */}
//         {isLoading ? (
//           <p className="text-center text-gray-500 py-20">Loading bookings...</p>
//         ) : bookings.length === 0 ? (
//           <div className="text-center py-20">
//             <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
//             <p className="text-gray-500 mb-6">You haven’t booked any yachts.</p>
//             <Button onClick={() => (window.location.href = "/yachts")}>Browse Yachts</Button>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 gap-6">
//             {bookings.map((b, i) => (
//               <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
//                 <Card className="hover:shadow-lg transition-all">
//                   <CardHeader className="flex justify-between items-start">
//                     <div>
//                       <CardTitle className="text-lg font-bold text-gray-900">{b.yacht_name}</CardTitle>
//                       <CardDescription className="text-sm">Booking ID: {b.id}</CardDescription>
//                     </div>
//                     <div className="flex gap-2">
//                       {getStatusBadge(b.status)}
//                       {b.payment_status && (
//                         <Badge className={
//                           b.payment_status === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : b.payment_status === "failed"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-yellow-100 text-yellow-800"
//                         }>
//                           {b.payment_status === "completed" ? "Paid" : b.payment_status === "failed" ? "Failed" : "Pending"}
//                         </Badge>
//                       )}
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid md:grid-cols-2 gap-4 mb-4">
//                       <Info label="Dates" value={`${formatDate(b.start_date)} - ${formatDate(b.end_date)}`} />
//                       <Info label="Duration" value={`${getBookingDuration(b.start_date, b.end_date)} days`} />
//                       <Info label="Guests" value={`${b.guests} people`} />
//                       <Info label="Total Price" value={formatCurrency(b.total_price)} />
//                     </div>
//                     <div className="flex justify-between items-center border-t pt-4">
//                       <p className="text-xs text-gray-500">Booked on {formatDate(b.created_at)}</p>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm" onClick={() => downloadBookingPDF(b)}>
//                           <Download className="h-4 w-4 mr-2" /> PDF
//                         </Button>
//                         <Button variant="outline" size="sm" onClick={() => (window.location.href = `/yachts/${b.yacht_id}`)}>
//                           <Eye className="h-4 w-4 mr-2" /> View Yacht
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </main>

//       <Footer />
//     </div>
//   )
// }

// // Small info subcomponent
// const Info = ({ label, value }: { label: string; value: string }) => (
//   <div>
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className="text-sm font-medium text-gray-800">{value}</p>
//   </div>
// )


"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Separator } from "@/components/ui/separator";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Calendar, Eye, Download, User, Search, Info as InfoIcon, ChevronLeft, ChevronRight, HelpCircle, AlertCircle, DollarSign as DollarSignIcon
} from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UserBooking {
  id: string
  yacht_id: string
  yacht_name: string
  yacht_image?: string
  yacht_images?: string[]
  start_date: string
  end_date: string
  guests: number
  total_price: number
  status: "pending" | "confirmed" | "approved" | "checked" | "cancelled"
  payment_id?: string
  payment_status?: "pending" | "completed" | "failed"
  payment_mode?: string
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
  const [filteredBookings, setFilteredBookings] = useState<UserBooking[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [yachts, setYachts] = useState<any[]>([]);
  
  // Help/Support states
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [issueType, setIssueType] = useState<string>("")
  const [issueDetails, setIssueDetails] = useState<string>("")
  const [isSubmittingHelp, setIsSubmittingHelp] = useState(false)
  const [helpSubmitted, setHelpSubmitted] = useState(false)

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

  const fetchYachts = async () => {
    try {
      const res = await fetch("/api/yachts");
      const data = await res.json();
      const yachtsData = data.yachts ?? data ?? [];
      setYachts(yachtsData);
    } catch (error) {
      console.error("Error fetching yachts:", error);
    }
  };

  // const fetchBookings = async () => {
  //   try {
  //     setIsLoading(true)
  //     const url = new URL("/api/bookings", window.location.origin)
  //     if (statusFilter !== "all") url.searchParams.set("status", statusFilter)
  //     const res = await fetch(url.toString())
  //     const data = await res.json()
  //     if (res.ok) {
  //       // Ensure yacht_images array exists
  //       const withImages = (data.bookings || []).map((b: any) => ({
  //         ...b,
  //         yacht_images: b.yacht_images || (b.yacht_image ? [b.yacht_image] : []),
  //       }))
  //       setBookings(withImages)
  //       setFilteredBookings(withImages)
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bookings:", error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const fetchBookings = async () => {
  //   try {
  //     setIsLoading(true);
  //     const url = new URL("/api/bookings", window.location.origin);
  //     if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
  //     const res = await fetch(url.toString());
  //     const data = await res.json();

  //     if (res.ok) {
  //       const bookingsWithYachts = (data.bookings || []).map((b: any) => {
  //         const matchingYacht = yachts.find(
  //           (y) => y.name?.trim().toLowerCase() === b.yacht_name?.trim().toLowerCase()
  //         );

  //         const images = matchingYacht?.images?.length
  //           ? matchingYacht.images
  //           : b.yacht_images || (b.yacht_image ? [b.yacht_image] : []);

  //         return {
  //           ...b,
  //           yacht_images: images,
  //           yacht_image: images[0] || "/default-yacht.jpg",
  //           amenities: matchingYacht?.amenities ?? [],
  //           crew: matchingYacht?.crew ?? 0,
  //           location: matchingYacht?.location ?? "",
  //         };
  //       });

  //       setBookings(bookingsWithYachts);
  //       setFilteredBookings(bookingsWithYachts);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bookings:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const url = new URL("/api/bookings", window.location.origin);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
      const res = await fetch(url.toString());
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to fetch bookings");
      }

      const data = await res.json();

      const formatted = (data.bookings || []).map((b: any) => ({
        ...b,
        yacht_name: b.yachts?.name || "Unknown Yacht",
        yacht_image: b.yachts?.images?.length > 0 ? b.yachts.images[0] : "/placeholder.jpg",
        yacht_images: b.yachts?.images || [],
        location: b.yachts?.location || "Unknown",
        // Use payment_id or razorpay_payment_id as fallback
        payment_id: b.payment_id || b.razorpay_payment_id || null,
      }));

      setBookings(formatted);
      setFilteredBookings(formatted);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchYachts();
      setIsLoading(false);
    };
    init();
  }, []); // load yachts only once

  useEffect(() => {
    if (yachts.length === 0) return;
    fetchBookings();
  }, [statusFilter, yachts]);



  useEffect(() => {
    const filtered = bookings.filter((b) =>
      (b.yacht_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBookings(filtered)
  }, [searchTerm, bookings])

  const nextImage = () => {
    if (!selectedBooking?.yacht_images?.length) return
    setCurrentImage((prev) =>
      prev === selectedBooking.yacht_images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!selectedBooking?.yacht_images?.length) return
    setCurrentImage((prev) =>
      prev === 0 ? selectedBooking.yacht_images.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    if (!selectedBooking?.yacht_images?.length) return
    const timer = setInterval(nextImage, 5000)
    return () => clearInterval(timer)
  }, [selectedBooking])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  const getBookingDuration = (start: string, end: string) => {
    const diffDays =
      Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1
    return Math.max(1, diffDays)
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

  const openBookingDetails = (booking: UserBooking) => {
    setSelectedBooking(booking)
    setCurrentImage(0)
    setModalOpen(true)
  }

  const openHelpDialog = () => {
    setHelpModalOpen(true)
    setIssueType("")
    setIssueDetails("")
    setHelpSubmitted(false)
  }

  const handleHelpSubmit = async () => {
    if (!issueType || !issueDetails.trim() || !selectedBooking) {
      alert("Please select an issue type and provide details")
      return
    }

    try {
      setIsSubmittingHelp(true)
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          yachtName: selectedBooking.yacht_name,
          issueType,
          issueDetails,
          userEmail: userProfile?.email,
          userName: userProfile?.full_name,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setHelpSubmitted(true)
        setTimeout(() => {
          setHelpModalOpen(false)
          setIssueType("")
          setIssueDetails("")
        }, 2000)
      } else {
        alert(data.error || "Failed to submit support request")
      }
    } catch (error) {
      console.error("Error submitting help request:", error)
      alert("Failed to submit support request. Please try again.")
    } finally {
      setIsSubmittingHelp(false)
    }
  }

  const downloadBookingPDF = (booking: UserBooking) => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Yacht Booking Details", 14, 20)

    doc.setFontSize(12)
    doc.text(`Booking ID: ${booking.id}`, 14, 30)
    doc.text(`Yacht Name: ${booking.yacht_name}`, 14, 38)
    doc.text(`Duration: ${getBookingDuration(booking.start_date, booking.end_date)} days`, 14, 46)
    doc.text(`Dates: ${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`, 14, 54)
    doc.text(`Guests: ${booking.guests}`, 14, 62)
    doc.text(`Total Price: ${formatCurrency(booking.total_price)}`, 14, 70)
    doc.text(`Status: ${booking.status}`, 14, 78)
    doc.text(`Payment Mode: ${booking.payment_mode || "Online"}`, 14, 86)
    doc.text(`Payment ID: ${booking.payment_id || "N/A"}`, 14, 94)
    doc.text(`Payment Status: ${booking.payment_status || "N/A"}`, 14, 102)
    doc.text(`Booked On: ${formatDate(booking.created_at)} at ${formatTime(booking.created_at)}`, 14, 110)

    if (userProfile) {
      doc.text("Customer Details:", 14, 125)
      autoTable(doc, {
        startY: 130,
        head: [["Field", "Value"]],
        body: [
          ["Name", userProfile.full_name],
          ["Email", userProfile.email],
          ["Phone", userProfile.phone],
          [
            "Address",
            `${userProfile.address}, ${userProfile.city}, ${userProfile.state}, ${userProfile.country}`,
          ],
        ],
      })
    }

    doc.save(`Booking_${booking.id}.pdf`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View, manage, and download your yacht reservations</p>
        </motion.div>

        {/* 🔍 Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3 mt-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by yacht name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-medium hidden md:block">Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
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
            <Button variant="outline" onClick={fetchBookings}>Refresh</Button>
          </div>
        </div>

        {/* Bookings Grid */}
        {isLoading ? (
          <p className="text-center text-gray-500 py-20">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
            <Button onClick={() => (window.location.href = "/yachts")}>Browse Yachts</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredBookings.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <img
                      src={b.yacht_image || "/placeholder.jpg"}
                      alt={b.yacht_name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <CardTitle className="text-lg font-bold text-gray-900">{b.yacht_name}</CardTitle>
                    <CardDescription className="text-sm">Booking ID: {b.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Info label="Duration" value={`${getBookingDuration(b.start_date, b.end_date)} days`} />
                      <Info label="Booked On" value={`${formatDate(b.created_at)} at ${formatTime(b.created_at)}`} />
                      <Info label="Payment ID" value={b.payment_id || "N/A"} />
                      <Info label="Total Price" value={formatCurrency(b.total_price)} />
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <div className="flex gap-2">
                        {getStatusBadge(b.status)}
                        {b.payment_status && (
                          <Badge
                            className={
                              b.payment_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : b.payment_status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {b.payment_status}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => downloadBookingPDF(b)}>
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                        <Button size="sm" onClick={() => openBookingDetails(b)}>
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}


        {/* Booking Details Modal with Image Carousel */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
            {/* Accessibility Title */}
            <DialogTitle className="sr-only">Booking Details</DialogTitle>

            {selectedBooking && (
              <div className="flex flex-col">
                {/* ====== Header Image Section ====== */}
                <div className="relative h-72 w-full">
                  <img
                    src={
                      selectedBooking.yacht_images?.[currentImage] ||
                      selectedBooking.yacht_image ||
                      "/placeholder.jpg"
                    }
                    alt={selectedBooking.yacht_name}
                    className="object-cover w-full h-full"
                  />

                  {selectedBooking.yacht_images?.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white transition p-2 rounded-full shadow"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white transition p-2 rounded-full shadow"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-800" />
                      </button>
                    </>
                  )}

                  {/* Image Dots */}
                  {selectedBooking.yacht_images?.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {selectedBooking.yacht_images.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full transition-all ${i === currentImage ? "bg-white" : "bg-white/50"
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ====== Booking Info Section ====== */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedBooking.yacht_name}
                    </h2>
                    <Badge
                      variant={
                        selectedBooking.status === "confirmed"
                          ? "success"
                          : selectedBooking.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>

                  <Separator className="my-3" />

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <Info label="Booking ID" value={selectedBooking.id} />
                    <Info
                      label="Dates"
                      value={`${formatDate(selectedBooking.start_date)} → ${formatDate(
                        selectedBooking.end_date
                      )}`}
                    />
                    <Info
                      label="Duration"
                      value={`${getBookingDuration(
                        selectedBooking.start_date,
                        selectedBooking.end_date
                      )} days`}
                    />
                    <Info label="Guests" value={selectedBooking.guests} />
                    <Info label="Total Price" value={formatCurrency(selectedBooking.total_price)} />
                    <Info label="Payment Mode" value={selectedBooking.payment_mode || "Online"} />
                    <Info label="Payment ID" value={selectedBooking.payment_id || "N/A"} />
                    <Info label="Payment Status" value={selectedBooking.payment_status || "Pending"} />
                    <Info
                      label="Booked On"
                      value={`${formatDate(selectedBooking.created_at)} at ${formatTime(
                        selectedBooking.created_at
                      )}`}
                    />
                  </div>

                  {/* ====== Customer Info ====== */}
                  {userProfile && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Customer Info</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <Info label="Name" value={userProfile.full_name} />
                        <Info label="Email" value={userProfile.email} />
                        <Info label="Phone" value={userProfile.phone} />
                        <Info
                          label="Address"
                          value={`${userProfile.address}, ${userProfile.city}, ${userProfile.state}, ${userProfile.country}`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6 gap-3">
                    <Button
                      variant="outline"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50 transition-all rounded-xl shadow-md"
                      onClick={openHelpDialog}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" /> Help & Support
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 transition-all rounded-xl shadow-md"
                      onClick={() => downloadBookingPDF(selectedBooking)}
                    >
                      <Download className="h-4 w-4 mr-2" /> Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Help & Support Modal */}
        <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-orange-600" />
                Help & Support
              </DialogTitle>
              <DialogDescription>
                {selectedBooking && (
                  <span className="text-sm text-gray-600">
                    Booking: {selectedBooking.yacht_name} (ID: {selectedBooking.id})
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {helpSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Support Request Submitted!
                </h3>
                <p className="text-gray-600">
                  Our support team will contact you shortly at {userProfile?.email}
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                {/* Issue Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">What can we help you with?</Label>
                  <RadioGroup value={issueType} onValueChange={setIssueType}>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="cancel" id="cancel" />
                      <Label htmlFor="cancel" className="flex items-center gap-2 cursor-pointer flex-1">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium">Cancel Booking</p>
                          <p className="text-sm text-gray-500">Request cancellation for this booking</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="refund" id="refund" />
                      <Label htmlFor="refund" className="flex items-center gap-2 cursor-pointer flex-1">
                        <DollarSignIcon className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Request Refund</p>
                          <p className="text-sm text-gray-500">Request a refund for your payment</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="modification" id="modification" />
                      <Label htmlFor="modification" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Modify Booking</p>
                          <p className="text-sm text-gray-500">Change dates, guests, or other details</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="payment" id="payment" />
                      <Label htmlFor="payment" className="flex items-center gap-2 cursor-pointer flex-1">
                        <DollarSignIcon className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">Payment Issue</p>
                          <p className="text-sm text-gray-500">Report payment or billing problems</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="flex items-center gap-2 cursor-pointer flex-1">
                        <HelpCircle className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Other Issue</p>
                          <p className="text-sm text-gray-500">Report any other concern or question</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Issue Details */}
                {issueType && (
                  <div className="space-y-3">
                    <Label htmlFor="details" className="text-base font-semibold">
                      Please provide details about your {issueType === "cancel" ? "cancellation" : issueType === "refund" ? "refund request" : issueType === "modification" ? "modification" : issueType === "payment" ? "payment issue" : "issue"}
                    </Label>
                    <Textarea
                      id="details"
                      placeholder={
                        issueType === "cancel"
                          ? "Please explain why you want to cancel this booking..."
                          : issueType === "refund"
                          ? "Please explain why you're requesting a refund..."
                          : issueType === "modification"
                          ? "Please describe what you would like to change..."
                          : issueType === "payment"
                          ? "Please describe the payment issue you're experiencing..."
                          : "Please describe your issue in detail..."
                      }
                      value={issueDetails}
                      onChange={(e) => setIssueDetails(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Our support team typically responds within 24 hours
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setHelpModalOpen(false)}
                    disabled={isSubmittingHelp}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleHelpSubmit}
                    disabled={!issueType || !issueDetails.trim() || isSubmittingHelp}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmittingHelp ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="text-sm">
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
)
