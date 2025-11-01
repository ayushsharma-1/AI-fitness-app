import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success starts with self-discipline.",
  "Push yourself because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "The difference between try and triumph is a little umph.",
  "Strive for progress, not perfection."
]

export default function MotivationQuote() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  return (
    <motion.div 
      className="card p-6 text-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-2xl">💪</span>
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Daily Motivation
        </h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300 italic text-lg">
        "{quote}"
      </p>
    </motion.div>
  )
}
