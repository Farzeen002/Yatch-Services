"use client"; 
// (required in Next.js App Router for hooks, useState, useMemo, etc.)

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Calendar, MapPin, Users, Clock, AlertCircle, Search, Filter, Download,
  Grid3x3, List, Ship, Edit, Eye, MessageSquare
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import BookingStats from "@/components/BookingDetailsModal";
import Navigation from "@/components/navigation";

export default function BookingsManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [bookings] = useState<Booking[]>([
    {
      id: 1,
      yachtName: "Luxury Horizon",
      status: "confirmed",
      paymentStatus: "paid",
      startDate: "2025-11-15",
      endDate: "2025-11-18",
      guests: 8,
      location: "Miami, FL",
      price: 15000,
      paidAmount: 15000,
      image: "🛥️",
      bookingRef: "YB-2025-001",
      customerName: "John Anderson",
      customerEmail: "john.anderson@email.com",
      customerPhone: "+1 (305) 555-0123",
      notes: "Anniversary celebration, champagne on arrival",
      amenities: ["Jet Ski", "Fishing Gear", "Premium Bar", "Chef Service"],
      crew: 5,
    },
    {
      id: 2,
      yachtName: "Ocean Pearl",
      status: "pending",
      paymentStatus: "partial",
      startDate: "2025-12-01",
      endDate: "2025-12-05",
      guests: 6,
      location: "Key West, FL",
      price: 14000,
      paidAmount: 7000,
      image: "⛵",
      bookingRef: "YB-2025-002",
      customerName: "Sarah Mitchell",
      customerEmail: "sarah.m@email.com",
      customerPhone: "+1 (305) 555-0456",
      notes: "Corporate retreat, needs conference setup",
      amenities: ["WiFi", "Conference Setup", "Catering", "Water Sports"],
      crew: 4,
    },
    {
      id: 3,
      yachtName: "Sunset Dreams",
      status: "completed",
      paymentStatus: "paid",
      startDate: "2025-10-10",
      endDate: "2025-10-12",
      guests: 4,
      location: "Key Largo, FL",
      price: 5600,
      paidAmount: 5600,
      image: "🚤",
      bookingRef: "YB-2025-003",
      customerName: "Michael Chen",
      customerEmail: "m.chen@email.com",
      customerPhone: "+1 (305) 555-0789",
      notes: "Family vacation, child-friendly setup requested",
      amenities: ["Snorkeling Gear", "Kayaks", "Safety Equipment"],
      crew: 3,
    },
    {
      id: 4,
      yachtName: "Marine Majesty",
      status: "cancelled",
      paymentStatus: "refunded",
      startDate: "2025-11-20",
      endDate: "2025-11-23",
      guests: 10,
      location: "Fort Lauderdale, FL",
      price: 18000,
      paidAmount: 0,
      image: "🛥️",
      bookingRef: "YB-2025-004",
      customerName: "David Williams",
      customerEmail: "david.w@email.com",
      customerPhone: "+1 (954) 555-0321",
      notes: "Cancelled due to weather concerns",
      amenities: ["Full Bar", "DJ Setup", "Party Lights"],
      crew: 6,
    },
  ]);

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (b) =>
          b.yachtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      result = result.filter((b) => b.paymentStatus === paymentFilter);
    }

    // Sorting
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
        case "name":
          return a.yachtName.localeCompare(b.yachtName);
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, searchQuery, statusFilter, paymentFilter, sortBy]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "partial":
        return "bg-warning/10 text-warning border-warning/20";
      case "unpaid":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "refunded":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleExport = (format: "csv" | "pdf") => {
    // Export functionality placeholder
    console.log(`Exporting bookings as ${format}`);
  };

  const calculateDays = (start: string, end: string) => {
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Ship className="h-10 w-10 text-primary" />
                  Bookings
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage and track all yacht reservations
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleExport("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <BookingStats bookings={bookings} />
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by yacht, customer, or booking reference..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="price-desc">Price (High)</SelectItem>
                      <SelectItem value="price-asc">Price (Low)</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="flex gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || statusFilter !== "all" || paymentFilter !== "all") && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Active filters:</span>
                  {searchQuery && (
                    <Badge variant="secondary">
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-2 hover:text-foreground"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary">
                      Status: {statusFilter}
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="ml-2 hover:text-foreground"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {paymentFilter !== "all" && (
                    <Badge variant="secondary">
                      Payment: {paymentFilter}
                      <button
                        onClick={() => setPaymentFilter("all")}
                        className="ml-2 hover:text-foreground"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedBookings.length} of {bookings.length} bookings
          </div>

          {/* Bookings Display */}
          {filteredAndSortedBookings.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPaymentFilter("all");
              }}>
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
              {filteredAndSortedBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                    <div className={viewMode === "grid" ? "flex flex-col" : "flex flex-row"}>
                      {/* Yacht Image */}
                      <div className={`bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center ${
                        viewMode === "grid" ? "h-48 w-full" : "w-32 h-full"
                      }`}>
                        <span className="text-6xl">{booking.image}</span>
                      </div>

                      {/* Booking Details */}
                      <div className="p-6 flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-foreground">
                                {booking.yachtName}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {booking.bookingRef}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{booking.customerName}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className={getStatusColor(booking.status)}>
                                {getStatusLabel(booking.status)}
                              </Badge>
                              <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                                {getStatusLabel(booking.paymentStatus)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ${booking.price.toLocaleString()}
                            </div>
                            {booking.paymentStatus === "partial" && (
                              <div className="text-xs text-muted-foreground mt-1">
                                ${booking.paidAmount.toLocaleString()} paid
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="truncate">
                              {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{calculateDays(booking.startDate, booking.endDate)} days</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="truncate">{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{booking.guests} guests</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-border">
                          <Button 
                            onClick={() => handleViewDetails(booking)}
                            className="flex-1"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }}
      />
    </div>
  );
}
