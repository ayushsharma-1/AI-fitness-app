import { useState } from 'react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'

export default function PlanCard({ plan, onRegenerate }) {
  const [imgUrl, setImgUrl] = useState(null)
  const [loadingImage, setLoadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState('workout')

  async function playTTS(section = 'workout_plan') {
    const text = section === 'diet_plan' ? plan.diet_plan : plan.workout_plan
    if (!text) return alert('No content available')
    
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!res.ok) throw new Error('TTS not available')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.play()
    } catch (e) {
      alert('TTS not available: ' + e.message)
    }
  }

  async function generateImage(prompt) {
    if (!prompt) return alert('Please enter a prompt')
    setLoadingImage(true)
    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      if (!res.ok) throw new Error('Image generation failed')
      const data = await res.json()
      setImgUrl(data.url)
    } catch (e) {
      alert(e.message)
    } finally { 
      setLoadingImage(false) 
    }
  }

  function exportPDF() {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('AI Fitness Plan', 20, 20)
    doc.setFontSize(12)
    doc.text(`Plan for: ${plan.name || 'User'}`, 20, 35)
    
    doc.setFontSize(14)
    doc.text('Workout Plan', 20, 50)
    doc.setFontSize(10)
    const workoutLines = doc.splitTextToSize(plan.workout_plan || 'N/A', 170)
    doc.text(workoutLines, 20, 60)
    
    doc.addPage()
    doc.setFontSize(14)
    doc.text('Diet Plan', 20, 20)
    doc.setFontSize(10)
    const dietLines = doc.splitTextToSize(plan.diet_plan || 'N/A', 170)
    doc.text(dietLines, 20, 30)
    
    if (plan.tips) {
      doc.addPage()
      doc.setFontSize(14)
      doc.text('Tips & Recommendations', 20, 20)
      doc.setFontSize(10)
      const tipLines = doc.splitTextToSize(plan.tips, 170)
      doc.text(tipLines, 20, 30)
    }
    
    doc.save('fitness-plan.pdf')
  }

  function savePlan() {
    try { 
      localStorage.setItem('ai_fitness_plan', JSON.stringify(plan))
      alert('Plan saved successfully!')
    } catch(e){ 
      alert('Failed to save plan') 
    }
  }

  return (
    <motion.div 
      className="card p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
    >
      <div className="flex items-center justify-between pb-6 border-b-2 border-purple-100 dark:border-purple-900">
        <h2 className="text-3xl font-bold gradient-text flex items-center gap-3">
          <span className="text-4xl">🎯</span>
          Plan for {plan.name || 'User'}
        </h2>
        <motion.button
          onClick={onRegenerate}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Regenerate
        </motion.button>
      </div>

      <div className="flex gap-3 border-b-2 border-purple-100 dark:border-purple-900">
        {['workout', 'diet', 'tips'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === tab
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {tab === 'workout' && '🏋️ Workout Plan'}
            {tab === 'diet' && '🥗 Diet Plan'}
            {tab === 'tips' && '💡 Tips & Motivation'}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-h-[300px]"
      >
        {activeTab === 'workout' && (
          <div className="space-y-5">
            <div className="flex gap-3">
              <motion.button 
                onClick={() => playTTS('workout_plan')} 
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">🔊</span> Play Workout
              </motion.button>
            </div>
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-6 rounded-xl border-2 border-green-200/50 dark:border-green-800/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {plan.workout_plan || 'No workout plan available'}
              </pre>
            </motion.div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-5">
            <div className="flex gap-3">
              <motion.button 
                onClick={() => playTTS('diet_plan')} 
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">🔊</span> Play Diet
              </motion.button>
            </div>
            <motion.div 
              className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-xl border-2 border-indigo-200/50 dark:border-indigo-800/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {plan.diet_plan || 'No diet plan available'}
              </pre>
            </motion.div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            <motion.div 
              className="tips-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                <span className="text-3xl">💡</span> 
                <span className="gradient-text">Tips & Recommendations</span>
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                  {plan.tips ? (
                    plan.tips.split('\n').map((line, idx) => {
                      const cleanLine = line.trim().replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '')
                      if (!cleanLine) return null
                      
                      if (cleanLine.match(/^\d+\./)) {
                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-3 items-start bg-white/50 dark:bg-slate-700/50 p-3 rounded-lg"
                          >
                            <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0">
                              {cleanLine.match(/^\d+/)[0]}.
                            </span>
                            <p className="flex-1">{cleanLine.replace(/^\d+\.\s*/, '').replace(/^\*\*|\*\*$/g, '')}</p>
                          </motion.div>
                        )
                      }
                      return (
                        <p key={idx} className="text-gray-600 dark:text-gray-400">
                          {cleanLine}
                        </p>
                      )
                    })
                  ) : (
                    <p>No tips available</p>
                  )}
                </div>
              </div>
            </motion.div>
            
            {plan.motivation_quote && (
              <motion.div 
                className="motivation-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                  <span className="text-3xl">⭐</span> 
                  <span className="gradient-text">Your Motivation</span>
                </h3>
                <div className="relative">
                  <svg className="absolute -top-2 -left-2 w-8 h-8 text-orange-300 dark:text-orange-700 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h4V14c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v10h4V14c0-3.3-2.7-6-6-6H10z"/>
                  </svg>
                  <p className="text-lg italic text-gray-800 dark:text-gray-200 leading-relaxed pl-6">
                    {plan.motivation_quote.replace(/^[""]|[""]$/g, '').replace(/^#+\s*/, '')}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      <div className="section-divider"></div>

      <div className="space-y-6">
        <motion.div 
          className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 p-6 rounded-xl border-2 border-pink-200/50 dark:border-pink-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 gradient-text">
            <span className="text-2xl">🎨</span> Generate Image
          </h3>
          <div className="flex gap-3 flex-wrap">
            <input 
              placeholder="Enter exercise or meal (e.g., Barbell Squat, Grilled Chicken)" 
              id="imgPrompt" 
              className="input-field flex-1 min-w-[250px]"
            />
            <motion.button 
              onClick={() => generateImage(document.getElementById('imgPrompt').value)} 
              disabled={loadingImage} 
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl"
              whileHover={{ scale: loadingImage ? 1 : 1.05 }}
              whileTap={{ scale: loadingImage ? 1 : 0.95 }}
            >
              {loadingImage ? '⏳ Generating...' : '✨ Generate'}
            </motion.button>
          </div>
          {imgUrl && (
            <motion.img 
              src={imgUrl} 
              alt="generated" 
              className="mt-5 max-w-md w-full rounded-xl shadow-2xl border-4 border-white dark:border-slate-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            />
          )}
        </motion.div>

        <div className="flex flex-wrap gap-4">
          <motion.button 
            onClick={exportPDF} 
            className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">📄</span> Export PDF
          </motion.button>
          <motion.button 
            onClick={savePlan} 
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">💾</span> Save Plan
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
