"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Anchor } from "lucide-react"

export default function YachtsCatalog() {
  const [selectedType, setSelectedType] = useState("all")

  const yachts = [
    {
      id: 1,
      name: "Luxury Horizon",
      type: "Superyacht",
      price: "$5,000/day",
      rating: 4.9,
      reviews: 128,
      location: "Miami, FL",
      guests: 12,
      length: "50m",
      image: "🛥️",
    },
    {
      id: 2,
      name: "Ocean Pearl",
      type: "Motor Yacht",
      price: "$3,500/day",
      rating: 4.8,
      reviews: 95,
      location: "Miami, FL",
      guests: 8,
      length: "35m",
      image: "⛵",
    },
    {
      id: 3,
      name: "Sunset Dreams",
      type: "Sailing Yacht",
      price: "$2,800/day",
      rating: 4.7,
      reviews: 72,
      location: "Key West, FL",
      guests: 6,
      length: "28m",
      image: "🚤",
    },
    {
      id: 4,
      name: "Azure Escape",
      type: "Motor Yacht",
      price: "$4,200/day",
      rating: 4.9,
      reviews: 110,
      location: "Miami, FL",
      guests: 10,
      length: "42m",
      image: "🛥️",
    },
    {
      id: 5,
      name: "Serenity",
      type: "Sailing Yacht",
      price: "$2,200/day",
      rating: 4.6,
      reviews: 58,
      location: "Key Largo, FL",
      guests: 4,
      length: "22m",
      image: "⛵",
    },
    {
      id: 6,
      name: "Prestige",
      type: "Superyacht",
      price: "$6,500/day",
      rating: 5.0,
      reviews: 89,
      location: "Miami, FL",
      guests: 16,
      length: "65m",
      image: "🛥️",
    },
  ]

  const types = ["all", "Superyacht", "Motor Yacht", "Sailing Yacht"]
  const filtered = selectedType === "all" ? yachts : yachts.filter((y) => y.type === selectedType)

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

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedType === type
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
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="bg-gradient-to-br from-primary to-blue-900 p-8 flex items-center justify-center h-40">
                  <span className="text-6xl">{yacht.image}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-foreground">{yacht.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {yacht.type}
                    </Badge>
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
                    <span className="text-xl font-bold text-primary">{yacht.price}</span>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                      Book Now
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
