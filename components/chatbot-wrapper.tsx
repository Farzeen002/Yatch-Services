"use client"

import { useEffect, useState } from "react"
import WhosYEPAIChatbot from "./whosyep-ai-chatbot"

interface ChatbotWrapperProps {
  autoOpen?: boolean
}

export default function ChatbotWrapper({ autoOpen = false }: ChatbotWrapperProps) {
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false)

  useEffect(() => {
    if (autoOpen) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShouldAutoOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [autoOpen])

  return <WhosYEPAIChatbot autoOpen={shouldAutoOpen} />
}

