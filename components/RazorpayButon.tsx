import { useState } from 'react'

interface RazorpayButtonProps {
  orderId: string
  amount: number
  currency: string
  razorpayKey: string
  bookingId: string
  yachtName: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  onSuccess?: (response: any) => void
  onFailure?: (error: any) => void
}

export default function RazorpayButton({
  orderId,
  amount,
  currency,
  razorpayKey,
  bookingId,
  yachtName,
  customerName = 'Guest',
  customerEmail = '',
  customerPhone = '',
  onSuccess,
  onFailure,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: 'Yacht Charter',
        description: `Booking for ${yachtName}`,
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#3b82f6',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments-bot/verify-payment-bot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: bookingId,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              if (onSuccess) onSuccess(verifyData)
              alert('Payment successful! Your booking is confirmed.')
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error: any) {
            console.error('Payment verification error:', error)
            if (onFailure) onFailure(error)
            alert('Payment verification failed. Please contact support.')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            alert('Payment cancelled')
          }
        },
      }

      const rzp = new (window as any).Razorpay(options)
      
      rzp.on('payment.failed', function (response: any) {
        setLoading(false)
        console.error('Payment failed:', response.error)
        if (onFailure) onFailure(response.error)
        alert(`Payment failed: ${response.error.description}`)
      })

      rzp.open()
    }

    script.onerror = () => {
      setLoading(false)
      alert('Failed to load payment gateway. Please try again.')
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Processing...' : `Pay ${currency} ${(amount / 100).toFixed(2)}`}
    </button>
  )
}