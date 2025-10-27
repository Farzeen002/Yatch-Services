// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Calendar, Users, Zap, Shield, CreditCard } from "lucide-react"
// import BookingCalendar from "./booking-calendar"
// import BookingConfirmationModal from "./booking-confirmation-modal"
// import UserProfileModal from "./user-profile-modal"
// import { toast } from "@/components/ui/use-toast"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// declare global {
//   interface Window {
//     Razorpay: any
//   }
// }

// interface InstantBookingCardProps {
//   yacht: {
//     id: string
//     name: string
//     type: string
//     price: number
//     guests: number
//     amenities: string[]
//     unavailableDates: Date[]
//   }
//   className?: string
// }

// interface BookingDetails {
//   yachtName: string
//   totalPrice: number
//   startDate: Date
//   endDate: Date | null
//   guests: number
//   bookingId: string
//   bookingReference: string
//   paymentId: string
// }

// export default function InstantBookingCard({ yacht, className = "" }: InstantBookingCardProps) {
//   const router = useRouter()
//   const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date | null; isMultiDay: boolean } | null>(null)
//   const [guests, setGuests] = useState(1)
//   const [showConfirmation, setShowConfirmation] = useState(false)
//   const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [showProfileModal, setShowProfileModal] = useState(false)
//   const [userProfile, setUserProfile] = useState<any>(null)
//   const [profileComplete, setProfileComplete] = useState(false)

//   useEffect(() => {
//     checkUserProfile()
//   }, [])

//   const getAuthToken = async () => {
//     const supabase = createClientComponentClient()
//     const { data } = await supabase.auth.getSession()
//     return data.session?.access_token || ""
//   }

//   const checkUserProfile = async () => {
//     try {
//       const response = await fetch("/api/user/profile")
//       if (!response.ok) throw new Error("Failed to fetch profile")

//       const data = await response.json()
//       setUserProfile(data.profile)

//       const isComplete =
//         data.profile &&
//         ["full_name", "phone", "email", "address", "city", "state", "zip_code", "country"].every(
//           (field) => data.profile[field]
//         )

//       setProfileComplete(isComplete)
//     } catch (error) {
//       console.error("Error checking user profile:", error)
//       setProfileComplete(false)
//       toast({
//         title: "Profile Error",
//         description: "Failed to load user profile. Please try again.",
//         variant: "destructive"
//       })
//     }
//   }

//   const validateDateRange = (start: Date, end: Date | null): boolean => {
//     if (!end) return true
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     return start >= today && end > start
//   }

//   const calculateTotalPrice = () => {
//     if (!selectedDates) return yacht.price * guests
//     if (selectedDates.isMultiDay && selectedDates.end) {
//       const nights = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
//       const basePrice = yacht.price * guests * nights
//       return nights >= 3 ? basePrice * 0.9 : basePrice
//     }
//     return yacht.price * guests
//   }

//   const getBookingDuration = () => {
//     if (!selectedDates) return 1
//     if (!selectedDates.isMultiDay || !selectedDates.end) return 1
//     return Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
//   }


//   const loadRazorpayScript = (): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       if (window.Razorpay) {
//         resolve()
//         return
//       }
//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.onload = () => resolve()
//       script.onerror = () => reject(new Error("Failed to load Razorpay SDK"))
//       document.body.appendChild(script)
//     })
//   }

//   const processRazorpayPayment = async (
//     amount: number,
//     bookingId: string,
//     yachtName: string
//   ): Promise<{ success: boolean; paymentId: string }> => {
//     try {
//       const token = await getAuthToken();

//       // 1️⃣ Create order on your backend
//       const orderResponse = await fetch("/api/payments/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ amount, bookingId, yachtName }),
//       });

//       if (!orderResponse.ok) {
//         const err = await orderResponse.json();
//         throw new Error(err.error || "Failed to create payment order");
//       }

//       const orderData = await orderResponse.json();

//       // 2️⃣ Load Razorpay SDK
//       await loadRazorpayScript();

//       // 3️⃣ Use your public key (MUST start with NEXT_PUBLIC_)
//       const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
//       if (!key) throw new Error("Razorpay key missing. Check .env.local");

