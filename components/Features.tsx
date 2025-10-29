"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Globe,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ServicesWithVideoBackground() {
  const services = [
    {
      icon: Zap,
      title: "AI-Powered Booking",
      description:
        "Instant yacht bookings with intelligent recommendations powered by advanced AI technology.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Automated calendar management and booking optimization to maximize your yacht utilization.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "Bank-level security with instant payment processing and automated invoicing system.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Users,
      title: "Staff Management",
      description:
        "Comprehensive crew scheduling, certification tracking, and performance management.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description:
        "Real-time insights and detailed reports to grow your yacht charter business.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Globe,
      title: "Multi-Location Support",
      description:
        "Manage multiple marinas and destinations from a single powerful platform.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
  ];

  const benefits = [
    { icon: Sparkles, text: "50% Faster Booking Process" },
    { icon: TrendingUp, text: "35% Revenue Increase" },
    { icon: HeartHandshake, text: "98% Customer Satisfaction" },
    { icon: Shield, text: "Enterprise-Grade Security" },
  ];

  return (
    <section
      id="services"
      className="relative py-24 px-4 overflow-hidden text-white"
    >
      {/* 🎥 Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/yacht-2.mp4" // ✅ Replace with your video path
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🟦 Navy overlay using --primary */}
      <div className="absolute inset-0 bg-[var(--primary)] opacity-80 mix-blend-multiply"></div>

      {/* Dark layer for contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Why Choose Marina</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Everything You Need to Run a{" "}
            <span className="text-yellow-400">Successful Yacht Business</span>
          </h2>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto text-balance">
            From instant AI bookings to comprehensive staff management, Marina
            provides all the tools you need to scale your yacht charter business
            efficiently.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="p-8 h-full bg-white/10 backdrop-blur-md border-white/20 hover:border-yellow-400/50 transition-all duration-300 group relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-white/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
                  <benefit.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="font-semibold">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of yacht owners who trust Marina
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-glow"
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
