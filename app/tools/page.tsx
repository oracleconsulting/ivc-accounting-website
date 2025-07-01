'use client'

import { useState } from 'react'
import { Calculator, Shield, AlertTriangle, Clock, TrendingUp, FileText } from 'lucide-react'

// Tax Savings Calculator Component
function TaxSavingsCalculator() {
  const [revenue, setRevenue] = useState('')
  const [expenses, setExpenses] = useState('')
  const [currentTax, setCurrentTax] = useState(0)
  const [optimizedTax, setOptimizedTax] = useState(0)
  
  const calculateSavings = () => {
    const rev = parseFloat(revenue) || 0
    const exp = parseFloat(expenses) || 0
    const profit = rev - exp
    
    // Simplified calculation for demo
    const current = profit * 0.28 // 28% average tax
    const optimized = profit * 0.21 // 21% with optimization
    
    setCurrentTax(current)
    setOptimizedTax(optimized)
  }
  
  return (
    <div className="bg-white border-2 border-[#1a2b4a] p-8">
      <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">
        TAX SAVINGS ESTIMATOR
      </h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-bold uppercase text-[#1a2b4a] mb-2">
            Annual Revenue (£)
          </label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="w-full px-4 py-2 border-2 border-[#1a2b4a] focus:border-[#ff6b35] outline-none text-[#1a2b4a] placeholder-[#1a2b4a]/50"
            placeholder="250000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold uppercase text-[#1a2b4a] mb-2">
            Annual Expenses (£)
          </label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="w-full px-4 py-2 border-2 border-[#1a2b4a] focus:border-[#ff6b35] outline-none text-[#1a2b4a] placeholder-[#1a2b4a]/50"
            placeholder="150000"
          />
        </div>
      </div>
      
      <button
        onClick={calculateSavings}
        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase py-3 mb-6 transition-all hover:translate-x-1"
      >
        CALCULATE SAVINGS →
      </button>
      
      {(currentTax > 0 || optimizedTax > 0) && (
        <div className="bg-[#f5f1e8] p-6 border-2 border-[#1a2b4a]">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-bold uppercase text-[#1a2b4a]/60">Current Tax</p>
              <p className="text-2xl font-black text-[#1a2b4a]">£{currentTax.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-[#1a2b4a]/60">Optimized Tax</p>
              <p className="text-2xl font-black text-[#ff6b35]">£{optimizedTax.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-center bg-[#ff6b35] text-[#f5f1e8] p-4">
            <p className="text-sm font-bold uppercase">Potential Annual Savings</p>
            <p className="text-3xl font-black">£{(currentTax - optimizedTax).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// PE Translator Component
function PETranslator() {
  const [peText, setPeText] = useState('')
  const [translation, setTranslation] = useState('')
  const [bsLevel, setBsLevel] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const translatePE = async () => {
    if (!peText.trim()) {
      setError('Come on, paste some corporate BS in there!')
      return
    }
    
    setLoading(true)
    setError('')
    setTranslation('')
    setBsLevel('')
    
    try {
      // Use environment-based URL - falls back to production if not set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://oracle-api-server-production.up.railway.app'
      const response = await fetch(`${apiUrl}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: peText })
      })
      
      if (!response.ok) {
        throw new Error('Translation service is taking a coffee break')
      }
      
      const data = await response.json()
      setTranslation(data.translation)
      setBsLevel(data.bs_level)
    } catch {
      setError('Translation failed - even our BS detector is confused by this one!')
      // Fallback to simple translation
      setTranslation("Our AI is currently out fighting corporate BS elsewhere. Try again in a moment!")
    } finally {
      setLoading(false)
    }
  }
  
  const getBsLevelColor = () => {
    switch(bsLevel) {
      case 'mild': return 'bg-yellow-500'
      case 'moderate': return 'bg-orange-500'
      case 'severe': return 'bg-red-500'
      case 'terminal': return 'bg-purple-600'
      default: return 'bg-gray-500'
    }
  }
  
  const getBsLevelText = () => {
    switch(bsLevel) {
      case 'mild': return 'MILD BS - Just a little corporate fluff'
      case 'moderate': return 'MODERATE BS - Getting concerning'
      case 'severe': return 'SEVERE BS - Red flags everywhere'
      case 'terminal': return 'TERMINAL BS - Run for the hills!'
      default: return ''
    }
  }
  
  return (
    <div className="bg-white border-2 border-[#1a2b4a] p-8">
      <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">
        PE BULLSHIT TRANSLATOR
      </h3>
      
      <div className="mb-6">
        <label className="block text-sm font-bold uppercase text-[#1a2b4a] mb-2">
          Paste Their Corporate Speak
        </label>
        <textarea
          value={peText}
          onChange={(e) => setPeText(e.target.value)}
          className="w-full px-4 py-2 border-2 border-[#1a2b4a] focus:border-[#ff6b35] outline-none h-32 text-[#1a2b4a] placeholder-[#1a2b4a]/50"
          placeholder="We're excited about the synergies from this strategic acquisition..."
        />
      </div>
      
      <button
        onClick={translatePE}
        disabled={loading}
        className={`w-full font-black uppercase py-3 mb-6 transition-all hover:translate-x-1 ${
          loading 
            ? 'bg-gray-400 cursor-wait text-white' 
            : 'bg-[#4a90e2] hover:bg-[#3a7bc8] text-white'
        }`}
      >
        {loading ? 'DECODING BS...' : 'TRANSLATE TO REALITY →'}
      </button>
      
      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">{error}</p>
        </div>
      )}
      
      {translation && (
        <div className="space-y-4">
          {bsLevel && (
            <div className={`${getBsLevelColor()} text-white p-3 text-center`}>
              <p className="font-black uppercase">{getBsLevelText()}</p>
            </div>
          )}
          
          <div className="bg-[#1a2b4a] text-[#f5f1e8] p-6">
            <p className="text-sm font-bold uppercase mb-2 text-[#ff6b35]">What They Really Mean:</p>
            <p className="text-lg">{translation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Fight Assessment Component
function FightAssessment() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [score, setScore] = useState<number | null>(null)
  
  const questions = [
    { id: 'q1', text: 'Does your accountant answer their own phone?' },
    { id: 'q2', text: 'Have they ever saved you money you didn\'t know about?' },
    { id: 'q3', text: 'Do they proactively reach out with advice?' },
    { id: 'q4', text: 'Can you get a same-day response?' },
    { id: 'q5', text: 'Do they actually understand your business?' },
    { id: 'q6', text: 'Have they ever challenged HMRC on your behalf?' },
    { id: 'q7', text: 'Do they explain things without jargon?' },
    { id: 'q8', text: 'Have they helped you plan for the future?' }
  ]
  
  const calculateScore = () => {
    const yesCount = Object.values(answers).filter(Boolean).length
    setScore(yesCount)
  }
  
  const getResult = () => {
    if (!score) return ''
    
    if (score <= 2) return "Your accountant is just filing. Time to find a fighter."
    if (score <= 4) return "They're doing the minimum. You deserve better."
    if (score <= 6) return "Not bad, but there's room for a real fighter."
    return "Decent! But we still bet we can do better."
  }
  
  return (
    <div className="bg-white border-2 border-[#1a2b4a] p-8">
      <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">
        IS YOUR ACCOUNTANT FIGHTING FOR YOU?
      </h3>
      
      <div className="space-y-4 mb-6">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center justify-between p-4 bg-[#f5f1e8]">
            <span className="text-[#1a2b4a] pr-4">{q.text}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setAnswers({...answers, [q.id]: true})}
                className={`px-4 py-2 font-bold uppercase ${
                  answers[q.id] === true 
                    ? 'bg-[#ff6b35] text-white' 
                    : 'bg-white border-2 border-[#1a2b4a] text-[#1a2b4a]'
                }`}
              >
                YES
              </button>
              <button
                onClick={() => setAnswers({...answers, [q.id]: false})}
                className={`px-4 py-2 font-bold uppercase ${
                  answers[q.id] === false 
                    ? 'bg-[#1a2b4a] text-white' 
                    : 'bg-white border-2 border-[#1a2b4a] text-[#1a2b4a]'
                }`}
              >
                NO
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={calculateScore}
        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase py-3 mb-6 transition-all hover:translate-x-1"
        disabled={Object.keys(answers).length < questions.length}
      >
        GET YOUR SCORE →
      </button>
      
      {score !== null && (
        <div className="bg-[#1a2b4a] text-[#f5f1e8] p-6 text-center">
          <p className="text-5xl font-black mb-2">{score}/8</p>
          <p className="text-xl font-bold mb-4">{getResult()}</p>
          <a href="/contact" className="inline-block bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-6 py-3 transition-all hover:translate-x-1">
            SEE HOW WE FIGHT →
          </a>
        </div>
      )}
    </div>
  )
}

// Coming Soon Component
function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white border-2 border-[#1a2b4a] p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1a2b4a]/5" />
      <div className="relative">
        <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">
          {title}
        </h3>
        <p className="text-[#1a2b4a]/80 mb-8">{description}</p>
        
        <div className="bg-[#ff6b35] p-8 text-center">
          <Clock className="w-16 h-16 text-[#f5f1e8] mx-auto mb-4" />
          <p className="text-2xl font-black uppercase text-[#f5f1e8] mb-2">
            COMING SOON
          </p>
          <p className="text-[#f5f1e8]/90">
            We&apos;re building something special to help you fight harder.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-[#1a2b4a]/60">
            Want this tool faster? <a href="/contact" className="text-[#ff6b35] font-bold underline">Let us know</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState('tax-savings')

  const tools = [
    {
      id: 'tax-savings',
      name: 'TAX SAVINGS ESTIMATOR',
      description: 'Find money they missed',
      icon: Calculator,
      component: <TaxSavingsCalculator />,
      isActive: true
    },
    {
      id: 'pe-translator',
      name: 'PE TRANSLATOR',
      description: 'Decode the corporate BS',
      icon: Shield,
      component: <PETranslator />,
      isActive: true
    },
    {
      id: 'fight-assessment',
      name: 'FIGHT ASSESSMENT',
      description: 'Is your accountant fighting for you?',
      icon: AlertTriangle,
      component: <FightAssessment />,
      isActive: true
    },
    {
      id: 'cashflow-predictor',
      name: 'CASHFLOW PREDICTOR',
      description: 'See problems before they happen',
      icon: TrendingUp,
      component: <ComingSoon title="CASHFLOW PREDICTOR" description="AI-powered cashflow forecasting that spots issues 90 days before they hit. Know when to attack and when to defend." />,
      isActive: false
    },
    {
      id: 'hmrc-defender',
      name: 'HMRC DEFENDER',
      description: 'Your investigation shield',
      icon: FileText,
      component: <ComingSoon title="HMRC DEFENDER" description="Instant HMRC investigation risk assessment. Know your exposure and how to protect yourself before they come knocking." />,
      isActive: false
    }
  ]

  return (
    <>
      <section className="bg-[#1a2b4a] pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black uppercase text-[#f5f1e8] text-center mb-8">
            FREE <span className="text-[#ff6b35]">FIGHT TOOLS</span>
          </h1>
          
          {/* Tool Selector */}
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`px-6 py-3 font-bold uppercase transition-all relative ${
                  selectedTool === tool.id
                    ? 'bg-[#ff6b35] text-[#f5f1e8]'
                    : 'bg-transparent border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#1a2b4a]'
                }`}
              >
                {tool.name}
                {!tool.isActive && (
                  <span className="absolute -top-2 -right-2 bg-[#4a90e2] text-[#f5f1e8] text-xs px-2 py-1 rounded-full">
                    SOON
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f5f1e8]">
        <div className="container mx-auto px-4 max-w-4xl">
          {tools.find(t => t.id === selectedTool)?.component}
        </div>
      </section>
    </>
  )
} 