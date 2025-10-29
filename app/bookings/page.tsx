// "use client";

// import { useState, useEffect, useMemo } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import { motion } from "framer-motion";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Users, Clock, Ship, Edit, Eye, ChevronLeft, ChevronRight } from "lucide-react";
// import BookingDetailsModal from "@/components/BookingDetailsModal";
// import BookingStats from "@/components/BookingStats";
// import Navigation from "@/components/navigation";
// import Footer from "@/components/footer";
// import { createClient } from "@/utils/supabase/client";

// type ViewMode = "grid" | "list";
// type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
// type PaymentStatus = "paid" | "partial" | "unpaid" | "refunded";

// interface MediaItem {
//   type: "image" | "video";
//   src: string;
// }

// interface Booking {
//   id: string;
//   yachtName: string;
//   status: BookingStatus;
//   paymentStatus: PaymentStatus;
//   startDate: string;
//   endDate: string;
//   guests: number;
//   location: string;
//   price: number;
//   paidAmount: number;
//   bookingRef: string;
//   customerName: string;
//   customerEmail: string;
//   customerPhone: string;
//   notes: string;
//   amenities: string[];
//   crew: number;
//   media: MediaItem[];
// }

// export default function BookingsManagement() {
//   const supabase = createClient();

//   const [viewMode] = useState<ViewMode>("grid");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [paymentFilter, setPaymentFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("date-desc");
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(false);

//   //  Update Booking Status
//   const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
//     try {
//       setLoading(true);
//       const { error } = await supabase
//         .from("bookings")
//         .update({ status: newStatus })
//         .eq("id", bookingId);

//       if (error) throw error;

//       setBookings((prev) =>
//         prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
//       );
//     } catch (error) {
//       console.error("Error updating booking status:", error);
//       alert("Failed to update booking status");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch bookings from Supabase
//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/bookings/user");
//       const json = await res.json();

//       if (!json.success) throw new Error(json.error);
//       const formattedBookings = json.bookings.map((b: any) => ({
//         id: b.id,
//         yachtName: b.yachtName,
//         status: b.status,
//         paymentStatus: b.paymentStatus,
//         startDate: b.startDate,
//         endDate: b.endDate,
//         guests: b.guests,
//         location: b.location,
//         price: b.totalPrice,
//         paidAmount: b.totalPrice,
//         bookingRef: b.id.slice(0, 8).toUpperCase(),
//         customerName: "Customer",
//         customerEmail: "customer@email.com",
//         customerPhone: "+0000000000",
//         notes: "",
//         amenities: [],
//         crew: 4,
//         media: [{ type: "image", src: b.yachtImage }],
//       }));

//       setBookings(formattedBookings);
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   // Filtering + sorting
//   const filteredAndSortedBookings = useMemo(() => {
//     let result = [...bookings];
//     if (searchQuery) {
//       result = result.filter(
//         (b) =>
//           b.yachtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           b.location.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
//     if (paymentFilter !== "all") result = result.filter((b) => b.paymentStatus === paymentFilter);

//     result.sort((a, b) => {
//       switch (sortBy) {
//         case "date-desc": return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
//         case "date-asc": return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
//         case "price-desc": return b.price - a.price;
//         case "price-asc": return a.price - b.price;
//         case "name": return a.yachtName.localeCompare(b.yachtName);
//         default: return 0;
//       }
//     });
//     return result;
//   }, [bookings, searchQuery, statusFilter, paymentFilter, sortBy]);

//   const getStatusColor = (status: BookingStatus) => {
//     switch (status) {
//       case "confirmed": return "bg-success/10 text-success border-success/20";
//       case "pending": return "bg-warning/10 text-warning border-warning/20";
//       case "completed": return "bg-primary/10 text-primary border-primary/20";
//       case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
//     }
//   };

//   const getPaymentStatusColor = (status: PaymentStatus) => {
//     switch (status) {
//       case "paid": return "bg-success/10 text-success border-success/20";
//       case "partial": return "bg-warning/10 text-warning border-warning/20";
//       case "unpaid": return "bg-destructive/10 text-destructive border-destructive/20";
//       case "refunded": return "bg-muted text-muted-foreground border-muted";
//     }
//   };

//   const calculateDays = (start: string, end: string) =>
//     Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));

//   const handleViewDetails = (booking: Booking) => {
//     setSelectedBooking(booking);
//     setShowDetailsModal(true);
//   };

