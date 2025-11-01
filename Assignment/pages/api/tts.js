export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { text } = req.body || {}
  if (!text) return res.status(400).json({ error: 'Missing text' })
  const key = process.env.MURF_API_KEY
  if (!key) return res.status(500).json({ error: 'MURF_API_KEY not configured' })

  try {
    const r = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': key
      },
      body: JSON.stringify({ 
        text,
        voiceId: 'en-US-ken',
        format: 'MP3',
        speed: 0,
        pitch: 0
      })
    })
    
    if (!r.ok) {
      const txt = await r.text()
      return res.status(500).json({ error: 'Murf AI error', details: txt })
    }
    
    const data = await r.json()
    
    if (data.audioFile) {
      const audioRes = await fetch(data.audioFile)
      const arrayBuffer = await audioRes.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      res.setHeader('Content-Type', 'audio/mpeg')
      res.send(buffer)
    } else if (data.audioContent) {
      const buffer = Buffer.from(data.audioContent, 'base64')
      res.setHeader('Content-Type', 'audio/mpeg')
      res.send(buffer)
    } else {
      res.status(500).json({ error: 'No audio returned from Murf AI' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
