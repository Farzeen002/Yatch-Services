"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, User, Calendar, ThumbsUp, Reply } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface Feedback {
  id: string
  yacht_name: string
  user_name: string
  rating: number
  comment: string
  created_at: string
  booking_id?: string
}

interface FeedbackManagementProps {
  onFeedbackUpdate?: () => void
}

export default function FeedbackManagement({ onFeedbackUpdate }: FeedbackManagementProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          yachts(name),
          profiles(username),
          bookings(id)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching feedback:', error)
        return
      }

      const formattedFeedbacks = data?.map(feedback => ({
        id: feedback.id,
        yacht_name: feedback.yachts?.name || 'Unknown Yacht',
        user_name: feedback.profiles?.username || 'Anonymous',
        rating: feedback.rating,
        comment: feedback.comment,
        created_at: feedback.created_at,
        booking_id: feedback.bookings?.id
      })) || []

      setFeedbacks(formattedFeedbacks)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReply = async (feedbackId: string) => {
    if (!replyText.trim()) return

    try {
      setIsReplying(true)
      // Here you would typically send the reply via email or store it in a replies table
      // For now, we'll just show a success message
      alert('Reply sent successfully!')
      setReplyText("")
      setSelectedFeedback(null)
      onFeedbackUpdate?.()
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Error sending reply')
    } finally {
      setIsReplying(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0
    const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
    return (total / feedbacks.length).toFixed(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Customer Feedback
          </CardTitle>
          <CardDescription className="text-purple-100">
            Manage customer reviews and feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-purple-700 font-medium">Average Rating</span>
              </div>
              <p className="text-2xl font-bold text-purple-800">{getAverageRating()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <span className="text-purple-700 font-medium">Total Reviews</span>
              </div>
              <p className="text-2xl font-bold text-purple-800">{feedbacks.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                <span className="text-purple-700 font-medium">Positive Reviews</span>
              </div>
              <p className="text-2xl font-bold text-purple-800">
                {feedbacks.filter(f => f.rating >= 4).length}
              </p>
            </div>
          </div>

          {/* Feedback List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-purple-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <p className="text-purple-600 text-lg font-medium">No feedback yet</p>
              <p className="text-purple-500">Customer reviews will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-800">{feedback.user_name}</p>
                        <p className="text-sm text-purple-600">{feedback.yacht_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {feedback.rating}/5
                      </Badge>
                    </div>
                  </div>

                  <p className="text-purple-700 mb-3">{feedback.comment}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-purple-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(feedback.created_at)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFeedback(feedback)}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Modal */}
      {selectedFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Reply to {selectedFeedback.user_name}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-purple-600 mb-2">Original feedback:</p>
              <p className="bg-purple-50 p-3 rounded text-purple-700 text-sm">
                {selectedFeedback.comment}
              </p>
            </div>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
              className="border-purple-200 focus:border-purple-400 mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleReply(selectedFeedback.id)}
                disabled={isReplying || !replyText.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isReplying ? "Sending..." : "Send Reply"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFeedback(null)
                  setReplyText("")
                }}
                className="border-purple-300 text-purple-700"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
