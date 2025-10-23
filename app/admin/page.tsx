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

  // Fetch logged-in user info from Supabase users table
 useEffect(() => {
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error("Failed to get user:", error.message)
      return
    }

    if (!data.user) return // user not logged in

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username, profile_image")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("Failed to fetch profile:", profileError.message)
      return
    }

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
      
      // Fetch yachts count
      const { count: totalYachts } = await supabase
        .from('yachts')
        .select('*', { count: 'exact', head: true })

      // Fetch bookings count
      const { count: bookedYachts } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

      // Fetch new enquiries count
      const { count: newEnquiries } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      // Fetch feedback count and average rating
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('rating')

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
    fetchDashboardData() // Refresh data
  }

  const handleDataUpdate = () => {
    fetchDashboardData() // Refresh data when bookings/feedback are updated
  }

  return (
    <main className="min-h-screen bg-gradient-to-br">
      <Navigation />

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Admin Dashboard</h1>
          <p className="text-blue-600">Manage your yacht booking platform</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg border border-blue-200">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="yachts" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Yachts
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Enquiries
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <DashboardCards
              totalYachts={dashboardData.totalYachts}
              bookedYachts={dashboardData.bookedYachts}
              newEnquiries={dashboardData.newEnquiries}
              userFeedback={dashboardData.userFeedback}
              averageRating={dashboardData.averageRating}
              isLoading={isLoading}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-blue-800">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setActiveTab("yachts")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Yacht
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("bookings")}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    View Bookings
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("enquiries")}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Check Enquiries
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Recent Activity</CardTitle>
                  <CardDescription>Latest platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-800">New booking received</p>
                        <p className="text-sm text-emerald-600">Luxury Catamaran - 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-800">Customer enquiry</p>
                        <p className="text-sm text-emerald-600">Interested in Motor Yacht - 1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-800">New review received</p>
                        <p className="text-sm text-emerald-600">5-star rating - 3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Yachts Tab */}
          <TabsContent value="yachts">
  {showYachtForm ? (
    <YachtForm onSuccess={handleYachtFormSuccess} onCancel={() => setShowYachtForm(false)} />
  ) : (
    <>
      <Button
        className="mb-4 bg-blue-600 text-white"
        onClick={() => setShowYachtForm(true)}
      >
        <Plus className="h-4 w-4 mr-2" /> Add New Yacht
      </Button>
      <YachtDetails
        onEdit={(yacht) => {
          // Set yacht data in YachtForm for editing
          setShowYachtForm(true)
          // pass yacht to YachtForm via state or props
        }}
      />
    </>
  )}
</TabsContent>


          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <BookingsManagement onStatusUpdate={handleDataUpdate} />
          </TabsContent>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries">
            <EnquiriesManagement onEnquiryUpdate={handleDataUpdate} />
          </TabsContent>

          {/* Feedback Tab */}
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