//       // 4️⃣ Initialize Razorpay
//       return new Promise((resolve, reject) => {
//         const razorpay = new window.Razorpay({
//           key,
//           amount: orderData.amount,
//           currency: orderData.currency,
//           order_id: orderData.id, // ✅ Ensure it matches the backend response
//           name: "Yacht Services",
//           description: `Booking for ${yachtName}`,
//           handler: async (response: any) => {
//             try {
//               const verifyResponse = await fetch("/api/payments/verify", {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_signature: response.razorpay_signature,
//                   bookingId,
//                 }),
//               });

//               const verifyData = await verifyResponse.json();
//               if (verifyResponse.ok) {
//                 resolve({ success: true, paymentId: response.razorpay_payment_id });
//               } else {
//                 reject(new Error(verifyData.error || "Payment verification failed"));
//               }
//             } catch (error) {
//               reject(error);
//             }
//           },
//           prefill: {
//             name: userProfile?.full_name || "",
//             email: userProfile?.email || "",
//             contact: userProfile?.phone || "",
//           },
//           theme: { color: "#2563eb" },
//           modal: {
//             ondismiss: () => reject(new Error("Payment cancelled")),
//           },
//         });

//         razorpay.open();
//       });
//     } catch (error) {
//       console.error("Payment error:", error);
//       throw error;
//     }
//   };


//   const handleInstantBook = async () => {
//     if (!selectedDates) {
//       toast({ title: "Date Required", description: "Please select your booking dates", variant: "destructive" })
//       return
//     }

//     if (!validateDateRange(selectedDates.start, selectedDates.end)) {
//       toast({ title: "Invalid Dates", description: "Please select valid booking dates", variant: "destructive" })
//       return
//     }

//     if (!profileComplete) {
//       setShowProfileModal(true)
//       return
//     }

//     setIsProcessing(true)

//     try {
//       const bookingData = {
//         yacht_id: yacht.id,
//         user_id: userProfile.id,
//         start_date: selectedDates.start.toISOString().split("T")[0],
//         end_date: selectedDates.end
//           ? selectedDates.end.toISOString().split("T")[0]
//           : selectedDates.start.toISOString().split("T")[0],
//         guests,
//         total_price: calculateTotalPrice(),
//         status: "pending",
//         booking_reference: Math.random().toString(36).substr(2, 9).toUpperCase(),
//         contact_details: {
//           name: userProfile.full_name,
//           email: userProfile.email,
//           phone: userProfile.phone
//         }
//       }

//       const token = await getAuthToken()

//       const bookingResponse = await fetch("/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(bookingData)
//       })

//       if (!bookingResponse.ok) {
//         const errorData = await bookingResponse.json()
//         throw new Error(errorData.error || "Failed to create booking")
//       }

//       const { booking } = await bookingResponse.json()

//       try {
//         const paymentResult = await processRazorpayPayment(calculateTotalPrice(), booking.id, yacht.name)
//         setBookingDetails({
//           yachtName: yacht.name,
//           totalPrice: calculateTotalPrice(),
//           startDate: selectedDates.start,
//           endDate: selectedDates.end,
//           guests,
//           bookingId: booking.id,
//           bookingReference: bookingData.booking_reference,
//           paymentId: paymentResult.paymentId
//         })
//         setShowConfirmation(true)
//         setTimeout(() => router.push("/bookings"), 3000)
//       } catch (error) {
//         await fetch(`/api/bookings/${booking.id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` }
//         })
//         throw error
//       }
//     } catch (error) {
//       console.error("Booking error:", error)
//       toast({
//         title: "Booking Failed",
//         description: error instanceof Error ? error.message : "Please try again",
//         variant: "destructive"
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleProfileComplete = async (profile: any) => {
//     setUserProfile(profile)
//     setProfileComplete(true)
//     setShowProfileModal(false)
//     await handleInstantBook()
//   }

//   const getDateRangeText = () => {
//     if (!selectedDates?.start) return "Select dates"
//     if (selectedDates.isMultiDay && selectedDates.end) {
//       const nights = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
//       return `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()} (${nights} nights)`
//     }
//     return selectedDates.start.toLocaleDateString()
//   }

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className={`sticky top-6 ${className}`}
//       >
//         <Card className="p-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Zap className="h-5 w-5 text-yellow-500" />
//               <h3 className="text-lg font-bold text-gray-900">Instant Book</h3>
//             </div>
//             <Badge
//               variant="secondary"
//               className="bg-green-100 text-green-800 hover:bg-green-200"
//             >
//               Available Now
//             </Badge>
//           </div>

//           {/* Pricing Section */}
//           <div className="mb-6 space-y-2">
//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-bold text-primary">
//                 ${yacht.price.toLocaleString()}
//               </span>
//               <span className="text-gray-600">/person/day</span>
//             </div>
//             {selectedDates && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="mt-2 p-3 bg-blue-50/50 rounded-lg"
//               >
//                 <div className="text-sm text-gray-600">
//                   Total for {getBookingDuration()} {getBookingDuration() === 1 ? 'day' : 'days'}:
//                 </div>
//                 <div className="text-xl font-bold text-primary">
//                   ${calculateTotalPrice().toLocaleString()}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {guests} guest{guests > 1 ? 's' : ''} × ${yacht.price}/person/day
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* Date Selection */}
//           <div className="mb-6">
//             <Label className="text-sm font-semibold text-gray-700 mb-3 block">
//               Choose Your Dates
//             </Label>
//             <BookingCalendar
//               onDateSelect={setSelectedDates}
//               unavailableDates={yacht.unavailableDates}
//               yachtId={yacht.id}
//             />
//           </div>

