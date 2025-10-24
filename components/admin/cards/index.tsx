"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"; // 👈 add this
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
  onCardClick?: (tab: string) => void
}

export default function DashboardCards({
  totalYachts,
  bookedYachts,
  newEnquiries,
  userFeedback,
  averageRating = 0,
  isLoading = false,
  onCardClick,
}: DashboardCardsProps) {
  const router = useRouter(); // 👈 add this

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <div
        onClick={() => onCardClick?.("yachts")}
        className="cursor-pointer hover:scale-105 hover:shadow-md transition-transform duration-200"
      >
        <TotalYachtsCard count={totalYachts} isLoading={isLoading} />
      </div>

      {/* Only this card navigates to /bookings */}
      <div
        onClick={() => router.push("/bookings")} // 👈 updated
        className="cursor-pointer hover:scale-105 hover:shadow-md transition-transform duration-200"
      >
        <BookedYachtsCard count={bookedYachts} isLoading={isLoading} />
      </div>

      <div
        onClick={() => onCardClick?.("enquiries")}
        className="cursor-pointer hover:scale-105 hover:shadow-md transition-transform duration-200"
      >
        <NewEnquiriesCard count={newEnquiries} isLoading={isLoading} />
      </div>
      <div
        onClick={() => onCardClick?.("feedback")}
        className="cursor-pointer hover:scale-105 hover:shadow-md transition-transform duration-200"
      >
        <UserFeedbackCard 
          count={userFeedback} 
          averageRating={averageRating}
          isLoading={isLoading} 
        />
      </div>
    </motion.div>
  )
}
