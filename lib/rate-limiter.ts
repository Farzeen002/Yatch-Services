// Simple in-memory rate limiter for production use
// In production, use Redis for distributed rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier)
    if (!entry) return 0
    return entry.resetTime
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key)
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter(10, 60000) // 10 requests per minute

// Clean up expired entries every 5 minutes
setInterval(() => {
  rateLimiter.cleanup()
}, 5 * 60 * 1000)

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const allowed = rateLimiter.isAllowed(identifier)
  const remaining = rateLimiter.getRemainingRequests(identifier)
  const resetTime = rateLimiter.getResetTime(identifier)

  return { allowed, remaining, resetTime }
}



