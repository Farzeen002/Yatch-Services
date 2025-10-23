import { motion } from "framer-motion";
import { Sparkles, Shield, Clock, HeadphonesIcon, Globe, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Search",
      description: "Our intelligent system finds the perfect yacht based on your preferences in seconds"
    },
    {
      icon: Shield,
      title: "100% Verified",
      description: "Every yacht is thoroughly inspected and verified for safety and luxury standards"
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description: "Book your dream yacht instantly with our streamlined process and instant confirmation"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Concierge",
      description: "Round-the-clock premium support to ensure your experience is flawless"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access to luxury yachts in over 120 premium destinations worldwide"
    },
    {
      icon: Zap,
      title: "Best Price Guarantee",
      description: "We guarantee the best rates on luxury yacht rentals with transparent pricing"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 gradient-ocean">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 text-balance">
            Why Choose Marina
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 text-balance max-w-2xl mx-auto">
            Experience the future of yacht booking with cutting-edge technology and unmatched service
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 hover:shadow-luxury group">
                <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-3">{feature.title}</h3>
                <p className="text-primary-foreground/70 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}