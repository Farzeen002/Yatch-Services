"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChatHistory, type ChatMessage } from "@/hooks/use-chat-history"

// Extended ChatMessage type to include payment data
interface ExtendedChatMessage extends ChatMessage {
  showPaymentButton?: boolean
  paymentData?: {
    orderId: string
    amount: number
    currency: string
    razorpayKey: string
    bookingId: string
    yachtName: string
  }
}

export default function Chatbot({ onMessage }: { onMessage?: (message: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, addMessage, clearHistory, isLoaded } = useChatHistory()

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
      const greeting: ExtendedChatMessage = {
        id: 1,
        text: "Hi! I'm Marina, your AI yacht booking assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      }
      addMessage(greeting)
    }
  }, [isLoaded])

  // Handle Razorpay Payment
  const handlePayment = async (paymentData: any) => {
    if (paymentProcessing) return
    
    setPaymentProcessing(true)

    try {
      // Load Razorpay script dynamically
      const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.async = true
          script.onload = resolve
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      await loadRazorpayScript()

      const options = {
        key: paymentData.razorpayKey,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Yacht Charter Booking",
        description: `Booking for ${paymentData.yachtName}`,
        order_id: paymentData.orderId,
        handler: async function (response: any) {
          try {
            // Show processing message
            const processingMessage: ExtendedChatMessage = {
              id: Date.now(),
              text: "⏳ Verifying your payment...",
              sender: "bot",
              timestamp: new Date(),
            }
            addMessage(processingMessage)

           const verifyResponse = await fetch('/api/payments-bot/verify-bot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
    bookingId: paymentData.bookingId,
  })
})
            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              // Payment successful
              const successMessage: ExtendedChatMessage = {
                id: Date.now() + 1,
                text: `✅ **Payment Successful!**\n\n` +
                      `🎉 Your booking for **${paymentData.yachtName}** is confirmed!\n\n` +
                      `**Payment Details:**\n` +
                      `Payment ID: ${response.razorpay_payment_id}\n` +
                      `Order ID: ${response.razorpay_order_id}\n` +
                      `Amount: ₹${(paymentData.amount / 100).toLocaleString()}\n\n` +
                      `📧 You'll receive a confirmation email shortly.\n` +
                      `📱 Check "My Bookings" for your itinerary.`,
                sender: "bot",
                timestamp: new Date(),
              }
              addMessage(successMessage)
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            const errorMessage: ExtendedChatMessage = {
              id: Date.now() + 1,
              text: "❌ Payment verification failed. Please contact support with your payment ID.",
              sender: "bot",
              timestamp: new Date(),
            }
            addMessage(errorMessage)
          } finally {
            setPaymentProcessing(false)
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#1e40af"
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false)
            const dismissMessage: ExtendedChatMessage = {
              id: Date.now(),
              text: "Payment cancelled. You can try again by clicking the payment button above.",
              sender: "bot",
              timestamp: new Date(),
            }
            addMessage(dismissMessage)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      
      rzp.on('payment.failed', function (response: any) {
        setPaymentProcessing(false)
        console.error('Payment failed:', response.error)
        const failedMessage: ExtendedChatMessage = {
          id: Date.now(),
          text: `❌ Payment failed: ${response.error.description}\n\nPlease try again or contact support.`,
          sender: "bot",
          timestamp: new Date(),
        }
        addMessage(failedMessage)
      })

      rzp.open()
    } catch (error) {
      setPaymentProcessing(false)
      console.error('Payment error:', error)
      const errorMessage: ExtendedChatMessage = {
        id: Date.now(),
        text: "Failed to load payment gateway. Please check your internet connection and try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      addMessage(errorMessage)
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: ExtendedChatMessage = {
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
      const response = await fetch("/api/chat-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      })

      const data = await response.json()

      const botMessage: ExtendedChatMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
        type: data.type,
        showPaymentButton: data.showPaymentButton, // NEW: Payment button flag
        paymentData: data.paymentData, // NEW: Payment data
      }

      addMessage(botMessage)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ExtendedChatMessage = {
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

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      clearHistory()
      // Add welcome message after clearing
      const greeting: ExtendedChatMessage = {
        id: Date.now(),
        text: "Hi! I'm Marina, your AI yacht booking assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      }
      addMessage(greeting)
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
            <div className="bg-linear-to-r from-primary to-blue-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Marina AI Assistant</h3>
                <p className="text-sm text-blue-100">Instant yacht booking support</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleClearChat}
                  className="text-white hover:text-blue-100 transition-colors text-sm px-2 py-1 rounded hover:bg-white/10"
                  title="Clear chat history"
                >
                  🗑️
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white hover:text-blue-100 transition-colors text-xl"
                  title="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const extMsg = msg as ExtendedChatMessage
                return (
                  <motion.div
                    key={extMsg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${extMsg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        extMsg.sender === "user"
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">
                        {extMsg.text.split('\n').map((line, index) => {
                          // Check if line contains a markdown link
                          const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/)
                          if (linkMatch) {
                            const [, linkText, linkUrl] = linkMatch
                            return (
                              <div key={index} className="mb-2">
                                {line.split(/\[([^\]]+)\]\(([^)]+)\)/).map((part, partIndex) => {
                                  if (partIndex % 3 === 0) {
                                    return <span key={partIndex}>{part}</span>
                                  } else if (partIndex % 3 === 1) {
                                    return (
                                      <a
                                        key={partIndex}
                                        href={linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                                      >
                                        {linkText}
                                      </a>
                                    )
                                  }
                                  return null
                                })}
                              </div>
                            )
                          }
                          
                          // Render bold text (**text**)
                          const boldParts = line.split(/\*\*([^*]+)\*\*/g)
                          if (boldParts.length > 1) {
                            return (
                              <div key={index} className="mb-1">
                                {boldParts.map((part, partIndex) => {
                                  // Odd indices are the bold text
                                  if (partIndex % 2 === 1) {
                                    return <strong key={partIndex} className="font-bold">{part}</strong>
                                  }
                                  return <span key={partIndex}>{part}</span>
                                })}
                              </div>
                            )
                          }
                          
                          return <div key={index} className="mb-1">{line}</div>
                        })}
                      </div>
                      
                      {/* PAYMENT BUTTON */}
                      {extMsg.showPaymentButton && extMsg.paymentData && (
                        <motion.button
                          onClick={() => handlePayment(extMsg.paymentData)}
                          disabled={paymentProcessing}
                          className="mt-3 w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: paymentProcessing ? 1 : 1.02 }}
                          whileTap={{ scale: paymentProcessing ? 1 : 0.98 }}
                        >
                          {paymentProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>💳</span>
                              <span>Pay ₹{(extMsg.paymentData.amount / 100).toLocaleString()}</span>
                            </>
                          )}
                        </motion.button>
                      )}
                      
                      {extMsg.type === "automated" && <p className="text-xs mt-1 opacity-70">Instant response</p>}
                    </div>
                  </motion.div>
                )
              })}

              {isLoading && (
                <div className="flex gap-2">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, delay: 0.1, repeat: Infinity }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
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