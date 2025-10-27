// Razorpay configuration
export const razorpayConfig = {
  enabled: true, // Enable Razorpay
  keyId: 'rzp_test_RW6A4PqTDTOfaI',
  keySecret: 'k6CJGD4jnACepn4Ic7dwUtWB',
  publicKeyId: 'rzp_test_RW6A4PqTDTOfaI'
}

// Razorpay instance for server-side operations
import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: razorpayConfig.keyId,
  key_secret: razorpayConfig.keySecret,
})

// Payment amount should be in paise (smallest currency unit)
export const convertToPaise = (amount: number): number => {
  return Math.round(amount * 100)
}

// Convert paise back to rupees
export const convertFromPaise = (amount: number): number => {
  return amount / 100
}
