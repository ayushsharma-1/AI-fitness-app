export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const body = req.body || {}
  
  const groqKey = process.env.GROQ_API_KEY
  
  if (!groqKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured in .env.local' })
  }

  const prompt = `You are a professional fitness coach. Generate a personalized fitness plan.

User Details:
- Name: ${body.name || 'User'}
- Age: ${body.age || 'Not specified'}
- Gender: ${body.gender || 'Not specified'}
- Height: ${body.height || 'Not specified'} cm
- Weight: ${body.weight || 'Not specified'} kg
- Fitness Goal: ${body.goal || 'General Fitness'}
- Fitness Level: ${body.level || 'Beginner'}
- Workout Location: ${body.location || 'Home'}
- Diet Preference: ${body.diet || 'Balanced'}
${body.medical ? `- Medical Notes: ${body.medical}` : ''}

Generate a detailed response with:
1. A 7-day workout plan with specific exercises, sets, reps, and rest times
2. A complete diet plan with meals for breakfast, lunch, dinner, and snacks
3. Helpful tips for achieving their fitness goals
4. A motivational quote

Format your response clearly with sections for Workout Plan, Diet Plan, Tips, and Motivation.`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a professional fitness coach.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    })
    
    if (!r.ok) {
      const errorText = await r.text()
      console.error('Groq API error:', errorText)
      return res.status(500).json({ error: 'Failed to generate plan', details: errorText })
    }
    
    const data = await r.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    if (!content) {
      return res.status(500).json({ error: 'Empty response from Groq AI' })
    }

    const sections = {
      name: body.name || 'User',
      workout_plan: '',
      diet_plan: '',
      tips: '',
      motivation_quote: ''
    }

    const workoutMatch = content.match(/workout plan[:\s]*([\s\S]*?)(?=diet plan|$)/i)
    const dietMatch = content.match(/diet plan[:\s]*([\s\S]*?)(?=tips|motivation|$)/i)
    const tipsMatch = content.match(/tips[:\s]*([\s\S]*?)(?=motivation|$)/i)
    const quoteMatch = content.match(/motivation[:\s]*([\s\S]*?)$/i)

    if (workoutMatch) sections.workout_plan = workoutMatch[1].trim()
    if (dietMatch) sections.diet_plan = dietMatch[1].trim()
    if (tipsMatch) sections.tips = tipsMatch[1].trim()
    if (quoteMatch) sections.motivation_quote = quoteMatch[1].trim()

    if (!sections.workout_plan && !sections.diet_plan) {
      sections.workout_plan = content
    }

    sections._user = body

    return res.status(200).json(sections)
  } catch (err) {
    console.error('Generate API error:', err)
    return res.status(500).json({ error: err.message, stack: err.stack })
  }
}
