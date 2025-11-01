export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { prompt } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })
  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

  try {
    const imagePrompt = `Generate a detailed description for an image of: ${prompt}. Make it realistic and specific for fitness or food photography.`
    
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: imagePrompt }]
        }]
      })
    })
    
    if (!r.ok) {
      const txt = await r.text()
      return res.status(500).json({ error: 'Gemini API error', details: txt })
    }
    
    const data = await r.json()
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text || prompt
    
    const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)},fitness,food`
    
    return res.status(200).json({ url: unsplashUrl, description })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
