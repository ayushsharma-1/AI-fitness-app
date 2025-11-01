import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <div className="min-h-screen">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="p-4 border-b card sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Fitness Coach
          </h1>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:scale-105 transition-transform"
            onClick={() => setDark(d => !d)}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </motion.header>
      <main className="container mx-auto p-6">
        <Component {...pageProps} />
      </main>
    </div>
  )
}
