"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, AlertCircle } from "lucide-react"

export default function BookingsManagement() {
  const [bookings] = useState([
    {
      id: 1,
      yachtName: "Luxury Horizon",
      status: "confirmed",
      startDate: "2025-11-15",
      endDate: "2025-11-18",
      guests: 8,
      location: "Miami, FL",
      price: "$15,000",
      image: "🛥️",
    },
    {
      id: 2,
      yachtName: "Ocean Pearl",
      status: "pending",
      startDate: "2025-12-01",
      endDate: "2025-12-05",
      guests: 6,
      location: "Key West, FL",
      price: "$14,000",
      image: "⛵",
    },
    {
      id: 3,
      yachtName: "Sunset Dreams",
      status: "completed",
      startDate: "2025-10-10",
      endDate: "2025-10-12",
      guests: 4,
      location: "Key Largo, FL",
      price: "$5,600",
      image: "🚤",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">My Bookings</h1>
          <p className="text-lg text-muted-foreground text-balance">Manage and track all your yacht reservations</p>
        </motion.div>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Start your yacht adventure by booking your first yacht</p>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Browse Yachts
            </button>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Yacht Image */}
                    <div className="bg-gradient-to-br from-primary to-blue-900 p-8 flex items-center justify-center w-full md:w-48 h-48">
                      <span className="text-6xl">{booking.image}</span>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground">{booking.yachtName}</h3>
                            <Badge className={`mt-2 ${getStatusColor(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </Badge>
                          </div>
                          <span className="text-2xl font-bold text-primary">{booking.price}</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              {new Date(booking.startDate).toLocaleDateString()} -{" "}
                              {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>
                              {Math.ceil(
                                (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              days
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>{booking.guests} guests</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium">
                          Modify Booking
                        </button>
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
  )
}
