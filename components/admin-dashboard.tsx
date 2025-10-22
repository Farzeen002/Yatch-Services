"use client"

import { motion } from "framer-motion"

interface AdminDashboardProps {
  bookings?: any[]
  chatMessages?: any[]
}

export default function AdminDashboard({ bookings = [], chatMessages = [] }: AdminDashboardProps) {
  const handleApprove = (id: number) => {
    alert(`Booking #${id} approved!`)
  }

  const handleReject = (id: number) => {
    alert(`Booking #${id} rejected!`)
  }

  return (
    <section className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-primary"
            >
              <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
              <p className="text-4xl font-bold text-primary mt-2">{bookings.length}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-accent"
            >
              <p className="text-gray-600 text-sm font-medium">Chat Messages</p>
              <p className="text-4xl font-bold text-accent mt-2">{chatMessages.length}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500"
            >
              <p className="text-gray-600 text-sm font-medium">Revenue</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString()}
              </p>
            </motion.div>
          </div>

          {/* Bookings List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Recent Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No bookings yet. Start by making a booking!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-primary">Yacht</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Guests</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, idx) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{booking.yachtName}</td>
                        <td className="py-3 px-4">{booking.date}</td>
                        <td className="py-3 px-4">{booking.guests}</td>
                        <td className="py-3 px-4 font-semibold text-accent">${booking.totalPrice.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Chat Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Chat Inquiries</h2>
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No chat messages yet.</p>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-primary">
                        {msg.sender === "user" ? "Customer" : "Marina"}:
                      </span>
                    </p>
                    <p className="text-gray-800">{msg.text}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
