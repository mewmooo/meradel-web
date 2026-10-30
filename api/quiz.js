export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY server environment variable is not configured.' });
    }

    const { currentUserName, partnerName, memories } = req.body || {};

    if (!Array.isArray(memories) || memories.length === 0) {
      return res.status(400).json({ error: 'Memories array is required.' });
    }

    // Sanitasi dan format memori (batasi panjang untuk mencegah prompt injection / token overflow)
    const sanitizedMemories = memories.slice(0, 5).map((m, idx) => {
      const title = String(m.title || '').replace(/[\r\n]+/g, ' ').slice(0, 100);
      const caption = String(m.caption || '').replace(/[\r\n]+/g, ' ').slice(0, 150);
      return `${idx + 1}. Judul: "${title}" ${caption ? `(Catatan: "${caption}")` : ''}`;
    }).join('\n');

    const safeCurrent = String(currentUserName || 'Pasangan A').replace(/[^a-zA-Z0-9_\s]/g, '').slice(0, 50);
    const safePartner = String(partnerName || 'Pasangan B').replace(/[^a-zA-Z0-9_\s]/g, '').slice(0, 50);

    const systemPrompt =
      'Kamu adalah asisten pembuat kuis pasangan romantis untuk aplikasi Meradel. Buat 3 pertanyaan refleksi/kuis pasangan yang hangat, santai, dan personal dalam Bahasa Indonesia berdasarkan daftar kenangan (Memories) pasangan yang diberikan.';
    
    const userQuery = `Pasangan ini adalah ${safeCurrent} dan ${safePartner}. Berikut daftar kenangan bersama mereka:\n${sanitizedMemories}\n\nBuatlah 3 pertanyaan Couple Quiz yang secara spesifik menyebut atau menggali perasaan dari momen-momen di atas.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              category: { type: 'STRING' },
              text: { type: 'STRING' },
              memoryReference: { type: 'STRING' },
            },
            propertyOrdering: ['category', 'text', 'memoryReference'],
          },
        },
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Gemini upstream error', details: errText });
    }

    const result = await response.json();
    const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      return res.status(500).json({ error: 'Invalid response from Gemini AI' });
    }

    const parsed = JSON.parse(rawJson);
    return res.status(200).json({ questions: parsed });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

