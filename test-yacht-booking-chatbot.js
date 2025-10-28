/**
 * Test Script for Yacht Booking Chatbot
 * Run: node test-yacht-booking-chatbot.js
 */

const readline = require('readline');

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Test scenarios
const testScenarios = [
  {
    name: 'List All Yachts',
    messages: ['Show me all available yachts']
  },
  {
    name: 'Book Yacht by Name (Exists)',
    messages: [
      'I want to book a yacht',
      // Will need to use actual yacht name from database
      '5 guests',
      '3 days'
    ]
  },
  {
    name: 'Book Yacht by Name (Does Not Exist)',
    messages: ['Book the Titanic II yacht']
  },
  {
    name: 'General Inquiry',
    messages: ['What yachts do you have?']
  }
];

async function testChatbot(message, sessionId) {
  try {
    const response = await fetch(`${BASE_URL}/api/whosyep-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
    return null;
  }
}

async function testYachtsAPI() {
  try {
    console.log(`\n${colors.cyan}Testing Yachts API...${colors.reset}`);
    const response = await fetch(`${BASE_URL}/api/yachts`);
    const data = await response.json();
    
    if (data.yachts && data.yachts.length > 0) {
      console.log(`${colors.green}✓ Yachts API working${colors.reset}`);
      console.log(`  Found ${data.yachts.length} yachts:`);
      data.yachts.slice(0, 3).forEach(yacht => {
        console.log(`    - ${yacht.name} (${yacht.location})`);
      });
      return data.yachts;
    } else {
      console.log(`${colors.yellow}⚠ No yachts found in database${colors.reset}`);
      return [];
    }
  } catch (error) {
    console.log(`${colors.red}✗ Yachts API failed:${colors.reset}`, error.message);
    return [];
  }
}

async function testVoiceAPI() {
  try {
    console.log(`\n${colors.cyan}Testing Voice API...${colors.reset}`);
    const response = await fetch(`${BASE_URL}/api/whosyep-ai/voice`);
    const data = await response.json();
    
    if (data.status === 'online') {
      console.log(`${colors.green}✓ Voice API working${colors.reset}`);
      console.log(`  Capabilities: ${data.capabilities.stt}, ${data.capabilities.tts}`);
      console.log(`  Available voices: ${data.voices.join(', ')}`);
      return true;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Voice API failed:${colors.reset}`, error.message);
    return false;
  }
}

async function testConversation(scenario, yachts) {
  console.log(`\n${colors.bright}${colors.blue}Testing: ${scenario.name}${colors.reset}`);
  console.log('─'.repeat(60));
  
  const sessionId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  for (let i = 0; i < scenario.messages.length; i++) {
    let message = scenario.messages[i];
    
    // If message is about booking and we have yachts, use first yacht name
    if (message.includes('book a yacht') && yachts.length > 0) {
      message = `Book ${yachts[0].name}`;
    }
    
    console.log(`\n${colors.yellow}User:${colors.reset} ${message}`);
    
    const response = await testChatbot(message, sessionId);
    
    if (response) {
      console.log(`${colors.green}AI:${colors.reset} ${response.response}`);
      console.log(`${colors.cyan}Type:${colors.reset} ${response.type}`);
      
      if (response.data) {
        if (response.data.yachts) {
          console.log(`${colors.cyan}Yachts returned:${colors.reset} ${response.data.yachts.length}`);
        }
        if (response.data.yacht) {
          console.log(`${colors.cyan}Selected yacht:${colors.reset} ${response.data.yacht.name}`);
          console.log(`${colors.cyan}Dynamic link:${colors.reset} ${response.data.dynamicLink}`);
        }
        if (response.data.bookingDetails) {
          console.log(`${colors.cyan}Booking:${colors.reset}`, response.data.bookingDetails);
        }
      }
    }
    
    // Wait a bit between messages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('─'.repeat(60));
}

async function interactiveMode(yachts) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const sessionId = `interactive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`\n${colors.bright}${colors.green}Interactive Mode${colors.reset}`);
  console.log('Type your message or "exit" to quit');
  console.log('─'.repeat(60));
  
  const askQuestion = () => {
    rl.question(`\n${colors.yellow}You:${colors.reset} `, async (message) => {
      if (message.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }
      
      const response = await testChatbot(message, sessionId);
      
      if (response) {
        console.log(`${colors.green}AI:${colors.reset} ${response.response}`);
        
        if (response.data?.dynamicLink) {
          console.log(`${colors.cyan}Link:${colors.reset} ${response.data.dynamicLink}`);
        }
      }
      
      askQuestion();
    });
  };
  
  askQuestion();
}

async function runTests() {
  console.log(`${colors.bright}${colors.blue}
╔═══════════════════════════════════════════════════════════╗
║     WhosYEP AI - Yacht Booking Chatbot Test Suite       ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);
  
  // Test APIs first
  const yachts = await testYachtsAPI();
  await testVoiceAPI();
  
  if (yachts.length === 0) {
    console.log(`\n${colors.yellow}Warning: No yachts in database. Some tests may fail.${colors.reset}`);
  }
  
  // Test scenarios
  for (const scenario of testScenarios) {
    await testConversation(scenario, yachts);
  }
  
  // Ask if user wants interactive mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question(`\n${colors.cyan}Start interactive mode? (y/n):${colors.reset} `, (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y') {
      interactiveMode(yachts);
    } else {
      console.log('\n✓ Tests completed!');
      process.exit(0);
    }
  });
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/whosyep-ai`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Server not running at ${BASE_URL}${colors.reset}`);
    console.log(`${colors.yellow}Please start the server with: npm run dev${colors.reset}`);
    process.exit(1);
  }
}

// Run tests
checkServer().then(() => {
  runTests();
}).catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});

