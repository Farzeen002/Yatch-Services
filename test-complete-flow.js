// Test script to verify the complete booking flow with context
async function testCompleteFlow() {
  const sessionId = `complete_test_${Date.now()}`
  const messages = [
    "please book ocean dream yacht for 3 days starting from 24/10/2025",
    "i have logged in already"
  ]
  
  console.log('Testing complete booking flow with context...')
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    console.log(`\n--- Step ${i + 1}: "${message}" ---`)
    
    try {
      const response = await fetch('http://localhost:3000/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId })
      })
      
      if (response.ok) {
        const data = await response.json()
<<<<<<< HEAD
        console.log(' Response:', data.response.substring(0, 200) + '...')
=======
        console.log('✅ Response:', data.response.substring(0, 200) + '...')
>>>>>>> landing-video
        
        if (data.booking) {
          console.log('📋 Booking details:', data.booking)
        }
        
        if (data.payment) {
          console.log('💳 Payment order:', data.payment.id)
        }
        
        if (data.razorpayKey) {
          console.log('🔑 Razorpay key:', data.razorpayKey)
        }
        
      } else {
        console.error('❌ Request failed:', response.status)
        const error = await response.text()
        console.error('Error details:', error)
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message)
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

// Run the test
testCompleteFlow().catch(console.error)



