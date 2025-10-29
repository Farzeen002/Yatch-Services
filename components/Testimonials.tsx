"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "James Morrison",
      role: "CEO, Tech Ventures",
      rating: 5,
      text: "Marina made booking our corporate retreat yacht incredibly simple. The AI recommendations were spot-on, and the service was impeccable. Our team had an unforgettable experience!",
      initials: "JM",
    },
    {
      id: 2,
      name: "Sofia Rodriguez",
      role: "Travel Blogger",
      rating: 5,
      text: "I've booked yachts all over the world, but Marina's platform is by far the best. The selection is outstanding, prices are transparent, and the booking process takes minutes. Highly recommended!",
      initials: "SR",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Wedding Planner",
      rating: 5,
      text: "We organized a dream wedding on one of Marina's yachts. Everything from booking to execution was flawless. The 24/7 support team went above and beyond to make it perfect!",
      initials: "MC",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-24 px-4 bg-gradient-to-b from-secondary via-background to-secondary overflow-hidden"
    >
      {/* Subtle wave-like gradient overlay for elegance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from clients who’ve sailed with us.
          </p>
        </motion.div>

        {/* Grid layout for desktop, carousel-like scroll for mobile */}
        <div className="grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x md:snap-none scroll-smooth">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="snap-center md:snap-none flex-shrink-0"
            >
              <Card className="p-8 h-full hover:shadow-luxury transition-all duration-500 relative bg-background/80 backdrop-blur-lg border border-border/40 rounded-2xl">
                {/* Decorative quote icon */}
                <motion.div
                  className="absolute top-6 right-6 text-accent/20"
                  initial={{ rotate: -10, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Quote className="w-12 h-12" />
                </motion.div>

                {/* Star ratings */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent drop-shadow-sm"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-foreground mb-6 leading-relaxed italic relative z-10">
                  “{testimonial.text}”
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-4 mt-auto">
                  <Avatar className="w-12 h-12 gradient-ocean ring-2 ring-accent/20">
                    <AvatarFallback className="bg-transparent text-primary-foreground font-bold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating decorative accent (optional) */}
      <motion.div
        className="absolute -bottom-20 left-1/2 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
