"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Star, MapPin, Users, Anchor, Filter, Calendar, X } from "lucide-react"
import BookingCalendar from "./booking-calendar"
import YachtImageGallery from "./yacht-image-gallery"
import { checkYachtAvailability, type YachtAvailability } from "@/lib/availability"
import { createSlug } from "@/lib/slug-utils"

export default function YachtsCatalog() {
  const [selectedType, setSelectedType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date | null; isMultiDay: boolean } | null>(null)
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    guests: 1,
    length: [20, 80],
    amenities: [] as string[]
  })
  const [yachts, setYachts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch yachts from database
  useEffect(() => {
    const fetchYachts = async () => {
      try {
        const response = await fetch('/api/yachts')
        const data = await response.json()

        if (!response.ok) {
          console.error('API returned error:', data)
          throw new Error(data.error || 'Failed to fetch yachts')
        }

        // Support both shape { yachts: [...] } or direct array/object
        const yachtsData = data.yachts ?? data ?? []
        setYachts(yachtsData)
      } catch (error) {
        console.error('Error fetching yachts:', error);
        // No fallback data - show empty state
        setYachts([])
      } finally {
        setLoading(false);
      }
    };

    fetchYachts();
  }, []);

  const yachtAvailabilities: YachtAvailability[] = yachts.map(yacht => ({
    yachtId: yacht.id,
    unavailableDates: Array.isArray(yacht.unavailableDates) ? yacht.unavailableDates : [],
    maintenanceDates: Array.isArray(yacht.maintenanceDates) ? yacht.maintenanceDates : []
  }))

  const types = ["all", "Superyacht", "Motor Yacht", "Sailing Yacht"]
  const allAmenities = Array.from(new Set(yachts.flatMap(y => y.amenities)))

  const handleDateSelect = (dates: { start: Date; end: Date | null; isMultiDay: boolean }) => {
    setSelectedDates(dates)
  }

  const filtered = yachts.filter((yacht) => {
    // Type filter
    if (selectedType !== "all" && yacht.type !== selectedType) return false

    // Date availability filter
    if (selectedDates) {
      const availability = checkYachtAvailability(
        yacht.id,
        selectedDates.start,
        selectedDates.end,
        yachtAvailabilities
      )
      if (!availability.isAvailable) return false
    }

    // Price filter
    if (yacht.price < filters.priceRange[0] || yacht.price > filters.priceRange[1]) return false

    // Guests filter
    if (yacht.guests < filters.guests) return false

    // Length filter
    if (yacht.length < filters.length[0] || yacht.length > filters.length[1]) return false

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        yacht.amenities.includes(amenity)
      )
      if (!hasAllAmenities) return false
    }

    return true
  })

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Browse Our Fleet</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Discover the perfect yacht for your next adventure
          </p>
        </motion.div>

        {/* Date Selection and Filters */}
        <div className="mb-8 space-y-6">
          {/* Date Selection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Select Your Dates</h3>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {showCalendar ? "Hide Calendar" : "Show Calendar"}
              </Button>
            </div>
            {showCalendar && (
              <BookingCalendar
                onDateSelect={handleDateSelect}
                yachtAvailabilities={yachtAvailabilities}
              />
            )}
          </Card>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 10000 || filters.guests !== 1 || filters.length[0] !== 20 || filters.length[1] !== 80 || filters.amenities.length > 0) && (
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                )}
              </Button>

              {selectedDates && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {selectedDates.start.toLocaleDateString()}
                    {selectedDates.end && ` - ${selectedDates.end.toLocaleDateString()}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDates(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {filtered.length} yacht{filtered.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Price Range (per day)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                        min={0}
                        max={10000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${filters.priceRange[0].toLocaleString()}</span>
                        <span>${filters.priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Minimum Guests</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={String(filters.guests)}
                      onChange={(e) => setFilters({ ...filters, guests: parseInt(e.target.value) || 1 })}
                      className="w-full"
                    />
                  </div>

                  {/* Length Range */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Length (meters)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={filters.length}
                        onValueChange={(value) => setFilters({ ...filters, length: value })}
                        min={20}
                        max={80}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{filters.length[0]}m</span>
                        <span>{filters.length[1]}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Amenities</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {allAmenities.map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, amenities: [...filters.amenities, amenity] })
                              } else {
                                setFilters({ ...filters, amenities: filters.amenities.filter(a => a !== amenity) })
                              }
                            }}
                            className="rounded"
                          />
                          <span>{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Yachts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((yacht, index) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card
                className="overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col cursor-pointer group"
                onClick={() => router.push(`/yachts/${createSlug(yacht.name)}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <YachtImageGallery
                    images={yacht.images}
                    yachtName={yacht.name}
                    className="h-full"
                  />
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
                      {yacht.type}
                    </Badge>
                    {yacht.specialOffers && yacht.specialOffers.length > 0 && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
                        {yacht.specialOffers[0].discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      className="bg-white/90 text-black hover:bg-white backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/yachts/${createSlug(yacht.name)}`)
                      }}
                    >
                      Quick View
                    </Button>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-foreground">{yacht.name}</h3>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(yacht.rating) ? "fill-accent text-accent" : "text-muted"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {yacht.rating} ({yacht.reviews})
                    </span>
                  </div>

                  <div className="space-y-2 mb-6 flex-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{yacht.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Up to {yacht.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Anchor size={16} />
                      <span>{yacht.length} length</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xl font-bold text-primary">${yacht.price.toLocaleString()}/day</span>
                    <button
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/yachts/${createSlug(yacht.name)}`)
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}