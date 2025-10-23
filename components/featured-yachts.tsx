import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Anchor, MapPin } from "lucide-react";
import yacht1 from "@/app/assets/yacht-1.jpg";
import yacht2 from "@/app/assets/yacht-2.jpg";
import yacht3 from "@/app/assets/yacht-3.jpg";

export default function FeaturedYachts() {
const yachts = [
  {
    id: 1,
    name: "Luxury Horizon",
    type: "Superyacht",
    price: "$5,000",
    period: "per day",
    rating: 4.9,
    reviews: 128,
    image: "/assets/yacht-1.jpg",
    location: "Monaco",
    features: ["50m Length", "12 Guests", "Full Crew"],
  },
  {
    id: 2,
    name: "Ocean Pearl",
    type: "Motor Yacht",
    price: "$3,500",
    period: "per day",
    rating: 4.8,
    reviews: 95,
    image: "/assets/yacht-2.jpg",
    location: "Ibiza",
    features: ["35m Length", "8 Guests", "Captain Included"],
  },
  {
    id: 3,
    name: "Sunset Dreams",
    type: "Sailing Yacht",
    price: "$2,800",
    period: "per day",
    rating: 4.7,
    reviews: 72,
    image: "/assets/yacht-3.jpg",
    location: "Caribbean",
    features: ["28m Length", "6 Guests", "Experienced Crew"],
  },
];


  return (
    <section id="yachts" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 gradient-gold border-0">Featured Collection</Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Premium Yachts
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Handpicked collection of the world's finest yachts, ready for your next luxury adventure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {yachts.map((yacht, index) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 h-full flex flex-col group cursor-pointer border-2 hover:border-accent/50">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={yacht.image} 
                    alt={yacht.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground border-0 font-bold">
                      {yacht.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{yacht.location}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{yacht.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold text-foreground">{yacht.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({yacht.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {yacht.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">{yacht.price}</div>
                      <div className="text-sm text-muted-foreground">{yacht.period}</div>
                    </div>
                    <button className="px-6 py-3 gradient-gold rounded-lg font-bold hover:shadow-glow transition-all transform hover:scale-105">
                      Book Now
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-luxury transition-all transform hover:scale-105">
            View All Yachts
          </button>
        </motion.div>
      </div>
    </section>
  );
}