//   const YachtMediaSlider = ({ media }: { media: MediaItem[] }) => {
//     const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
//     const scrollPrev = () => emblaApi?.scrollPrev();
//     const scrollNext = () => emblaApi?.scrollNext();
//     useEffect(() => emblaApi?.reInit(), [emblaApi, media]);

//     return (
//       <div className="relative group overflow-hidden rounded-lg">
//         <div className="embla" ref={emblaRef}>
//           <div className="flex">
//             {media.map((item, i) => (
//               <div key={i} className="flex-[0_0_100%] min-w-0">
//                 {item.type === "image" ? (
//                   <img src={item.src} alt="" className="object-cover w-full h-48 md:h-56" />
//                 ) : (
//                   <video src={item.src} className="object-cover w-full h-48 md:h-56" controls={false} muted autoPlay loop playsInline preload="metadata" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//         <Button variant="secondary" size="icon" onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
//         <Button variant="secondary" size="icon" onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     );
//   };

//   if (loading) return <div className="text-center py-20">Loading bookings...</div>;

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       <section className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
//             <h1 className="text-4xl font-bold flex items-center gap-2 mb-4"><Ship />Bookings</h1>
//             <BookingStats bookings={bookings} />
//           </motion.div>
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
//             {/* Search box */}
//             <input
//               type="text"
//               placeholder="Search bookings..."
//               className="border rounded-md px-3 py-2 w-full md:w-1/2"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />

//             {/* Status dropdown */}
//             <select
//               className="border rounded-md px-3 py-2 w-full md:w-1/4"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6 mt-8" : "space-y-4 mt-8"}>
//             {filteredAndSortedBookings.map((booking, i) => (
//               <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
//                 <Card className="overflow-hidden border-2 hover:shadow-lg transition-all">
//                   <YachtMediaSlider media={booking.media} />
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="font-bold text-lg">{booking.yachtName}</h3>
//                         <Badge variant="outline" className={getStatusColor(booking.status)}>{booking.status}</Badge>
//                         <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-semibold text-primary">${booking.price.toLocaleString()}</div>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Start Date : {booking.startDate}</div>
//                       <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />End Date: {booking.endDate}</div>
//                       <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{booking.location}</div>
//                       <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{booking.guests} guests</div>
//                     </div>
//                     <div className="flex gap-2 pt-4 mt-4 border-t">
//                       <Button
//                         size="sm"
//                         className="flex-1 bg-blue-600 hover:bg-green-700 text-white"
//                         disabled={booking.status === "confirmed"}
//                         onClick={() => {
//                           if (window.confirm(`Are you sure you want to CONFIRM booking for ${booking.yachtName}?`)) {
//                             updateBookingStatus(booking.id, "confirmed");
//                           }
//                         }}
//                       >
//                         Confirm
//                       </Button>

//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
//                         disabled={booking.status === "cancelled"}
//                         onClick={() => {
//                           if (window.confirm(`Are you sure you want to CANCEL booking for ${booking.yachtName}?`)) {
//                             updateBookingStatus(booking.id, "cancelled");
//                           }
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     </div>

//                   </div>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />

//       <BookingDetailsModal booking={selectedBooking} open={showDetailsModal} onClose={() => setShowDetailsModal(false)} />
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, MapPin, Users, Clock, Ship, ChevronLeft, ChevronRight,
  Search, Filter, Mail, Phone, User, CheckCircle, XCircle, Download
} from "lucide-react";
import BookingStats from "@/components/BookingStats";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { createClient } from "@/utils/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface Booking {
  id: string;
  yachtName: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  startDate: string;
  endDate: string;
  guests: number;
  location: string;
  price: number;
  paidAmount: number;
  bookingRef: string;
  customer: CustomerInfo;
  amenities: string[];
  media: MediaItem[];
  paymentId?: string;
  razorpayPaymentId?: string;
}

