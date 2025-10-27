"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Booking {
  status: string;
  paymentStatus: string;
  price: number;
  paidAmount: number;
}

interface BookingStatsProps {
  bookings: Booking[];
}

export default function BookingStats({ bookings }: BookingStatsProps) {
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus !== "refunded")
    .reduce((sum, b) => sum + b.paidAmount, 0);
  const pendingPayments = bookings
    .filter((b) => b.paymentStatus === "partial" || b.paymentStatus === "unpaid")
    .reduce((sum, b) => sum + (b.price - b.paidAmount), 0);

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Confirmed",
      value: confirmedBookings,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending Payments",
      value: `$${pendingPayments.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
