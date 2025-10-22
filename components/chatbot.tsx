"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChatHistory, type ChatMessage } from "@/hooks/use-chat-history"

export default function Chatbot({ onMessage }: { onMessage?: (message: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, addMessage, isLoaded } = useChatHistory()

  const quickOptions = [
    "View available yachts",
    "What's the pricing?",
    "Check my bookings",
    "Book a yacht",
    "Special requests",
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isLoaded && messages.length === 0) {
      const greeting: ChatMessage = {
        id: 1,
        text: "Hi! I'm Marina, your AI yacht booking assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      }
      addMessage(greeting)
    }
  }, [isLoaded])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    }

    addMessage(userMessage)
    onMessage?.(userMessage)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      const data = await response.json()

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
        type: data.type,
      }

      addMessage(botMessage)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) return null

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-accent text-primary rounded-full shadow-lg flex items-center justify-center font-bold text-2xl hover:shadow-xl transition-all z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        💬
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-900 text-white p-4 rounded-t-2xl flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Marina AI Assistant</h3>
                <p className="text-sm text-blue-100">Instant yacht booking support</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-100 transition-colors">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.type === "automated" && <p className="text-xs mt-1 opacity-70">Instant response</p>}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Options */}
            {messages.length === 1 && (
              <div className="px-4 py-2 space-y-2 border-t border-gray-200">
                {quickOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSendMessage(option)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 p-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage(input)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm disabled:bg-gray-50"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
