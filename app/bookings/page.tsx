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
import {
  Calendar,
  MapPin,
  Users,
  Ship,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import BookingStats from "@/components/BookingStats";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { createClient } from "@/utils/supabase/client";

type ViewMode = "grid" | "list";
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type PaymentStatus = "paid" | "partial" | "unpaid" | "refunded";

interface MediaItem {
  type: "image" | "video";
  src: string;
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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  amenities: string[];
  crew: number;
  media: MediaItem[];
}

export default function BookingsManagement() {
  const supabase = createClient();
  const [viewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [yachts, setYachts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //  Fetch yachts (with images)
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

  //  Fetch user bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/user");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const formattedBookings = json.bookings.map((b: any) => {
        // Match yacht from yachts list
        const matchingYacht = yachts.find(
          (y) =>
            y.name?.trim().toLowerCase() ===
            b.yachtName?.trim().toLowerCase()
        );

        const images = matchingYacht?.images?.length
          ? matchingYacht.images.map((img: string) => ({
              type: "image",
              src: img,
            }))
          : [{ type: "image", src: b.yachtImage }];

        return {
          id: b.id,
          yachtName: b.yachtName,
          status: b.status,
          paymentStatus: b.paymentStatus,
          startDate: b.startDate,
          endDate: b.endDate,
          guests: b.guests,
          location: b.location,
          price: b.totalPrice,
          paidAmount: b.totalPrice,
          bookingRef: b.id.slice(0, 8).toUpperCase(),
          customerName: "Customer",
          customerEmail: "customer@email.com",
          customerPhone: "+0000000000",
          notes: "",
          amenities: matchingYacht?.amenities ?? [],
          crew: matchingYacht?.crew ?? 4,
          media: images,
        };
      });

      setBookings(formattedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch both yachts and bookings (in correct order)
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchYachts();
      await fetchBookings();
      setLoading(false);
    };
    init();
  }, []);

  //  Update booking status in Supabase
  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  //  Filters and sorting
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];
    if (searchQuery) {
      result = result.filter(
        (b) =>
          b.yachtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
    if (paymentFilter !== "all") result = result.filter((b) => b.paymentStatus === paymentFilter);

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "date-asc":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "price-desc":
          return b.price - a.price;
        case "price-asc":
          return a.price - b.price;
        default:
          return 0;
      }
    });
    return result;
  }, [bookings, searchQuery, statusFilter, paymentFilter, sortBy]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
    }
  };

  const YachtMediaSlider = ({ media }: { media: MediaItem[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();
    useEffect(() => emblaApi?.reInit(), [emblaApi, media]);

    return (
      <div className="relative group overflow-hidden rounded-lg">
        <div className="embla" ref={emblaRef}>
          <div className="flex">
            {media.map((item, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt=""
                    className="object-cover w-full h-48 md:h-56"
                  />
                ) : (
                  <video
                    src={item.src}
                    className="object-cover w-full h-48 md:h-56"
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
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (loading) return <div className="text-center py-20">Loading bookings...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-bold flex items-center gap-2 mb-4">
              <Ship /> My Bookings
            </h1>
            <BookingStats bookings={bookings} />
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
            <input
              type="text"
              placeholder="Search bookings..."
              className="border rounded-md px-3 py-2 w-full md:w-1/2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border rounded-md px-3 py-2 w-full md:w-1/4"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6 mt-8" : "space-y-4 mt-8"}>
            {filteredAndSortedBookings.map((booking, i) => (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden border-2 hover:shadow-lg transition-all">
                  <YachtMediaSlider media={booking.media} />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{booking.yachtName}</h3>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="text-right text-2xl font-semibold text-primary">
                        ${booking.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Start: {booking.startDate}</div>
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />End: {booking.endDate}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{booking.location}</div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{booking.guests} guests</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BookingDetailsModal booking={selectedBooking} open={showDetailsModal} onClose={() => setShowDetailsModal(false)} />
    </div>
  );
}
