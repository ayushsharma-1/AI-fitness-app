export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { prompt } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  try {
    const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)},fitness,food,healthy`
    
    return res.status(200).json({ url: unsplashUrl })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
