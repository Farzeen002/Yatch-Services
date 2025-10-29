// Comprehensive test for production-ready yacht chatbot system
async function testProductionSystem() {
  console.log('🚢 Testing Production-Ready Yacht Chatbot System\n')
  
  const testCases = [
    {
      name: "1. Unauthenticated User - Yacht Query",
      message: "What yachts do you have available?",
      expectedAuth: false,
      expectedResponse: "yacht"
    },
    {
      name: "2. Unauthenticated User - Booking Request",
      message: "I want to book Ocean Dream for 3 days",
      expectedAuth: false,
      expectedResponse: "sign in"
    },
    {
      name: "3. Non-Yacht Query",
      message: "What's the weather like today?",
      expectedAuth: false,
      expectedResponse: "yacht-related services"
    },
    {
      name: "4. Clear Chat Command",
      message: "clear chat",
      expectedAuth: false,
      expectedResponse: "cleared"
    },
    {
      name: "5. Rate Limiting Test",
      message: "test rate limit",
      expectedAuth: false,
      expectedResponse: "rate limit"
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n--- ${testCase.name} ---`)
    
    try {
      const response = await fetch('http://localhost:3000/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: testCase.message, 
          sessionId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(` Response: ${data.response.substring(0, 100)}...`)
        console.log(`📊 Type: ${data.type}`)
        
        if (data.booking) {
          console.log(`📋 Booking: ${JSON.stringify(data.booking)}`)
        }
        
        if (data.payment) {
          console.log(`💳 Payment: ${data.payment.id}`)
        }
        
        // Check if response contains expected content
        if (data.response.toLowerCase().includes(testCase.expectedResponse.toLowerCase())) {
          console.log(` Expected content found: "${testCase.expectedResponse}"`)
        } else {
          console.log(`❌ Expected content not found: "${testCase.expectedResponse}"`)
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
  
  console.log('\n🎉 Production System Test Complete!')
}

// Test rate limiting specifically
async function testRateLimiting() {
  console.log('\n🔄 Testing Rate Limiting...')
  
  const requests = []
  for (let i = 0; i < 15; i++) {
    requests.push(
      fetch('http://localhost:3000/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Rate limit test ${i}`, 
          sessionId: `rate_test_${Date.now()}` 
        })
      })
    )
  }
  
  const responses = await Promise.all(requests)
  const rateLimited = responses.filter(r => r.status === 429)
  
  console.log(`📊 Total requests: ${responses.length}`)
  console.log(`🚫 Rate limited: ${rateLimited.length}`)
  console.log(` Success rate: ${((responses.length - rateLimited.length) / responses.length * 100).toFixed(1)}%`)
}

// Run all tests
async function runAllTests() {
  await testProductionSystem()
  await testRateLimiting()
}

runAllTests().catch(console.error)



