"use client"

import { motion } from "framer-motion"
import { Anchor, Waves } from "lucide-react"

interface TotalYachtsCardProps {
  count: number
  isLoading?: boolean
}

export default function TotalYachtsCard({ count, isLoading = false }: TotalYachtsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-blue-20 to-cyan-20 rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-600 text-sm font-medium mb-2">Total Yachts</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-blue-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-blue-800">{count}</p>
          )}
          <p className="text-blue-500 text-xs mt-1">Available in fleet</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Anchor className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-blue-600">
        <Waves className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Fleet Management</span>
      </div>
    </motion.div>
  )
}
