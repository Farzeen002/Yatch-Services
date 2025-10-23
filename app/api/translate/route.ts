import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, from } = await request.json();

    const key = process.env.AZURE_TRANSLATOR_KEY;
    const region = process.env.AZURE_TRANSLATOR_REGION;
    const endpoint = 'https://api.cognitive.microsofttranslator.com';

    if (!key || !region) {
      return NextResponse.json(
        { error: 'Azure credentials not configured' },
        { status: 500 }
      );
    }

    // Always translate to Arabic
    const url = `${endpoint}/translate?api-version=3.0&to=ar${from ? `&from=${from}` : ''}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }]),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Azure API error:', errorData);
      return NextResponse.json(
        { error: 'Translation failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      translatedText: data[0].translations[0].text,
      detectedLanguage: data[0].detectedLanguage?.language,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}