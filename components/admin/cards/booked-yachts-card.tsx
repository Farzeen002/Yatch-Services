"use client"

import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"

interface BookedYachtsCardProps {
  count: number
  isLoading?: boolean
}

export default function BookedYachtsCard({ count, isLoading = false }: BookedYachtsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-600 text-sm font-medium mb-2">Booked Yachts</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-emerald-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-emerald-800">{count}</p>
          )}
          <p className="text-emerald-500 text-xs mt-1">Currently reserved</p>
        </div>
        <div className="bg-emerald-100 p-3 rounded-full">
          <Calendar className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-emerald-600">
        <Clock className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Active Bookings</span>
      </div>
    </motion.div>
  )
}
