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
      initials: "JM"
    },
    {
      id: 2,
      name: "Sofia Rodriguez",
      role: "Travel Blogger",
      rating: 5,
      text: "I've booked yachts all over the world, but Marina's platform is by far the best. The selection is outstanding, prices are transparent, and the booking process takes minutes. Highly recommended!",
      initials: "SR"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Wedding Planner",
      rating: 5,
      text: "We organized a dream wedding on one of Marina's yachts. Everything from booking to execution was flawless. The 24/7 support team went above and beyond to make it perfect!",
      initials: "MC"
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Loved by Thousands
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients around the globe
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full hover:shadow-luxury transition-all duration-300 relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-accent/20" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <Avatar className="w-12 h-12 gradient-ocean">
                    <AvatarFallback className="bg-transparent text-primary-foreground font-bold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}