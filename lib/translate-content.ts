/**
 * Utility for translating dynamic content from database using Azure Translator
 */

// Cache to avoid re-translating the same content
const translationCache = new Map<string, string>()

export async function translateText(text: string, targetLanguage: 'en' | 'ar'): Promise<string> {
  // If target is English or text is empty, return as is
  if (targetLanguage === 'en' || !text || text.trim() === '') {
    return text
  }

  // Check cache first
  const cacheKey = `${text}_${targetLanguage}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    })

    if (!response.ok) {
      console.error('Translation API error:', response.statusText)
      return text // Return original text on error
    }

    const data = await response.json()
    const translatedText = data.translatedText || text

    // Cache the translation
    translationCache.set(cacheKey, translatedText)

    return translatedText
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text on error
  }
}

/**
 * Translate an array of items with a specific field
 */
export async function translateItems<T>(
  items: T[],
  fields: (keyof T)[],
  targetLanguage: 'en' | 'ar'
): Promise<T[]> {
  if (targetLanguage === 'en') {
    return items
  }

  const translatedItems = await Promise.all(
    items.map(async (item) => {
      const translatedItem = { ...item }
      
      for (const field of fields) {
        const value = item[field]
        if (typeof value === 'string') {
          // @ts-ignore - dynamic field access
          translatedItem[field] = await translateText(value, targetLanguage)
        }
      }
      
      return translatedItem
    })
  )

  return translatedItems
}

/**
 * Clear translation cache (useful when language changes)
 */
export function clearTranslationCache() {
  translationCache.clear()
}

