# AI Fitness Coach

Minimal Next.js app that generates personalized workout and diet plans using Groq AI (Llama 3.3), with TTS and image generation.

Requirements
- Node 18+ recommended
- Environment variables (create `.env.local` file):
  - GROQ_API_KEY (required for plan generation)
  - MURF_API_KEY (optional, for TTS voice synthesis)

## Setup

1. Get your Groq API key from: https://console.groq.com/keys (FREE)

2. Get your Murf AI API key from: https://murf.ai (optional, for voice features)

3. Create `.env.local` file in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
MURF_API_KEY=your_murf_api_key_here
```

3. Install and run (PowerShell):

```powershell
npm install
npm run dev
```

## Usage
- Open http://localhost:3000
- Fill the form and click "Generate Plan". The server will call Groq AI to create a personalized plan.
- Use Play buttons to hear the plan (Murf AI required).
- Generate exercise/food images via the Generate image control.
- Export PDF using Export PDF button.
- Save plan locally using Save Plan button.
- Toggle between light/dark mode using the moon/sun button.

## Deployment
- Recommended: Vercel
- Add the environment variables in Vercel project settings
- Push to GitHub and import in Vercel

## Features
- AI-powered workout and diet plans
- Voice synthesis for plans
- Image generation for exercises and meals
- PDF export
- Local storage persistence
- Dark mode
- Smooth animations
- Responsive design

## Tech Stack
- Next.js 13
- React 18
- Tailwind CSS
- Framer Motion
- Groq AI (Llama 3.3 70B)
- Murf AI (optional)
- jsPDF
- Unsplash Images

