import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    const key = process.env.AZURE_TRANSLATOR_KEY
    const region = process.env.AZURE_TRANSLATOR_REGION
    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT

    if (!key || !region || !endpoint) {
      console.error('Azure Translator credentials not configured')
      return NextResponse.json(
        { error: 'Translation service not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${endpoint}/translate?api-version=3.0&to=${targetLanguage}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text }]),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Azure Translator error:', error)
      return NextResponse.json(
        { error: 'Translation failed', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    const translatedText = data[0]?.translations[0]?.text

    return NextResponse.json({ 
      translatedText,
      detectedLanguage: data[0]?.detectedLanguage?.language 
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check translation service status
export async function GET() {
  const configured = !!(
    process.env.AZURE_TRANSLATOR_KEY &&
    process.env.AZURE_TRANSLATOR_REGION &&
    process.env.AZURE_TRANSLATOR_ENDPOINT
  )

  return NextResponse.json({
    status: configured ? 'configured' : 'not_configured',
    service: 'Azure Translator',
    supportedLanguages: ['en', 'ar']
  })
}

