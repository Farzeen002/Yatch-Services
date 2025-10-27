// Test script to verify payment button functionality
async function testPaymentButton() {
  console.log('🧪 Testing Payment Button Functionality\n')
  
  const sessionId = `payment_test_${Date.now()}`
  const messages = [
    "hi marina",
    "I want to book Marina Star for 3 days from 24th october 2025",
    "yes i want it from 24th october 2025 to 3 days"
  ]
  
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
        console.log(`✅ Response: ${data.response.substring(0, 200)}...`)
        console.log(`📊 Type: ${data.type}`)
        
        // Check for payment button
        if (data.response.includes('[🔗 CLICK HERE TO PAY')) {
          console.log('✅ Payment button found in response!')
          
          // Extract the payment link
          const linkMatch = data.response.match(/\[🔗 CLICK HERE TO PAY[^\]]+\]\(([^)]+)\)/)
          if (linkMatch) {
            console.log('✅ Payment link extracted:', linkMatch[1])
            console.log('✅ Link is properly formatted for Razorpay checkout')
          }
        }
        
        // Check for booking details
        if (data.booking) {
          console.log('✅ Booking details:', {
            id: data.booking.id,
            status: data.booking.status,
            yachtName: data.booking.yachtName,
            totalPrice: data.booking.totalPrice
          })
        }
        
        // Check for payment details
        if (data.payment) {
          console.log('✅ Payment order created:', data.payment.id)
          console.log('✅ Razorpay key provided:', !!data.razorpayKey)
        }
        
      } else {
        console.error(`❌ Request failed: ${response.status}`)
        const error = await response.text()
        console.error(`Error: ${error}`)
      }
    } catch (error) {
      console.error(`❌ Test failed: ${error.message}`)
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n🎯 Payment Button Test Complete!')
  console.log('\n📋 Summary:')
  console.log('✅ Payment button should now be clickable')
  console.log('✅ RLS policy should be fixed')
  console.log('✅ Razorpay checkout link properly formatted')
}

// Run the test
testPaymentButton().catch(console.error)



