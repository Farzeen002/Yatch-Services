"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Chatbot from "@/components/chatbot"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardCards from "@/components/admin/cards"
import YachtForm from "@/components/admin/yacht-form"
import BookingsManagement from "@/components/admin/bookings-management"
import FeedbackManagement from "@/components/admin/feedback-management"
import EnquiriesManagement from "@/components/admin/enquiries-management"
import { Plus, BarChart3, Calendar, MessageSquare, Settings } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import YachtDetails from "@/components/admin/yachtdetails"

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ name: string; image: string } | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showYachtForm, setShowYachtForm] = useState(false)

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalYachts: 0,
    bookedYachts: 0,
    newEnquiries: 0,
    userFeedback: 0,
    averageRating: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) return console.error("Failed to get user:", error.message)
      if (!data.user) return

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("username, profile_image")
        .eq("id", data.user.id)
        .single()

      if (profileError) return console.error("Failed to fetch profile:", profileError.message)
      if (profile) {
        setUser({
          name: profile.username || "User",
          image: profile.profile_image || "/profile-placeholder.png",
        })
      }
    }
    fetchUser()
  }, [supabase])

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      const { count: totalYachts } = await supabase.from('yachts').select('*', { count: 'exact', head: true })
      const { count: bookedYachts } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
      const { count: newEnquiries } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new')
      const { data: feedbackData } = await supabase.from('feedback').select('rating')

      const userFeedback = feedbackData?.length || 0
      const averageRating = feedbackData?.length
        ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length
        : 0

      setDashboardData({
        totalYachts: totalYachts || 0,
        bookedYachts: bookedYachts || 0,
        newEnquiries: newEnquiries || 0,
        userFeedback,
        averageRating
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleYachtFormSuccess = () => {
    setShowYachtForm(false)
    fetchDashboardData()
  }

  const handleDataUpdate = () => {
    fetchDashboardData()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="mb-8 flex flex-col items-center text-center">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-600 text-sm sm:text-base">Manage your yacht booking platform efficiently</p>
    </div> */}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* <div className="overflow-x-auto">
        <TabsList className="inline-flex w-max min-w-full sm:grid sm:grid-cols-5 bg-white border border-gray-200 rounded-md">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-gray-700 whitespace-nowrap px-4 py-2">
            <BarChart3 className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="yachts" className="flex items-center gap-2 text-gray-700 whitespace-nowrap px-4 py-2">
            <Settings className="h-4 w-4" /> Yachts
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2 text-gray-700 whitespace-nowrap px-4 py-2">
            <Calendar className="h-4 w-4" /> Bookings
          </TabsTrigger>
          <TabsTrigger value="enquiries" className="flex items-center gap-2 text-gray-700 whitespace-nowrap px-4 py-2">
            <MessageSquare className="h-4 w-4" /> Enquiries
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2 text-gray-700 whitespace-nowrap px-4 py-2">
            <MessageSquare className="h-4 w-4" /> Feedback
          </TabsTrigger>
        </TabsList>
      </div> */}

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <DashboardCards
              totalYachts={dashboardData.totalYachts}
              bookedYachts={dashboardData.bookedYachts}
              newEnquiries={dashboardData.newEnquiries}
              userFeedback={dashboardData.userFeedback}
              averageRating={dashboardData.averageRating}
              isLoading={isLoading}
              onCardClick={(tab) => setActiveTab(tab)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("yachts")}
                    className="w-full bg-gray-800 text-white hover:bg-gray-900"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add New Yacht
                  </Button>
                  <Button
                    onClick={() => router.push("/bookings")}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    View Bookings
                  </Button>
                  <Button
                    onClick={() => setActiveTab("enquiries")}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Check Enquiries
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                  <CardDescription>Latest platform activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white rounded border border-gray-200">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">New booking received</p>
                      <p className="text-sm text-gray-500">Luxury Catamaran - 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white rounded border border-gray-200">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Customer enquiry</p>
                      <p className="text-sm text-gray-500">Interested in Motor Yacht - 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white rounded border border-gray-200">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">New review received</p>
                      <p className="text-sm text-gray-500">5-star rating - 3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="yachts">
            {showYachtForm ? (
              <YachtForm onSuccess={handleYachtFormSuccess} onCancel={() => setShowYachtForm(false)} />
            ) : (
              <>
                <div className="flex justify-end gap-4 mb-4">

                  <Button
                    className="bg-gray-800 text-white"
                    onClick={() => setShowYachtForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add New Yacht
                  </Button>
                  <Button
                    type="button"
                    className="border border-gray-300 text-white"
                    onClick={() => setActiveTab("overview")}
                  >
                    Back
                  </Button>

                </div>

                <YachtDetails onEdit={(yacht) => setShowYachtForm(true)} />
              </>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsManagement onStatusUpdate={handleDataUpdate} />
          </TabsContent>

          <TabsContent value="enquiries">
            <EnquiriesManagement onEnquiryUpdate={handleDataUpdate} />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackManagement onFeedbackUpdate={handleDataUpdate} />
          </TabsContent>
        </Tabs>
      </div>

      <Chatbot />
      <Footer />
    </main>

  )
}
