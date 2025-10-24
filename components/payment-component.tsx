"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface PaymentProps {
  bookingId: string
  amount: number
  currency?: string
  yachtName: string
  onPaymentSuccess?: (paymentId: string) => void
  onPaymentError?: (error: string) => void
}
 
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentComponent({
  bookingId,
  amount,
  currency = "INR",
  yachtName,
  onPaymentSuccess,
  onPaymentError,
}: PaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      setPaymentStatus('processing')

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount,
          currency,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || 'Failed to create payment order')
      }

      const orderData = await orderResponse.json()

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Yacht Charter Services',
        description: `Payment for ${yachtName} booking`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: bookingId,
              }),
            })

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json()
              throw new Error(errorData.error || 'Payment verification failed')
            }

            const verifyData = await verifyResponse.json()
            
            setPaymentStatus('success')
            toast.success('Payment successful! Your booking is confirmed.')
            onPaymentSuccess?.(verifyData.paymentId)
          } catch (error) {
            console.error('Payment verification error:', error)
            setPaymentStatus('error')
            toast.error('Payment verification failed. Please contact support.')
            onPaymentError?.(error instanceof Error ? error.message : 'Payment verification failed')
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '+919876543210',
        },
        notes: {
          booking_id: bookingId,
          yacht_name: yachtName,
        },
        theme: {
          color: '#1e40af',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
            setPaymentStatus('idle')
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('error')
      toast.error(error instanceof Error ? error.message : 'Payment failed')
      onPaymentError?.(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing payment...'
      case 'success':
        return 'Payment successful!'
      case 'error':
        return 'Payment failed'
      default:
        return 'Ready to pay'
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Payment Details
        </CardTitle>
        <CardDescription>
          Complete your yacht booking payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Yacht:</span>
            <span className="text-sm font-medium">{yachtName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-medium">
              {currency} {amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isLoading || paymentStatus === 'processing' || paymentStatus === 'success'}
          className="w-full"
        >
          {isLoading || paymentStatus === 'processing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Payment Complete
            </>
          ) : (
            'Pay Now'
          )}
        </Button>

        {paymentStatus === 'error' && (
          <Button
            variant="outline"
            onClick={() => {
              setPaymentStatus('idle')
              handlePayment()
            }}
            className="w-full"
          >
            Try Again
          </Button>
        )}

        <p className="text-xs text-gray-500 text-center">
          Secure payment powered by Razorpay
        </p>
      </CardContent>
    </Card>
  )
}

