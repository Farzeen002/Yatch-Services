'use client';

import { useState } from 'react';

export default function TestTranslate() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Translation failed');
        return;
      }

      setTranslatedText(data.translatedText);
    } catch (err) {
      setError('Error connecting to translation service');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Translate to Arabic</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Text to translate:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text in any language"
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading || !text}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Translating...' : 'Translate to Arabic'}
        </button>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {translatedText && (
          <div className="p-4 bg-green-50 border border-green-200 rounded" dir="rtl">
            <strong>Arabic Translation:</strong>
            <p className="mt-2 text-lg">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}