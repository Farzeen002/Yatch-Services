// Test script to verify authentication detection
async function testAuthDetection() {
  console.log('Testing authentication detection...')
  
  try {
    const response = await fetch('http://localhost:3000/api/chat-bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: "i have logged in already", 
        sessionId: "test_auth_session" 
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log(' Response received')
      console.log('Response:', data.response)
      console.log('Type:', data.type)
      
      if (data.booking) {
        console.log('📋 Booking details found:', data.booking)
      }
      
      if (data.payment) {
        console.log('💳 Payment details found:', data.payment)
      }
      
    } else {
      console.error('❌ Request failed:', response.status)
      const error = await response.text()
      console.error('Error details:', error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testAuthDetection()