//           {/* Guest Selection */}
//           <div className="mb-6">
//             <Label className="text-sm font-semibold text-gray-700 mb-3 block">
//               Number of Guests
//             </Label>
//             <div className="flex items-center gap-2">
//               <Users className="h-4 w-4 text-gray-500" />
//               <Input
//                 type="number"
//                 min="1"
//                 max={yacht.guests}
//                 value={guests}
//                 onChange={(e) => setGuests(Math.min(parseInt(e.target.value) || 1, yacht.guests))}
//                 className="flex-1"
//                 placeholder="Enter number of guests"
//               />
//               <span className="text-sm text-gray-500">max {yacht.guests}</span>
//             </div>
//           </div>

//           {/* Booking Summary */}
//           {selectedDates && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100"
//             >
//               <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Yacht</span>
//                   <span className="font-medium">{yacht.name}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Dates</span>
//                   <span className="font-medium">{getDateRangeText()}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Guests</span>
//                   <span className="font-medium">{guests} people</span>
//                 </div>
//                 {getBookingDuration() >= 3 && (
//                   <div className="flex justify-between items-center text-green-600">
//                     <span>Discount Applied</span>
//                     <span>-10%</span>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}

//           {/* Book Button */}
//           <Button
//             onClick={handleInstantBook}
//             disabled={!selectedDates || isProcessing}
//             className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//             size="lg"
//           >
//             {isProcessing ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                 <span>Processing Payment...</span>
//               </div>
//             ) : !profileComplete ? (
//               <div className="flex items-center justify-center">
//                 <Zap className="w-5 h-5 mr-2" />
//                 <span>Complete Profile to Book</span>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center">
//                 <Zap className="w-5 h-5 mr-2" />
//                 <span>Book Now</span>
//               </div>
//             )}
//           </Button>

//           {/* Trust Indicators */}
//           <div className="mt-4 space-y-2">
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Shield className="w-4 h-4 text-green-600" />
//               <span>Secure booking with SSL encryption</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <CreditCard className="w-4 h-4 text-blue-600" />
//               <span>No charges until booking confirmation</span>
//             </div>
//           </div>

//           {/* Special Offer */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//             className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
//           >
//             <div className="flex items-center gap-2 mb-1">
//               <Calendar className="w-4 h-4 text-orange-600" />
//               <span className="text-sm font-semibold text-orange-800">Limited Time Offer</span>
//             </div>
//             <p className="text-xs text-orange-700">
//               Book for 3+ days and automatically get 10% off your total booking!
//             </p>
//           </motion.div>
//         </Card>
//       </motion.div>

//       {/* Modals */}
//       <BookingConfirmationModal
//         isOpen={showConfirmation}
//         onClose={() => setShowConfirmation(false)}
//         bookingDetails={bookingDetails}
//       />

