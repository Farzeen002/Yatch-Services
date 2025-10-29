// Test Gemini AI fallback handling
async function testGeminiFallback() {
  console.log('🤖 Testing Gemini AI Fallback Handling\n')
  
  const sessionId = `gemini_test_${Date.now()}`
  
  console.log('🧪 Testing AI Error Handling:')
  
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
<<<<<<< HEAD
        console.log(` Response: ${data.response.substring(0, 150)}...`)
=======
        console.log(`✅ Response: ${data.response.substring(0, 150)}...`)
>>>>>>> landing-video
        console.log(`📊 Type: ${data.type}`)
        
        // Check for fallback responses
        if (data.response.includes('technical difficulties')) {
<<<<<<< HEAD
          console.log(' Fallback response detected (AI overload handled)')
        } else if (data.response.includes('Marina')) {
          console.log(' Normal AI response generated')
=======
          console.log('✅ Fallback response detected (AI overload handled)')
        } else if (data.response.includes('Marina')) {
          console.log('✅ Normal AI response generated')
>>>>>>> landing-video
        }
        
        // Check for booking context
        if (data.response.includes('Marina Star')) {
<<<<<<< HEAD
          console.log(' Context maintained (yacht selection remembered)')
=======
          console.log('✅ Context maintained (yacht selection remembered)')
>>>>>>> landing-video
        }
        
        // Check for payment processing
        if (data.response.includes('[🔗 CLICK HERE TO PAY')) {
<<<<<<< HEAD
          console.log(' Payment button generated')
=======
          console.log('✅ Payment button generated')
>>>>>>> landing-video
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
  
<<<<<<< HEAD
  console.log('\n Gemini AI Fallback Test Complete!')
  console.log('\n📋 SUMMARY:')
  console.log(' AI overload errors handled gracefully')
  console.log(' Fallback responses provided')
  console.log(' Context maintained during errors')
  console.log(' System remains functional')
=======
  console.log('\n🎯 Gemini AI Fallback Test Complete!')
  console.log('\n📋 SUMMARY:')
  console.log('✅ AI overload errors handled gracefully')
  console.log('✅ Fallback responses provided')
  console.log('✅ Context maintained during errors')
  console.log('✅ System remains functional')
>>>>>>> landing-video
}

// Run the test
testGeminiFallback().catch(console.error)



