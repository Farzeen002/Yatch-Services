"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, Calendar, MessageSquare, CheckCircle, Clock, User } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface Enquiry {
  id: string
  name: string
  email: string
  phone?: string
  yacht_name?: string
  message: string
  status: 'new' | 'contacted' | 'resolved'
  created_at: string
}

interface EnquiriesManagementProps {
  onEnquiryUpdate?: () => void
}

export default function EnquiriesManagement({ onEnquiryUpdate }: EnquiriesManagementProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchEnquiries()
  }, [statusFilter])

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('enquiries')
        .select(`
          *,
          yachts(name)
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching enquiries:', error)
        return
      }

      const formattedEnquiries = data?.map(enquiry => ({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        yacht_name: enquiry.yachts?.name,
        message: enquiry.message,
        status: enquiry.status,
        created_at: enquiry.created_at
      })) || []

      setEnquiries(formattedEnquiries)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateEnquiryStatus = async (enquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', enquiryId)

      if (error) {
        console.error('Error updating enquiry:', error)
        alert('Error updating enquiry status')
        return
      }

      setEnquiries(prev => 
        prev.map(enquiry => 
          enquiry.id === enquiryId 
            ? { ...enquiry, status: newStatus as any }
            : enquiry
        )
      )
      onEnquiryUpdate?.()
    } catch (error) {
      console.error('Error:', error)
      alert('Error updating enquiry status')
    }
  }

  const handleReply = async (enquiryId: string) => {
    if (!replyText.trim()) return

    try {
      setIsReplying(true)
      // Here you would typically send the reply via email
      // For now, we'll just show a success message and update status
      alert('Reply sent successfully!')
      await updateEnquiryStatus(enquiryId, 'contacted')
      setReplyText("")
      setSelectedEnquiry(null)
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Error sending reply')
    } finally {
      setIsReplying(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      contacted: { color: 'bg-blue-100 text-blue-800', icon: MessageSquare },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Customer Enquiries
          </CardTitle>
          <CardDescription className="text-amber-100">
            Manage customer inquiries and messages
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-amber-700 font-medium">Filter by status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-amber-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Enquiries</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={fetchEnquiries}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Refresh
            </Button>
          </div>

          {/* Enquiries List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-amber-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <p className="text-amber-600 text-lg font-medium">No enquiries found</p>
              <p className="text-amber-500">Customer enquiries will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enquiry, index) => (
                <motion.div
                  key={enquiry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 border border-amber-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-800">{enquiry.name}</p>
                        <div className="flex items-center gap-4 text-sm text-amber-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{enquiry.email}</span>
                          </div>
                          {enquiry.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{enquiry.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(enquiry.status)}
                    </div>
                  </div>

                  {enquiry.yacht_name && (
                    <div className="mb-3">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Interested in: {enquiry.yacht_name}
                      </Badge>
                    </div>
                  )}

                  <p className="text-amber-700 mb-3">{enquiry.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-amber-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(enquiry.created_at)}</span>
                    </div>
                    <div className="flex gap-2">
                      {enquiry.status === 'new' && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      )}
                      <Select
                        value={enquiry.status}
                        onValueChange={(value) => updateEnquiryStatus(enquiry.id, value)}
                      >
                        <SelectTrigger className="w-32 border-amber-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Modal */}
      {selectedEnquiry && (
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
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Reply to {selectedEnquiry.name}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-amber-600 mb-2">Original enquiry:</p>
              <p className="bg-amber-50 p-3 rounded text-amber-700 text-sm">
                {selectedEnquiry.message}
              </p>
            </div>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
              className="border-amber-200 focus:border-amber-400 mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleReply(selectedEnquiry.id)}
                disabled={isReplying || !replyText.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isReplying ? "Sending..." : "Send Reply"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedEnquiry(null)
                  setReplyText("")
                }}
                className="border-amber-300 text-amber-700"
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
