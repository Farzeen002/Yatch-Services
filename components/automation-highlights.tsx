"use client"

import { motion } from "framer-motion"

export default function AutomationHighlights() {
  const processes = [
    {
      process: "Customer Inquiry",
      current: "Manual phone/email",
      automated: "Chatbot handles instantly",
      icon: "📞",
    },
    {
      process: "Booking Management",
      current: "Excel/manual",
      automated: "Auto calendar updates",
      icon: "📅",
    },
    {
      process: "Payments",
      current: "Manual bank transfer",
      automated: "Online mock payments",
      icon: "💳",
    },
    {
      process: "Follow-up",
      current: "None",
      automated: "Automated reminders",
      icon: "🔔",
    },
    {
      process: "Analytics",
      current: "None",
      automated: "Dashboard insights",
      icon: "📊",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">AI & Automation Highlights</h2>
          <p className="text-gray-600 text-lg">See how Marina transforms manual processes into automated workflows</p>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="text-left py-4 px-4 font-bold text-primary">Process</th>
                <th className="text-left py-4 px-4 font-bold text-primary">Current</th>
                <th className="text-left py-4 px-4 font-bold text-primary">Automated</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((item, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 font-semibold text-primary flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    {item.process}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.current}</td>
                  <td className="py-4 px-4">
                    <span className="bg-accent/20 text-primary px-3 py-1 rounded-full font-medium text-sm">
                      {item.automated}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Future Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 bg-linear-to-r from-primary/5 to-accent/5 rounded-xl p-8 border border-accent/20"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">Future Add-ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💬</span>
              <span className="text-gray-700">WhatsApp bot integration</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <span className="text-gray-700">AI trip recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📈</span>
              <span className="text-gray-700">Revenue analytics</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
