"use client"

import { motion } from "framer-motion"
import TotalYachtsCard from "./total-yachts-card"
import BookedYachtsCard from "./booked-yachts-card"
import NewEnquiriesCard from "./new-enquiries-card"
import UserFeedbackCard from "./user-feedback-card"

interface DashboardCardsProps {
  totalYachts: number
  bookedYachts: number
  newEnquiries: number
  userFeedback: number
  averageRating?: number
  isLoading?: boolean
}

export default function DashboardCards({
  totalYachts,
  bookedYachts,
  newEnquiries,
  userFeedback,
  averageRating = 0,
  isLoading = false
}: DashboardCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <TotalYachtsCard count={totalYachts} isLoading={isLoading} />
      <BookedYachtsCard count={bookedYachts} isLoading={isLoading} />
      <NewEnquiriesCard count={newEnquiries} isLoading={isLoading} />
      <UserFeedbackCard 
        count={userFeedback} 
        averageRating={averageRating}
        isLoading={isLoading} 
      />
    </motion.div>
  )
}
