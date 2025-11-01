import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Form from '../components/Form'
import PlanCard from '../components/PlanCard'
import MotivationQuote from '../components/MotivationQuote'

export default function Home() {
  const [plan, setPlan] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_fitness_plan')
      if (saved) setPlan(JSON.parse(saved))
    } catch (e) {}
  }, [])

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MotivationQuote />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Form onResult={setPlan} />
        </motion.div>
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {plan ? (
            <PlanCard plan={plan} onRegenerate={() => setPlan(null)} />
          ) : (
            <motion.div 
              className="card p-16 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-purple-300 dark:text-purple-700">
                <motion.svg 
                  className="w-32 h-32 mx-auto mb-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </motion.svg>
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No plan generated yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Fill the form and click Generate Plan to get started on your fitness journey
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
