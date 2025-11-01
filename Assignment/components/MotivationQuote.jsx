import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success starts with self-discipline.",
  "Push yourself because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "The difference between try and triumph is a little umph.",
  "Strive for progress, not perfection.",
  "Believe in yourself and all that you are."
]

export default function MotivationQuote() {
  const [quote, setQuote] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const newIndex = Math.floor(Math.random() * quotes.length)
    setIndex(newIndex)
    setQuote(quotes[newIndex])
  }, [])

  const nextQuote = () => {
    const newIndex = (index + 1) % quotes.length
    setIndex(newIndex)
    setQuote(quotes[newIndex])
  }

  return (
    <motion.div 
      className="card p-8 text-center relative overflow-hidden"
      whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-4xl">💪</span>
        <h3 className="text-2xl font-bold gradient-text">
          Daily Motivation
        </h3>
        <motion.button
          onClick={nextQuote}
          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800/50"
          whileHover={{ rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          🔄
        </motion.button>
      </div>
      <motion.p 
        key={quote}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-700 dark:text-gray-300 italic text-xl font-medium leading-relaxed"
      >
        "{quote}"
      </motion.p>
    </motion.div>
  )
}
