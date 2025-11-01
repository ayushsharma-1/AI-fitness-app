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
      className="card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Plan for {plan.name || 'User'}
        </h2>
        <motion.button
          onClick={onRegenerate}
          className="px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Regenerate
        </motion.button>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('workout')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'workout'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Workout Plan
        </button>
        <button
          onClick={() => setActiveTab('diet')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'diet'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Diet Plan
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'tips'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tips
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-h-[300px]"
      >
        {activeTab === 'workout' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <motion.button 
                onClick={() => playTTS('workout_plan')} 
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🔊</span> Play Workout
              </motion.button>
            </div>
            <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm">{plan.workout_plan || 'No workout plan available'}</pre>
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <motion.button 
                onClick={() => playTTS('diet_plan')} 
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🔊</span> Play Diet
              </motion.button>
            </div>
            <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm">{plan.diet_plan || 'No diet plan available'}</pre>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>💡</span> Tips & Recommendations
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {plan.tips || 'No tips available'}
              </p>
            </div>
            {plan.motivation_quote && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span>⭐</span> Your Motivation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                  "{plan.motivation_quote}"
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <div className="border-t pt-4 space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>🎨</span> Generate Image
          </h3>
          <div className="flex gap-3">
            <input 
              placeholder="Enter exercise or meal name (e.g., Barbell Squat)" 
              id="imgPrompt" 
              className="input-field flex-1"
            />
            <motion.button 
              onClick={() => generateImage(document.getElementById('imgPrompt').value)} 
              disabled={loadingImage} 
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium disabled:opacity-50"
              whileHover={{ scale: loadingImage ? 1 : 1.05 }}
              whileTap={{ scale: loadingImage ? 1 : 0.95 }}
            >
              {loadingImage ? 'Generating...' : 'Generate'}
            </motion.button>
          </div>
          {imgUrl && (
            <motion.img 
              src={imgUrl} 
              alt="generated" 
              className="mt-4 max-w-md rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <motion.button 
            onClick={exportPDF} 
            className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📄</span> Export PDF
          </motion.button>
          <motion.button 
            onClick={savePlan} 
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>💾</span> Save Plan
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
