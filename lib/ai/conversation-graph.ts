/**
 * WhosYEP AI - LangGraph Conversation Flow
 * Orchestrates the conversation using StateGraph
 */

import { StateGraph, END } from '@langchain/langgraph'
import {
  ConversationState,
  GraphInput,
  GraphOutput,
  createInitialState,
  addMessage
} from './conversation-state'
import {
  detectIntentNode,
  searchYachtNode,
  extractBookingDetailsNode,
  generateResponseNode
} from './graph-nodes'

// In-memory state storage (replace with Redis/DB in production)
const stateStore = new Map<string, ConversationState>()

/**
 * Main conversation graph builder
 */
export function createConversationGraph(baseUrl: string) {
  // Define the graph
  const workflow = new StateGraph<ConversationState>({
    channels: {
      messages: {
        value: (prev: any, next: any) => [...prev, ...next],
        default: () => []
      },
      context: {
        value: (prev: any, next: any) => ({ ...prev, ...next }),
        default: () => ({})
      },
      sessionId: {
        value: (prev: string, next: string) => next,
        default: () => ''
      },
      userId: {
        value: (prev: string | undefined, next: string | undefined) => next,
        default: () => undefined
      },
      createdAt: {
        value: (prev: number, next: number) => next,
        default: () => Date.now()
      },
      lastUpdatedAt: {
        value: (prev: number, next: number) => next,
        default: () => Date.now()
      }
    }
  })

  // Add nodes
  workflow.addNode('detect_intent', detectIntentNode)
  workflow.addNode('search_yacht', (state: ConversationState) =>
    searchYachtNode(state, baseUrl)
  )
  workflow.addNode('extract_booking', extractBookingDetailsNode)
  workflow.addNode('generate_response', generateResponseNode)

  // Set entry point
  workflow.setEntryPoint('detect_intent')

  // Define edges
  workflow.addEdge('detect_intent', 'search_yacht')
  workflow.addEdge('search_yacht', 'extract_booking')
  workflow.addEdge('extract_booking', 'generate_response')
  workflow.addEdge('generate_response', END)

  return workflow.compile()
}

/**
 * Process a user message through the conversation graph
 */
export async function processMessage(
  input: GraphInput,
  baseUrl: string = 'http://localhost:3000'
): Promise<GraphOutput> {
  try {
    // Get or create state
    let state = stateStore.get(input.sessionId)
    
    if (!state) {
      state = createInitialState(input.sessionId, input.userId)
      stateStore.set(input.sessionId, state)
    }
    
    // Add user message to state
    state = addMessage(state, 'user', input.message)
    
    // Create and run the graph
    const graph = createConversationGraph(baseUrl)
    
    // Execute the graph
    const result = await graph.invoke(state)
    
    // Extract the output from the last node
    const finalState = result as ConversationState
    
    // Generate the final response
    const responseNode = await generateResponseNode(finalState)
    
    // Update stored state
    stateStore.set(input.sessionId, responseNode.state)
    
    return responseNode.output
  } catch (error) {
    console.error('Error processing message:', error)
    
    return {
      response: "I apologize, but I encountered an error. Please try again or contact support.",
      type: 'text',
      nextAction: 'await_input'
    }
  }
}

/**
 * Get conversation state for a session
 */
export function getSessionState(sessionId: string): ConversationState | undefined {
  return stateStore.get(sessionId)
}

/**
 * Clear conversation state (start fresh)
 */
export function clearSessionState(sessionId: string): void {
  stateStore.delete(sessionId)
}

/**
 * Get all active sessions (for monitoring)
 */
export function getActiveSessions(): string[] {
  return Array.from(stateStore.keys())
}


