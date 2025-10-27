"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'yacht_list' | 'yacht_details' | 'booking_confirmation' | 'support'
  data?: any
}

interface WhosYEPAIChatbotProps {
  className?: string
}

export default function WhosYEPAIChatbot({ className = "" }: WhosYEPAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  
  // Voice features
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: "Hi! I'm WhosYEP AI, your luxury yacht booking concierge. How can I assist you today?",
        timestamp: new Date(),
        type: 'text'
      })
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  /**
   * Send text message to WhosYEP AI
   */
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }
    
    addMessage(userMessage)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/whosyep-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        type: data.type,
        data: data.data
      }

      addMessage(assistantMessage)

      // If voice is enabled, speak the response
      if (voiceEnabled && !isSpeaking) {
        await speakText(data.response)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Start voice recording (Whisper STT)
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      })
    }
  }

  /**
   * Stop voice recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  /**
   * Transcribe audio using Whisper
   */
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/whosyep-ai/voice', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle quota exceeded gracefully
        if (response.status === 503 && data.fallback) {
          toast({
            title: "Voice Unavailable",
            description: data.message || "Please use text input instead.",
            variant: "destructive"
          })
          return
        }
        throw new Error(data.error || 'Transcription failed')
      }

      // Send transcribed text as message
      await sendMessage(data.text)
    } catch (error) {
      console.error('Error transcribing audio:', error)
      toast({
        title: "Transcription Error",
        description: "Could not transcribe audio. Please use text input.",
        variant: "destructive"
      })
    }
  }

  /**
   * Speak text using OpenAI TTS
   */
  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true)

      const response = await fetch('/api/whosyep-ai/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'nova' })
      })

      if (!response.ok) {
        // Handle quota exceeded - fail silently for TTS
        if (response.status === 503) {
          const data = await response.json()
          if (data.fallback) {
            console.warn('TTS unavailable:', data.message)
            setIsSpeaking(false)
            // Automatically disable voice when quota exceeded
            setVoiceEnabled(false)
            return
          }
        }
        throw new Error('TTS failed')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        await audioRef.current.play()
      }
    } catch (error) {
      console.error('Error speaking text:', error)
      setIsSpeaking(false)
      setVoiceEnabled(false) // Disable voice on error
    }
  }

  /**
   * Stop speaking
   */
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsSpeaking(false)
    }
  }

  /**
   * Clear chat history
   */
  const clearChat = async () => {
    if (!confirm("Are you sure you want to clear the chat history?")) return

    try {
      await fetch('/api/whosyep-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '',
          sessionId,
          action: 'clear'
        })
      })

      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: "Chat history cleared! How can I help you today?",
        timestamp: new Date(),
        type: 'text'
      }])
    } catch (error) {
      console.error('Error clearing chat:', error)
    }
  }

  /**
   * Render message content with formatting
   */
  const renderMessageContent = (message: Message) => {
    const content = message.content

    // Parse markdown bold
    const parts = content.split(/\*\*([^*]+)\*\*/g)
    const elements = parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold">{part}</strong>
      }
      return <span key={index}>{part}</span>
    })

    // Render yacht list with selection
    if (message.type === 'yacht_list' && message.data?.yachts && message.data.yachts.length > 0) {
      return (
        <div>
          <div className="mb-3">{elements}</div>
          {message.data.notFound && message.data.searchedName && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              "{message.data.searchedName}" not found. Here are alternatives:
            </div>
          )}
          <div className="space-y-2 mt-3">
            {message.data.yachts.slice(0, 5).map((yacht: any) => (
              <div
                key={yacht.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => {
                  setInput(`Book ${yacht.name}`)
                  sendMessage(`Book ${yacht.name}`)
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{yacht.name}</p>
                    <p className="text-xs text-gray-600">{yacht.location}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {yacht.guests} guests • {yacht.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">${yacht.price}</p>
                    <p className="text-xs text-gray-500">per day</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-blue-600 hover:underline">
                    Click to book →
                  </p>
                </div>
              </div>
            ))}
          </div>
          {message.data.yachts.length > 5 && (
            <p className="text-xs text-gray-500 mt-2">
              Showing 5 of {message.data.yachts.length} yachts
            </p>
          )}
        </div>
      )
    }

    // Render yacht details if available
    if (message.type === 'yacht_details' && message.data?.dynamicLink) {
      return (
        <div>
          <div className="mb-3">{elements}</div>
          {message.data.yacht && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
              <p className="font-semibold text-sm text-gray-900">{message.data.yacht.name}</p>
              <p className="text-xs text-gray-600 mt-1">{message.data.yacht.location}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-600">{message.data.yacht.guests} guests</span>
                <span className="text-sm font-bold text-blue-600">${message.data.yacht.price}/day</span>
              </div>
            </div>
          )}
          <a
            href={message.data.dynamicLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Full Details →
          </a>
        </div>
      )
    }

    // Render booking confirmation
    if (message.type === 'booking_confirmation' && message.data?.bookingDetails) {
      const booking = message.data.bookingDetails
      const yacht = message.data.yacht
      return (
        <div>
          <div className="mb-3">{elements}</div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
            <p className="font-bold text-green-800 mb-2">Booking Summary:</p>
            <p className="text-gray-800">Yacht: <strong>{booking.yachtName}</strong></p>
            <p className="text-gray-800">Guests: <strong>{booking.guestCount}</strong></p>
            <p className="text-gray-800">Duration: <strong>{booking.duration} days</strong></p>
            {booking.totalPrice && (
              <p className="text-gray-800 mt-2 pt-2 border-t border-green-300">
                Total: <strong className="text-green-700">${booking.totalPrice}</strong>
              </p>
            )}
          </div>
          {yacht && (
            <a
              href={`http://localhost:3000/yachts/${yacht.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium mt-3"
            >
              Proceed to Booking →
            </a>
          )}
        </div>
      )
    }

    return <div>{elements}</div>
  }

  return (
    <>
      {/* Hidden audio element for TTS */}
      <audio ref={audioRef} className="hidden" />

      {/* Floating chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden ${className}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">WhosYEP AI</h3>
                <p className="text-xs text-blue-100">Luxury Yacht Concierge</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={voiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {renderMessageContent(message)}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(input)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading || isRecording}
                />
                
                {/* Voice button */}
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                {/* Send button */}
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim() || isRecording}
                  className="bg-gradient-to-r from-blue-600 to-blue-800"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {isRecording && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  Recording... Click to stop
                </p>
              )}

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="text-xs text-blue-600 mt-2 flex items-center gap-1 hover:underline"
                >
                  <VolumeX className="w-3 h-3" />
                  Stop speaking
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


