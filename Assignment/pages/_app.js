import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
        className="card sticky top-0 z-50 mx-4 mt-4 mb-6"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
          >
            💪 AI Fitness Coach
          </motion.h1>
          <motion.button
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 hover:scale-110 transition-transform shadow-lg"
            onClick={() => setDark(d => !d)}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-2xl">{dark ? '☀️' : '🌙'}</span>
          </motion.button>
        </div>
      </motion.header>
      <main className="container mx-auto px-4 pb-12">
        <Component {...pageProps} />
      </main>
    </div>
  )
}
