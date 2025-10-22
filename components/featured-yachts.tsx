"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export default function FeaturedYachts() {
  const yachts = [
    {
      id: 1,
      name: "Luxury Horizon",
      type: "Superyacht",
      price: "$5,000/day",
      rating: 4.9,
      reviews: 128,
      image: "🛥️",
      features: ["50m Length", "12 Guests", "Full Crew"],
    },
    {
      id: 2,
      name: "Ocean Pearl",
      type: "Motor Yacht",
      price: "$3,500/day",
      rating: 4.8,
      reviews: 95,
      image: "⛵",
      features: ["35m Length", "8 Guests", "Captain Included"],
    },
    {
      id: 3,
      name: "Sunset Dreams",
      type: "Sailing Yacht",
      price: "$2,800/day",
      rating: 4.7,
      reviews: 72,
      image: "🚤",
      features: ["28m Length", "6 Guests", "Experienced Crew"],
    },
  ]

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Featured Yachts</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Explore our handpicked collection of premium yachts available for your next adventure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {yachts.map((yacht, index) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="bg-gradient-to-br from-primary to-blue-900 p-8 flex items-center justify-center h-48">
                  <span className="text-7xl">{yacht.image}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{yacht.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {yacht.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(yacht.rating) ? "fill-accent text-accent" : "text-muted"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {yacht.rating} ({yacht.reviews} reviews)
                    </span>
                  </div>

                  <div className="space-y-2 mb-6 flex-1">
                    {yacht.features.map((feature, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        ✓ {feature}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-primary">{yacht.price}</span>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
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
