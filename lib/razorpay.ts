// razorpay.config.ts
import Razorpay from "razorpay"

const razorpayEnabled = process.env.RAZORPAY_ENABLED === "true"

// Razorpay configuration (from .env)
export const razorpayConfig = {
  enabled: razorpayEnabled,
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  publicKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
}

// Razorpay instance for server-side operations
export const razorpay = razorpayEnabled
  ? new Razorpay({
      key_id: razorpayConfig.keyId,
      key_secret: razorpayConfig.keySecret,
    })
  : null

// Payment helpers
export const convertToPaise = (amount: number): number => {
  return Math.round(amount * 100)
}

export const convertFromPaise = (amount: number): number => {
  return amount / 100
}
