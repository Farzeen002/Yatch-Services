"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, Anchor, Calendar, Clock, Wifi, Car, Utensils, Waves } from "lucide-react"
import BookingCalendar from "@/components/booking-calendar"
// import FunctionalMap from "@/components/functional-map"
import YachtImageGallery from "@/components/yacht-image-gallery"
import InstantBookingCard from "@/components/instant-booking-card"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

interface YachtDetails {
  id: string
  name: string
  type: string
  price: number
  rating: number
  reviews: number
  location: string
  guests: number
  length: string
  images: string[]
  description: string
  amenities: string[]
  features: string[]
  specifications: {
    year: number
    beam: string
    draft: string
    fuel: string
    speed: string
  }
  crew: {
    captain: boolean
    crew: number
    chef: boolean
  }
  availability: {
    unavailableDates: Date[]
  }
  specialOffers?: {
    title: string
    description: string
    discount: number
    validUntil: Date
  }[]
}

export default function YachtDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [yacht, setYacht] = useState<YachtDetails | null>(null)
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date | null; isMultiDay: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch yacht data from API using slug
  useEffect(() => {
    const fetchYacht = async () => {
      try {
        const slug = params.slug as string
        const response = await fetch(`/api/yachts/${slug}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch yacht')
        }

        // Transform API data to match interface (expecting data.yacht)
        const transformedYacht: YachtDetails = {
          id: data.yacht.id,
          name: data.yacht.name,
          type: data.yacht.type,
          price: data.yacht.price,
          rating: data.yacht.rating,
          reviews: data.yacht.reviews,
          location: data.yacht.location,
          guests: data.yacht.guests,
          length: `${data.yacht.length}m`,
          images: data.yacht.images && data.yacht.images.length > 0 ? data.yacht.images : [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          ],
          description: data.yacht.description || "A beautiful yacht for your next adventure.",
          amenities: data.yacht.amenities || [],
          features: data.yacht.amenities || [], // Using amenities as features for now
          specifications: {
            year: 2020, // Default values since not in schema
            beam: "8m",
            draft: "2m",
            fuel: "Diesel",
            speed: "20 knots"
          },
          crew: {
            captain: true,
            crew: Math.ceil(data.yacht.guests / 4), // Estimate crew based on guests
            chef: data.yacht.guests > 8 // Chef for larger yachts
          },
          availability: {
            unavailableDates: data.yacht.unavailable_dates ? data.yacht.unavailable_dates.map((date: string) => new Date(date)) : []
          }
        }
        setYacht(transformedYacht)
      } catch (error) {
        console.error('Error fetching yacht:', error);
        // No fallback data - show not found
        setYacht(null)
      } finally {
        setLoading(false);
      }
    };

    fetchYacht();
  }, [params.slug])

  const handleDateSelect = (dates: { start: Date; end: Date | null; isMultiDay: boolean }) => {
    setSelectedDates(dates)
  }

  const calculateTotalPrice = () => {
    if (!yacht || !selectedDates) return 0

    if (selectedDates.isMultiDay && selectedDates.end) {
      const nights = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
      return yacht.price * nights
    }

    return yacht.price
  }

  const handleBookNow = () => {
    if (!selectedDates) {
      alert("Please select your dates first")
      return
    }

    const totalPrice = calculateTotalPrice()
    const bookingDetails = {
      yacht: yacht?.name,
      dates: selectedDates,
      totalPrice,
      bookingId: Math.random().toString(36).substr(2, 9).toUpperCase()
    }

    // In a real app, this would redirect to a booking confirmation page
    alert(`Booking confirmed!\nYacht: ${yacht?.name}\nDates: ${selectedDates.start.toLocaleDateString()}${selectedDates.end ? ` - ${selectedDates.end.toLocaleDateString()}` : ''}\nTotal: $${totalPrice.toLocaleString()}\nBooking ID: ${bookingDetails.bookingId}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading yacht details...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!yacht) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Yacht Not Found</h1>
            <p className="text-muted-foreground mb-4">The yacht you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/yachts")}>
              Back to Yachts
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Ocean Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Yacht Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Yacht Image and Basic Info */}
            <Card className="overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <YachtImageGallery
                  images={yacht.images}
                  yachtName={yacht.name}
                  className="h-full"
                />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-white/90 text-black mb-2">
                    {yacht.type}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{yacht.name}</h1>
                    <Badge variant="secondary" className="mb-3">
                      {yacht.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">${yacht.price.toLocaleString()}/day</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(yacht.rating) ? "fill-accent text-accent" : "text-muted"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {yacht.rating} ({yacht.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="text-sm">{yacht.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span className="text-sm">{yacht.guests} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Anchor size={16} className="text-muted-foreground" />
                    <span className="text-sm">{yacht.length}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{yacht.description}</p>
              </div>
            </Card>

            {/* Amenities */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {yacht.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Special Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {yacht.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Specifications */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Year Built</span>
                  <p className="font-medium">{yacht.specifications.year}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Beam</span>
                  <p className="font-medium">{yacht.specifications.beam}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Draft</span>
                  <p className="font-medium">{yacht.specifications.draft}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Max Speed</span>
                  <p className="font-medium">{yacht.specifications.speed}</p>
                </div>
              </div>
            </Card>

            {/* Crew Information */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Crew</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Professional Captain</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{yacht.crew.crew} crew members</span>
                </div>
                {yacht.crew.chef && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Private Chef</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Special Offers */}
            {yacht.specialOffers && yacht.specialOffers.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Special Offers</h3>
                <div className="space-y-4">
                  {yacht.specialOffers.map((offer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-orange-800">{offer.title}</h4>
                          <p className="text-sm text-orange-700 mt-1">{offer.description}</p>
                          <p className="text-xs text-orange-600 mt-2">
                            Valid until: {offer.validUntil.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-bold">
                          {offer.discount}% OFF
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

          </motion.div>

          {/* Instant Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <InstantBookingCard
              yacht={{
                id: yacht.id,
                name: yacht.name,
                type: yacht.type,
                price: yacht.price,
                guests: yacht.guests,
                amenities: yacht.amenities,
                unavailableDates: yacht.availability.unavailableDates
              }}
            />
          </motion.div>

          {/* Functional Map - Right side after payment card */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <FunctionalMap
              yachtLocation={yacht.location}
              yachtName={yacht.name}
            />
          </motion.div> */}
        </div>
      </div>

      <Footer />
    </main>
  )
}

