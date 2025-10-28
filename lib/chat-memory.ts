import { createServerClient } from '@supabase/ssr'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  messageId: string
}

export interface ChatSession {
  sessionId: string
  userId: string
  messages: ChatMessage[]
  context: {
    selectedYacht?: string
    guestCount?: number
    bookingIntent?: boolean
    isAuthenticated?: boolean
    bookingDetails?: any
  }
  createdAt: number
  updatedAt: number
}

export class ChatMemoryManager {
  private supabase: any

  constructor(supabaseClient?: any) {
    if (supabaseClient) {
      this.supabase = supabaseClient
    } else {
      this.supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return [] },
            setAll() { /* no-op for API routes */ },
          },
        }
      )
    }
  }

  async getChatSession(sessionId: string, userId: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await this.supabase
        .from('chat_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .single()

      if (error) {
        console.log('No existing session found:', error.message)
        return null
      }

      return {
        sessionId: data.session_id,
        userId: data.user_id,
        messages: data.messages || [],
        context: data.context || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      console.error('Error fetching chat session:', error)
      return null
    }
  }

  async saveChatSession(session: ChatSession): Promise<boolean> {
    try {
      // TTL: Set expiry to 24 hours (86400 seconds)
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours in milliseconds
      
      const { error } = await this.supabase
        .from('chat_sessions')
        .upsert({
          session_id: session.sessionId,
          user_id: session.userId,
          messages: session.messages,
          context: session.context,
          created_at: session.createdAt,
          updated_at: Date.now(),
          expires_at: expiresAt
        })

      if (error) {
        console.error('Error saving chat session:', error)
        return false
      }

      console.log(`Chat session saved with 24h TTL`)
      return true
    } catch (error) {
      console.error('Error saving chat session:', error)
      return false
    }
  }

  async addMessage(sessionId: string, userId: string, message: ChatMessage): Promise<boolean> {
    try {
      const session = await this.getChatSession(sessionId, userId)
      
      if (!session) {
        // Create new session
        const newSession: ChatSession = {
          sessionId,
          userId,
          messages: [message],
          context: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        return await this.saveChatSession(newSession)
      }

      // SLIDING WINDOW: Add message and trim to last 10 messages
      const MAX_CONTEXT_MESSAGES = 10
      session.messages.push(message)
      
      // Keep only the last 10 messages to prevent Gemini token overflow
      if (session.messages.length > MAX_CONTEXT_MESSAGES) {
        session.messages = session.messages.slice(-MAX_CONTEXT_MESSAGES)
        console.log(`Trimmed chat history to last ${MAX_CONTEXT_MESSAGES} messages`)
      }
      
      session.updatedAt = Date.now()
      
      return await this.saveChatSession(session)
    } catch (error) {
      console.error('Error adding message:', error)
      return false
    }
  }

  async clearChatHistory(sessionId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('chat_sessions')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error clearing chat history:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error clearing chat history:', error)
      return false
    }
  }

  async updateContext(sessionId: string, userId: string, context: any): Promise<boolean> {
    try {
      const session = await this.getChatSession(sessionId, userId)
      
      if (!session) {
        return false
      }

      session.context = { ...session.context, ...context }
      session.updatedAt = Date.now()
      
      return await this.saveChatSession(session)
    } catch (error) {
      console.error('Error updating context:', error)
      return false
    }
  }
}
