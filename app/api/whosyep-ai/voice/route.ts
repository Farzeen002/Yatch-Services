/**
 * WhosYEP AI - Voice Interaction Endpoint
 * Handles Whisper STT and OpenAI TTS
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({ apiKey })
}

/**
 * POST /api/whosyep-ai/voice
 * Handles both speech-to-text (Whisper) and text-to-speech (TTS)
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    // Handle Speech-to-Text (Whisper)
    if (contentType.includes('multipart/form-data')) {
      return await handleSpeechToText(request)
    }
    
    // Handle Text-to-Speech (TTS)
    if (contentType.includes('application/json')) {
      return await handleTextToSpeech(request)
    }
    
    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Voice API Error:', error)
    return NextResponse.json(
      {
        error: 'Voice processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Convert speech to text using Whisper
 */
async function handleSpeechToText(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }
    
    const openai = getOpenAIClient()
    
    // Convert File to Buffer for OpenAI API
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Create a File-like object for OpenAI
    const file = new File([buffer], audioFile.name, { type: audioFile.type })
    
    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en', // Can be made dynamic
      response_format: 'json'
    })
    
    return NextResponse.json({
      text: transcription.text,
      duration: audioFile.size / 16000 // Approximate duration
    })
  } catch (error: any) {
    console.error('Speech-to-Text Error:', error)
    
    // Handle quota exceeded gracefully
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          error: 'Voice transcription unavailable',
          message: 'OpenAI API quota exceeded. Please use text input.',
          fallback: true
        },
        { status: 503 }
      )
    }
    
    throw error
  }
}

/**
 * Convert text to speech using OpenAI TTS
 */
async function handleTextToSpeech(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, voice = 'alloy' } = body
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }
    
    const openai = getOpenAIClient()
    
    // Generate speech using TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice, // alloy, echo, fable, onyx, nova, shimmer
      input: text,
      speed: 1.0
    })
    
    // Convert response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())
    
    // Return audio file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': 'inline; filename="response.mp3"'
      }
    })
  } catch (error: any) {
    console.error('Text-to-Speech Error:', error)
    
    // Handle quota exceeded gracefully
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          error: 'Voice output unavailable',
          message: 'OpenAI API quota exceeded. Voice is disabled.',
          fallback: true
        },
        { status: 503 }
      )
    }
    
    throw error
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'WhosYEP AI Voice',
    capabilities: {
      stt: 'Whisper (speech-to-text)',
      tts: 'OpenAI TTS (text-to-speech)'
    },
    voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
  })
}


