"use client"

import { motion } from "framer-motion"
import { Star, ThumbsUp } from "lucide-react"

interface UserFeedbackCardProps {
  count: number
  averageRating?: number
  isLoading?: boolean
}

export default function UserFeedbackCard({ count, averageRating = 0, isLoading = false }: UserFeedbackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-600 text-sm font-medium mb-2">User Feedback</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-purple-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-purple-800">{count}</p>
          )}
          <p className="text-purple-500 text-xs mt-1">Total reviews</p>
        </div>
        <div className="bg-purple-100 p-3 rounded-full">
          <Star className="h-6 w-6 text-purple-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-purple-600">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Customer Reviews</span>
        </div>
        {averageRating > 0 && (
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-purple-600 ml-1">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
