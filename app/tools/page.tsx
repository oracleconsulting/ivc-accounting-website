'use client'

import { useState } from 'react'
import { Calculator, Shield, AlertTriangle } from 'lucide-react'

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
            className="w-full px-4 py-2 border-2 border-[#1a2b4a] focus:border-[#ff6b35] outline-none"
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
            className="w-full px-4 py-2 border-2 border-[#1a2b4a] focus:border-[#ff6b35] outline-none"
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
  
  const translations: Record<string, string> = {
    "synergies": "we're firing people",
    "right-sizing": "we're firing people",
    "optimization": "we're cutting costs and probably firing people",
    "value creation": "squeeze more profit at any cost",
    "strategic review": "looking for what to cut",
    "efficiency gains": "do more with less people",
    "scalable model": "replace humans with software",
    "exit strategy": "cash out before it implodes",
    "portfolio company": "our latest victim",
    "add-on acquisition": "buy competitors to jack up prices",
    "multiple arbitrage": "financial engineering BS",
    "platform investment": "roll-up scheme"
  }
  
  const translatePE = () => {
    let result = peText.toLowerCase()
    
    Object.entries(translations).forEach(([pe, real]) => {
      result = result.replace(new RegExp(pe, 'g'), `**${real}**`)
    })
    
    setTranslation(result || "No corporate BS detected. They might actually be honest!")
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
          className="w-full px-4 py-2 border-2 border-[#1a2b4a] focus:border-[#ff6b35] outline-none h-32"
          placeholder="We're excited about the synergies from this strategic acquisition..."
        />
      </div>
      
      <button
        onClick={translatePE}
        className="w-full bg-[#4a90e2] hover:bg-[#3a7bc8] text-white font-black uppercase py-3 mb-6 transition-all hover:translate-x-1"
      >
        TRANSLATE TO REALITY →
      </button>
      
      {translation && (
        <div className="bg-[#1a2b4a] text-[#f5f1e8] p-6">
          <p className="text-sm font-bold uppercase mb-2 text-[#ff6b35]">What They Really Mean:</p>
          <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
            __html: translation.replace(/\*\*(.*?)\*\*/g, '<span class="text-[#ff6b35] font-bold">$1</span>')
          }} />
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

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState('tax-savings')

  const tools = [
    {
      id: 'tax-savings',
      name: 'TAX SAVINGS ESTIMATOR',
      description: 'Find money they missed',
      icon: Calculator,
      component: <TaxSavingsCalculator />
    },
    {
      id: 'pe-translator',
      name: 'PE TRANSLATOR',
      description: 'Decode the corporate BS',
      icon: Shield,
      component: <PETranslator />
    },
    {
      id: 'fight-assessment',
      name: 'FIGHT ASSESSMENT',
      description: 'Is your accountant fighting for you?',
      icon: AlertTriangle,
      component: <FightAssessment />
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
                className={`px-6 py-3 font-bold uppercase transition-all ${
                  selectedTool === tool.id
                    ? 'bg-[#ff6b35] text-[#f5f1e8]'
                    : 'bg-transparent border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#1a2b4a]'
                }`}
              >
                {tool.name}
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