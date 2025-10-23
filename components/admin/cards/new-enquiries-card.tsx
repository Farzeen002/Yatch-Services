"use client"

import { motion } from "framer-motion"
import { MessageSquare, AlertCircle } from "lucide-react"

interface NewEnquiriesCardProps {
  count: number
  isLoading?: boolean
}

export default function NewEnquiriesCard({ count, isLoading = false }: NewEnquiriesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-amber-600 text-sm font-medium mb-2">New Enquiries</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-amber-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-amber-800">{count}</p>
          )}
          <p className="text-amber-500 text-xs mt-1">Awaiting response</p>
        </div>
        <div className="bg-amber-100 p-3 rounded-full">
          <MessageSquare className="h-6 w-6 text-amber-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-amber-600">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Requires Attention</span>
      </div>
    </motion.div>
  )
}
