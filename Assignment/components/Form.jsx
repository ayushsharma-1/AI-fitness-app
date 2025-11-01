import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Form({ onResult }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Prefer not to say',
    height: '',
    weight: '',
    goal: 'Weight Loss',
    level: 'Beginner',
    location: 'Home',
    diet: 'Non-Veg',
    medical: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function update(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to generate plan')
      }
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      onResult(data)
      try { localStorage.setItem('ai_fitness_plan', JSON.stringify(data)) } catch (e) {}
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err.message || 'Failed to generate plan. Please check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form 
      onSubmit={submit} 
      className="card p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
    >
      <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-3">
        <span className="text-3xl">📋</span>
        Tell me about you
      </h2>
      <div className="space-y-5">
        <input 
          name="name" 
          value={form.name} 
          onChange={update} 
          placeholder="Your Name" 
          className="input-field"
          required
        />
        
        <div className="grid grid-cols-2 gap-3">
          <input 
            name="age" 
            type="number"
            value={form.age} 
            onChange={update} 
            placeholder="Age" 
            className="input-field"
            required
          />
          <select name="gender" value={form.gender} onChange={update} className="input-field">
            <option>Prefer not to say</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input 
            name="height" 
            type="number"
            value={form.height} 
            onChange={update} 
            placeholder="Height (cm)" 
            className="input-field"
            required
          />
          <input 
            name="weight" 
            type="number"
            value={form.weight} 
            onChange={update} 
            placeholder="Weight (kg)" 
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Fitness Goal</label>
          <select name="goal" value={form.goal} onChange={update} className="input-field">
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
            <option>Maintenance</option>
            <option>Endurance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Fitness Level</label>
          <select name="level" value={form.level} onChange={update} className="input-field">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Workout Location</label>
          <select name="location" value={form.location} onChange={update} className="input-field">
            <option>Home</option>
            <option>Gym</option>
            <option>Outdoor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Dietary Preference</label>
          <select name="diet" value={form.diet} onChange={update} className="input-field">
            <option>Non-Veg</option>
            <option>Veg</option>
            <option>Vegan</option>
            <option>Keto</option>
          </select>
        </div>

        <textarea 
          name="medical" 
          value={form.medical} 
          onChange={update} 
          placeholder="Medical history or notes (optional)" 
          className="input-field h-24 resize-none"
        />

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div className="flex gap-3 pt-4">
          <motion.button 
            disabled={loading} 
            className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Generating...
              </span>
            ) : (
              '✨ Generate Plan'
            )}
          </motion.button>
          <motion.button 
            type="button" 
            onClick={() => { 
              try { 
                localStorage.removeItem('ai_fitness_plan')
                onResult(null) 
              } catch(e){} 
            }} 
            className="btn-secondary px-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🗑️ Clear
          </motion.button>
        </div>
      </div>
    </motion.form>
  )
}
