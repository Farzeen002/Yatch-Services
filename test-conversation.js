// Test script to verify conversation context understanding
const testMessages = [
  "hi",
  "anything special today to book?",
  "Ocean Dream book for 3 ppl",
  "yes check",
  "23/10/2025"
]

async function testConversation() {
  const sessionId = `test_${Date.now()}`
  
  for (const message of testMessages) {
    console.log(`\n--- Testing: "${message}" ---`)
    
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId })
      })
      
      const data = await response.json()
      console.log('Response:', data.response)
      console.log('Type:', data.type)
      
    } catch (error) {
      console.error('Error:', error.message)
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

// Run the test
testConversation().catch(console.error)


