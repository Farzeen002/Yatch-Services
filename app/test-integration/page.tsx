"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BookingForm from "@/components/booking-form"
import PaymentComponent from "@/components/payment-component"
import Chatbot from "@/components/chatbot"

// Sample yacht data
const sampleYacht = {
  id: 1,
  name: "Ocean Dream",
  type: "Motor Yacht",
  price: 8500,
  capacity: 12,
  length: "85ft",
  location: "Monaco Marina"
}

export default function TestIntegrationPage() {
  const [activeTest, setActiveTest] = useState<'chatbot' | 'booking' | 'payment'>('chatbot')
  const [testBookingId, setTestBookingId] = useState<string | null>(null)

  const handleBookingComplete = (bookingId: string) => {
    setTestBookingId(bookingId)
    setActiveTest('payment')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yacht Services Integration Test
          </h1>
          <p className="text-gray-600">
            Test the complete integration: AI Chatbot, Booking Flow, and Payment Processing
          </p>
        </div>

        {/* Test Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTest === 'chatbot' ? 'default' : 'ghost'}
              onClick={() => setActiveTest('chatbot')}
              className="mx-1"
            >
              AI Chatbot
            </Button>
            <Button
              variant={activeTest === 'booking' ? 'default' : 'ghost'}
              onClick={() => setActiveTest('booking')}
              className="mx-1"
            >
              Booking Flow
            </Button>
            <Button
              variant={activeTest === 'payment' ? 'default' : 'ghost'}
              onClick={() => setActiveTest('payment')}
              className="mx-1"
              disabled={!testBookingId}
            >
              Payment Test
            </Button>
          </div>
        </div>

        {/* Test Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Test Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to test each component
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTest === 'chatbot' && (
                  <div>
                    <h3 className="font-semibold mb-2">🤖 AI Chatbot Test</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Click the chat button (💬) in the bottom right</li>
                      <li>• Try yacht-related queries: "What yachts are available?"</li>
                      <li>• Test pricing: "How much for 8 guests for 3 days?"</li>
                      <li>• Test recommendations: "Recommend a luxury yacht"</li>
                      <li>• Test Arabic translation: "Translate to Arabic: I want to book"</li>
                      <li>• Try non-yacht queries (should redirect)</li>
                    </ul>
                  </div>
                )}

                {activeTest === 'booking' && (
                  <div>
                    <h3 className="font-semibold mb-2">📅 Booking Flow Test</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Fill in the booking form on the right</li>
                      <li>• Select start and end dates</li>
                      <li>• Choose number of guests</li>
                      <li>• Enter contact information</li>
                      <li>• Add special requests (optional)</li>
                      <li>• Review price summary</li>
                      <li>• Click "Continue to Payment"</li>
                    </ul>
                  </div>
                )}

                {activeTest === 'payment' && (
                  <div>
                    <h3 className="font-semibold mb-2">💳 Payment Test</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Use Razorpay test credentials</li>
                      <li>• Test card: 4111 1111 1111 1111</li>
                      <li>• Any future expiry date</li>
                      <li>• Any CVV</li>
                      <li>• Complete the payment flow</li>
                      <li>• Verify payment is processed</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gemini AI Chatbot</span>
                  <span className="text-green-600 text-sm">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Azure Translator</span>
                  <span className="text-green-600 text-sm">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Razorpay Payments</span>
                  <span className="text-green-600 text-sm">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Supabase Database</span>
                  <span className="text-green-600 text-sm">✓ Active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Test Components */}
          <div>
            {activeTest === 'chatbot' && (
              <Card>
                <CardHeader>
                  <CardTitle>Chatbot Test</CardTitle>
                  <CardDescription>
                    The chatbot is available via the floating button. Try these test queries:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Yacht Queries:</strong><br/>
                    "What yachts are available?"<br/>
                    "How much does Ocean Dream cost?"<br/>
                    "Recommend a yacht for 10 guests"
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Pricing Queries:</strong><br/>
                    "Price for 8 guests for 3 days"<br/>
                    "What's the total cost?"<br/>
                    "Any discounts available?"
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Non-Yacht (Should Redirect):</strong><br/>
                    "What's the weather today?"<br/>
                    "Tell me a joke"<br/>
                    "How do I cook pasta?"
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTest === 'booking' && (
              <BookingForm
                yacht={sampleYacht}
                onBookingComplete={handleBookingComplete}
              />
            )}

            {activeTest === 'payment' && testBookingId && (
              <PaymentComponent
                bookingId={testBookingId}
                amount={8500}
                yachtName={sampleYacht.name}
                onPaymentSuccess={(paymentId) => {
                  console.log('Payment successful:', paymentId)
                }}
                onPaymentError={(error) => {
                  console.error('Payment error:', error)
                }}
              />
            )}
          </div>
        </div>

        {/* Chatbot Component */}
        <Chatbot />
      </div>
    </div>
  )
}