export default function BookingsManagement() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [yachts, setYachts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings from Supabase with customer details
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          start_date,
          end_date,
          guests,
          total_price,
          status,
          payment_status,
          booking_reference,
          contact_details,
          payment_id,
          razorpay_payment_id,
          user_id,
          yacht:yachts (
            id,
            name,
            location,
            amenities,
            images,
            videos
          )
        `)
        .order("start_date", { ascending: false });

      if (error) throw error;

      const formattedBookings: Booking[] = data?.map((b: any) => {
        // Get customer info from contact_details
        let customerInfo: CustomerInfo = {
          name: "Guest User",
          email: "guest@example.com",
          phone: "N/A"
        };

        // Parse contact_details if it exists
        if (b.contact_details) {
          const details = typeof b.contact_details === 'string' 
            ? JSON.parse(b.contact_details) 
            : b.contact_details;
          
          customerInfo = {
            name: details.name || details.fullName || "Guest User",
            email: details.email || "guest@example.com",
            phone: details.phone || details.phoneNumber || "N/A"
          };
        }

        return {
          id: b.id,
          yachtName: b.yacht?.name || "Unknown Yacht",
          status: (b.status || "pending") as BookingStatus,
          paymentStatus: (b.payment_status || "pending") as PaymentStatus,
          startDate: b.start_date,
          endDate: b.end_date,
          guests: b.guests,
          location: b.yacht?.location || "Location TBD",
          price: b.total_price,
          paidAmount: b.total_price,
          bookingRef: b.booking_reference || b.id.slice(0, 8).toUpperCase(),
          customer: customerInfo,
          amenities: b.yacht?.amenities || [],
          media: [
            ...(b.yacht?.images?.map((img: string) => ({ type: "image" as const, src: img })) || []),
            ...(b.yacht?.videos?.map((vid: string) => ({ type: "video" as const, src: vid })) || [])
          ],
          paymentId: b.payment_id,
          razorpayPaymentId: b.razorpay_payment_id
        };
      }) || [];

      setBookings(formattedBookings);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      console.error("Error details:", {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update Booking Status
  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  // Filtering with date range
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.yachtName.toLowerCase().includes(query) ||
          b.customer.name.toLowerCase().includes(query) ||
          b.customer.email.toLowerCase().includes(query) ||
          b.bookingRef.toLowerCase().includes(query) ||
          b.location.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Payment filter - ensure proper comparison
    if (paymentFilter !== "all") {
      result = result.filter((b) => {
        const status = (b.paymentStatus || "").toLowerCase();
        return status === paymentFilter.toLowerCase();
      });
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter((b) => new Date(b.startDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter((b) => new Date(b.endDate) <= new Date(dateTo));
    }

    return result;
  }, [bookings, searchQuery, statusFilter, paymentFilter, dateFrom, dateTo]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
      case "refunded": return "bg-muted text-muted-foreground border-muted";
    }
  };

  const calculateDays = (start: string, end: string) => {
    const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  // Generate PDF from filtered bookings
  const generatePDF = () => {
    // Use landscape orientation for better column visibility
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Bookings Report", pageWidth / 2, 15, { align: "center" });
    
    // Subtitle with filter info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    let filterText = "Filtered Results";
    if (statusFilter !== "all") filterText += ` | Status: ${statusFilter}`;
    if (paymentFilter !== "all") filterText += ` | Payment: ${paymentFilter}`;
    if (dateFrom || dateTo) filterText += ` | Date Range: ${dateFrom || 'Any'} to ${dateTo || 'Any'}`;
    doc.text(filterText, pageWidth / 2, 22, { align: "center" });
    
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: "center" });
    doc.text(`Total Bookings: ${filteredBookings.length}`, pageWidth / 2, 33, { align: "center" });
    
    // Table data
    const tableData = filteredBookings.map((booking) => [
      booking.bookingRef,
      booking.yachtName,
      booking.customer.name,
      booking.customer.email,
      booking.customer.phone,
      new Date(booking.startDate).toLocaleDateString(),
      new Date(booking.endDate).toLocaleDateString(),
      calculateDays(booking.startDate, booking.endDate).toString(),
      booking.guests.toString(),
      booking.location,
      `$${booking.price.toLocaleString()}`,
      booking.status,
      booking.paymentStatus,
      booking.paymentId || booking.razorpayPaymentId || "N/A"
    ]);
    
    // Generate table with landscape orientation for all columns to be visible
    autoTable(doc, {
      startY: 38,
      head: [['Ref', 'Yacht', 'Customer', 'Email', 'Phone', 'Check-in', 'Check-out', 'Days', 'Guests', 'Location', 'Price', 'Status', 'Payment', 'Payment ID']],
      body: tableData,
      styles: { 
        fontSize: 7,
        cellPadding: 1.5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'left' },    // Ref
        1: { cellWidth: 22, halign: 'left' },    // Yacht
        2: { cellWidth: 20, halign: 'left' },    // Customer
        3: { cellWidth: 30, halign: 'left' },    // Email
        4: { cellWidth: 18, halign: 'left' },    // Phone
        5: { cellWidth: 18, halign: 'center' },  // Check-in
        6: { cellWidth: 18, halign: 'center' },  // Check-out
        7: { cellWidth: 10, halign: 'center' },  // Days
        8: { cellWidth: 12, halign: 'center' },  // Guests
        9: { cellWidth: 20, halign: 'left' },    // Location
        10: { cellWidth: 18, halign: 'right' },  // Price
        11: { cellWidth: 16, halign: 'center' }, // Status
        12: { cellWidth: 16, halign: 'center' }, // Payment
        13: { cellWidth: 25, halign: 'left' }    // Payment ID - increased width
      },
      margin: { left: 7, right: 7 },
      tableWidth: 'auto',
    });
    
    // Save PDF
    const fileName = `bookings-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const YachtMediaSlider = ({ media }: { media: MediaItem[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    useEffect(() => {
      emblaApi?.reInit();
    }, [emblaApi, media]);

    if (!media || media.length === 0) {
      return (
        <div className="w-full h-56 bg-muted flex items-center justify-center rounded-t-lg">
          <Ship className="w-12 h-12 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className="relative group overflow-hidden rounded-t-lg">
        <div className="embla" ref={emblaRef}>
          <div className="flex">
            {media.map((item, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                {item.type === "image" ? (
                  <img 
                    src={item.src} 
                    alt="Yacht" 
                    className="object-cover w-full h-56 block"
                  />
                ) : (
                  <video 
                    src={item.src} 
                    className="object-cover w-full h-56 block" 
                    controls={false} 
                    muted 
                    autoPlay 
                    loop 
                    playsInline 
                    preload="metadata"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {media.length > 1 && (
          <>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={scrollPrev} 
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={scrollNext} 
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Ship className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-muted/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <Navigation />

        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Ship className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">Bookings Management</h1>
                  <p className="text-muted-foreground mt-1">Manage and track all yacht bookings</p>
                </div>
              </div>
              <BookingStats bookings={bookings} />
            </motion.div>

            {/* Filters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card/80 backdrop-blur-sm rounded-xl border shadow-sm p-6 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Filters & Search</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search bookings..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Date From */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="From Date"
                    className="pl-10"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                {/* Date To */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="To Date"
                    className="pl-10"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Payment Filter */}
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="all">All Payments</option>
                  <option value="completed">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Clear Filters and Download PDF */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {(searchQuery || dateFrom || dateTo || statusFilter !== "all" || paymentFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setDateFrom("");
                      setDateTo("");
                      setStatusFilter("all");
                      setPaymentFilter("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
                
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={generatePDF}
                  disabled={filteredBookings.length === 0}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </Button>
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredBookings.length}</span> of <span className="font-semibold text-foreground">{bookings.length}</span> bookings
            </div>

            {/* Bookings Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Card className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/30 p-0 bg-card/80 backdrop-blur-sm">
                    {/* Media - Full Width, No Top Space */}
                    <div className="w-full">
                      <YachtMediaSlider media={booking.media} />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Header with Yacht Name and Badges */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2 text-foreground">{booking.yachtName}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">${booking.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                      </div>

                      {/* Customer Info Section */}
                      <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-semibold text-foreground">{booking.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{booking.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{booking.customer.phone}</span>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>Check-in</span>
                          </div>
                          <span className="font-medium text-foreground">{new Date(booking.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>Check-out</span>
                          </div>
                          <span className="font-medium text-foreground">{new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>Duration</span>
                          </div>
                          <span className="font-medium text-foreground">{calculateDays(booking.startDate, booking.endDate)} days</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            <span>Guests</span>
                          </div>
                          <span className="font-medium text-foreground">{booking.guests}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>Location</span>
                          </div>
                          <span className="font-medium text-foreground truncate max-w-[150px]">{booking.location}</span>
                        </div>
                      </div>

                      {/* Booking Reference & Payment ID */}
                      <div className="space-y-1 text-xs text-muted-foreground mb-4">
                        <div>
                          Ref: <span className="font-mono font-semibold">{booking.bookingRef}</span>
                        </div>
                        {(booking.paymentId || booking.razorpayPaymentId) && (
                          <div>
                            Payment ID: <span className="font-mono font-semibold">
                              {booking.razorpayPaymentId || booking.paymentId}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          disabled={booking.status === "confirmed"}
                          onClick={() => {
                            if (window.confirm(`Confirm booking for ${booking.yachtName}?`)) {
                              updateBookingStatus(booking.id, "confirmed");
                            }
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          disabled={booking.status === "cancelled"}
                          onClick={() => {
                            if (window.confirm(`Cancel booking for ${booking.yachtName}?`)) {
                              updateBookingStatus(booking.id, "cancelled");
                            }
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Ship className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No bookings found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
              </motion.div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