//       <UserProfileModal
//         isOpen={showProfileModal}
//         onClose={() => setShowProfileModal(false)}
//         onProfileComplete={handleProfileComplete}
//         userProfile={userProfile}
//       />
//     </>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Users, Zap, Shield, CreditCard } from "lucide-react"
import BookingCalendar from "./booking-calendar"
import BookingConfirmationModal from "./booking-confirmation-modal"
import UserProfileModal from "./user-profile-modal"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface InstantBookingCardProps {
  yacht: {
    id: string
    name: string
    type: string
    price: number
    guests: number
    amenities: string[]
    unavailableDates: Date[]
  }
  selectedDates?: { start: Date; end: Date | null; isMultiDay: boolean } | null
  className?: string
}

interface BookingDetails {
  yachtName: string
  totalPrice: number
  startDate: Date
  endDate: Date | null
  guests: number
  bookingId: string
  bookingReference: string
  paymentId: string
}

export default function InstantBookingCard({ yacht, className = "" }: InstantBookingCardProps) {
  const router = useRouter()
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date | null; isMultiDay: boolean } | null>(null)
  const [guests, setGuests] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    checkUserProfile()
  }, [])

  const getAuthToken = async () => {
    const supabase = createClientComponentClient()
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token || ""
  }

  const checkUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (!response.ok) throw new Error("Failed to fetch profile")

      const data = await response.json()
      setUserProfile(data.profile)

      const isComplete =
        data.profile &&
        ["full_name", "phone", "email", "address", "city", "state", "zip_code", "country"].every(
          (field) => data.profile[field]
        )

      setProfileComplete(isComplete)
    } catch (error) {
      console.error("Error checking user profile:", error)
      setProfileComplete(false)
      toast({
        title: "Profile Error",
        description: "Failed to load user profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  const validateDateRange = (start: Date, end: Date | null): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (!end || start.getTime() === end.getTime()) return start >= today
    return start >= today && end > start
  }

  const calculateTotalPrice = () => {
    if (!selectedDates) return yacht.price * guests
    if (selectedDates.isMultiDay && selectedDates.end) {
      const nights = Math.max(1, Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24)))
      const basePrice = yacht.price * guests * nights
      return nights >= 3 ? basePrice * 0.9 : basePrice
    }
    return yacht.price * guests
  }

  const getBookingDuration = () => {
    if (!selectedDates) return 1
    if (!selectedDates.isMultiDay || !selectedDates.end) return 1
    return Math.max(1, Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24)))
  }

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve()
        return
      }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"))
      document.body.appendChild(script)
    })
  }

  const processRazorpayPayment = async (
    amount: number,
    bookingId: string,
    yachtName: string
  ): Promise<{ success: boolean; paymentId: string }> => {
    try {
      const token = await getAuthToken()

      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount, bookingId, yachtName })
      })

      if (!orderResponse.ok) {
        const err = await orderResponse.json()
        throw new Error(err.error || "Failed to create payment order")
      }

      const orderData = await orderResponse.json()
      await loadRazorpayScript()

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!key) throw new Error("Razorpay key missing. Check .env.local")

      return new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.id,
          name: "Yacht Services",
          description: `Booking for ${yachtName}`,
          handler: async (response: any) => {
            try {
              const verifyResponse = await fetch("/api/payments/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId
                })
              })

              const verifyData = await verifyResponse.json()
              if (verifyResponse.ok) {
                resolve({ success: true, paymentId: response.razorpay_payment_id })
              } else {
                reject(new Error(verifyData.error || "Payment verification failed"))
              }
            } catch (error) {
              reject(error)
            }
          },
          prefill: {
            name: userProfile?.full_name || "",
            email: userProfile?.email || "",
            contact: userProfile?.phone || ""
          },
          theme: { color: "#2563eb" },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) }
        })

        razorpay.open()
      })
    } catch (error) {
      console.error("Payment error:", error)
      throw error
    }
  }

  const handleInstantBook = async () => {
    if (!selectedDates) {
      toast({ title: "Date Required", description: "Please select your booking dates", variant: "destructive" })
      return
    }

    if (!validateDateRange(selectedDates.start, selectedDates.end)) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid booking dates",
        variant: "destructive"
      })
      return
    }

    if (!profileComplete) {
      setShowProfileModal(true)
      return
    }

    setIsProcessing(true)

    try {
      let adjustedEndDate = selectedDates.end
      if (!selectedDates.end || selectedDates.start.getTime() === selectedDates.end.getTime()) {
        adjustedEndDate = new Date(selectedDates.start)
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
      }

      const bookingData = {
        yacht_id: yacht.id,
        user_id: userProfile.id,
        start_date: selectedDates.start.toISOString().split("T")[0],
        end_date: adjustedEndDate.toISOString().split("T")[0],
        guests,
        total_price: calculateTotalPrice(),
        is_multi_day: selectedDates.isMultiDay, // ✅ Fix added
        status: "pending",
        booking_reference: Math.random().toString(36).substr(2, 9).toUpperCase(),
        contact_details: {
          name: userProfile.full_name,
          email: userProfile.email,
          phone: userProfile.phone
        }
      }

      const token = await getAuthToken()
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.error || "Failed to create booking")
      }

      const { booking } = await bookingResponse.json()
      const paymentResult = await processRazorpayPayment(calculateTotalPrice(), booking.id, yacht.name)

      setBookingDetails({
        yachtName: yacht.name,
        totalPrice: calculateTotalPrice(),
        startDate: selectedDates.start,
        endDate: adjustedEndDate,
        guests,
        bookingId: booking.id,
        bookingReference: bookingData.booking_reference,
        paymentId: paymentResult.paymentId
      })
      setShowConfirmation(true)
      setTimeout(() => router.push("/bookings"), 3000)
    } catch (error: any) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleProfileComplete = async (profile: any) => {
    setUserProfile(profile)
    setProfileComplete(true)
    setShowProfileModal(false)
    await handleInstantBook()
  }

  const getDateRangeText = () => {
    if (!selectedDates?.start) return "Select dates"
    if (selectedDates.isMultiDay && selectedDates.end) {
      const nights = Math.max(1, Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24)))
      return `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()} (${nights} nights)`
    }
    return selectedDates.start.toLocaleDateString()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-6 ${className}`}
      >
        <Card className="p-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-900">Instant Book</h3>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
              Available Now
            </Badge>
          </div>

          {/* Pricing Section */}
          <div className="mb-6 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">${yacht.price.toLocaleString()}</span>
              <span className="text-gray-600">/person/day</span>
            </div>

            {selectedDates && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 p-3 bg-blue-50/50 rounded-lg">
                <div className="text-sm text-gray-600">
                  Total for {getBookingDuration()} {getBookingDuration() === 1 ? "day" : "days"}:
                </div>
                <div className="text-xl font-bold text-primary">${calculateTotalPrice().toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {guests} guest{guests > 1 ? "s" : ""} × ${yacht.price}/person/day
                </div>
              </motion.div>
            )}
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">Choose Your Dates</Label>
            <BookingCalendar
              onDateSelect={setSelectedDates}
              unavailableDates={yacht.unavailableDates}
              yachtId={yacht.id}
            />
          </div>

          {/* Guests */}
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">Number of Guests</Label>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Input
                type="number"
                min="1"
                max={yacht.guests}
                value={guests}
                onChange={(e) => setGuests(Math.min(parseInt(e.target.value) || 1, yacht.guests))}
                className="flex-1"
                placeholder="Enter number of guests"
              />
              <span className="text-sm text-gray-500">max {yacht.guests}</span>
            </div>
          </div>

          {/* Summary */}
          {selectedDates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Yacht</span>
                  <span className="font-medium">{yacht.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates</span>
                  <span className="font-medium">{getDateRangeText()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{guests} people</span>
                </div>
                {getBookingDuration() >= 3 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Applied</span>
                    <span>-10%</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Book Button */}
          <Button
            onClick={handleInstantBook}
            disabled={!selectedDates || isProcessing}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Processing Payment...</span>
              </div>
            ) : !profileComplete ? (
              <div className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                <span>Complete Profile to Book</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                <span>Book Now</span>
              </div>
            )}
          </Button>

          {/* Trust Indicators */}
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure booking with SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>No charges until booking confirmation</span>
            </div>
          </div>

          {/* Offer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">Limited Time Offer</span>
            </div>
            <p className="text-xs text-orange-700">Book for 3+ days and automatically get 10% off your total booking!</p>
          </motion.div>
        </Card>
      </motion.div>

      <BookingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        bookingDetails={bookingDetails}
      />

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileComplete={handleProfileComplete}
        userProfile={userProfile}
      />
    </>
  )
}
