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
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

export default function ServicesWithVideoBackground() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const services = [
    {
      icon: Zap,
      titleKey: "services.aiBooking",
      descKey: "services.aiBookingDesc",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Calendar,
      titleKey: "services.smartSchedule",
      descKey: "services.smartScheduleDesc",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Shield,
      titleKey: "services.securePayment",
      descKey: "services.securePaymentDesc",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Users,
      titleKey: "services.staffManagement",
      descKey: "services.staffManagementDesc",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: TrendingUp,
      titleKey: "services.analytics",
      descKey: "services.analyticsDesc",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Globe,
      titleKey: "services.multiLocation",
      descKey: "services.multiLocationDesc",
      color: "from-blue-500/20 to-cyan-500/20",
    },
  ];
  
  const benefits = [
    { icon: Sparkles, textKey: "benefits.fasterBooking" },
    { icon: TrendingUp, textKey: "benefits.revenue" },
    { icon: HeartHandshake, textKey: "benefits.satisfaction" },
    { icon: Shield, textKey: "benefits.security" },
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
            <span className="text-sm font-medium">{t("services.title")}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            {t("services.title")}
          </h2>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto text-balance">
            {t("services.subtitle")}
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
                  <h3 className="text-2xl font-bold mb-3 text-white">{t(service.titleKey)}</h3>
                  <p className="text-white/80 leading-relaxed">
                    {t(service.descKey)}
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
                <p className="font-semibold">{t(benefit.textKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>  
      </div>
    </section>
  );
}
