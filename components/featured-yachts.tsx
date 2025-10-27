import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Anchor, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createSlug } from "@/lib/slug-utils";

interface Yacht {
  id: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  location: string;
  guests: number;
  length: number;
  amenities: string[];
}

export default function FeaturedYachts() {
  const router = useRouter();
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYachts = async () => {
      try {
        const response = await fetch('/api/yachts?limit=3')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch yachts')
        }

        setYachts(data.yachts || [])
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yachts.map((yacht, index) => (
              <motion.div
                key={yacht.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-luxury transition-all duration-300 h-full flex flex-col group cursor-pointer border-2 hover:border-accent/50"
                  onClick={() => router.push(`/yachts/${createSlug(yacht.name)}`)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={yacht.images && yacht.images.length > 0 ? yacht.images[0] : "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"} 
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
                      <Badge variant="secondary" className="text-xs">
                        {yacht.length}m Length
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {yacht.guests} Guests
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Full Crew
                      </Badge>
                    </div>

                    <div className="mt-auto pt-4 border-t flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-primary">${yacht.price?.toLocaleString() || yacht.price}</div>
                        <div className="text-sm text-muted-foreground">per day</div>
                      </div>
                      <button 
                        className="px-6 py-3 gradient-gold rounded-lg font-bold hover:shadow-glow transition-all transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/yachts/${createSlug(yacht.name)}`);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button 
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-luxury transition-all transform hover:scale-105"
            onClick={() => router.push("/yachts")}
          >
            View All Yachts
          </button>
        </motion.div>
      </div>
    </section>
  );
}