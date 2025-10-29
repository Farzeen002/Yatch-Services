// Test script to verify payment link generation
async function testPaymentGeneration() {
  console.log('Testing payment generation...')
  
  try {
    const response = await fetch('http://localhost:3000/api/payments-bot/create-razorpay-order-bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        yachtName: 'Ocean Dream',
        duration: 3,
        totalPrice: 25500,
        guestCount: 2,
        startDate: '24/10/2025'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log(' Payment generation successful!')
      console.log('Order ID:', data.order.id)
      console.log('Amount:', data.paymentDetails.totalPriceSAR, 'SAR')
      console.log('Razorpay Key:', data.razorpayKey)
      return true
    } else {
      console.error('❌ Payment generation failed:', response.status)
      const error = await response.text()
      console.error('Error details:', error)
      return false
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

// Run the test
testPaymentGeneration().then(success => {
  if (success) {
    console.log('\n🎉 Payment link generation is working!')
  } else {
    console.log('\n💥 Payment link generation failed!')
  }
})



