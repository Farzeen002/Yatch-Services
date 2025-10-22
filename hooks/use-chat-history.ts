"use client"

import { useState, useEffect } from "react"

export interface ChatMessage {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "automated" | "ai"
}

const STORAGE_KEY = "marina_chat_history"

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDates)
      } catch (error) {
        console.error("Failed to load chat history:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages, isLoaded])

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const getSessionMessages = () => {
    return messages
  }

  return {
    messages,
    addMessage,
    clearHistory,
    getSessionMessages,
    isLoaded,
  }
}
