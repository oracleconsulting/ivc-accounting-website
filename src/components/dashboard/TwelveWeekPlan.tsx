'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface WeeklyTask {
  title: string
  description: string
  progress: number
  subtasks: string[]
}

export const TwelveWeekPlan = () => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  const weeklyTasks: WeeklyTask[] = [
    {
      title: 'Emergency Relief',
      description: 'Stop the 85-hour bleeding - immediate delegation & boundaries',
      progress: 0,
      subtasks: [
        'Identify top 3 time drains',
        'Set up initial delegation system',
        'Create emergency response protocol'
      ]
    },
    {
      title: 'Rapid Triage',
      description: 'Get critical systems in place to prevent daily fires',
      progress: 0,
      subtasks: [
        'Document core processes',
        'Set up task management system',
        'Create client communication templates'
      ]
    },
    {
      title: 'Foundation Systems',
      description: 'Build the infrastructure to run 4 businesses efficiently',
      progress: 0,
      subtasks: [
        'Implement project management tool',
        'Set up automated reporting',
        'Create team dashboards'
      ]
    }
    // ... add more weeks as needed
  ]

  const toggleWeek = (index: number) => {
    setExpandedWeek(expandedWeek === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Sprint Theme */}
        <div className="mb-8">
          <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Sprint Theme</h2>
            <p className="text-xl">Your 90-Day Business Transformation</p>
          </div>
        </div>

        {/* Risk Section */}
        <div className="mb-8">
          <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Biggest Risk</h2>
            <p className="text-xl">Trying to do too much too fast</p>
          </div>
        </div>

        {/* Success Milestones */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Success Milestones</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { week: 4, title: 'Foundation complete' },
              { week: 8, title: 'Systems running smoothly' },
              { week: 12, title: 'Transformation achieved' }
            ].map((milestone, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">WEEK {milestone.week}</p>
                <p className="font-semibold text-gray-800">{milestone.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Weekly Breakdown</h2>
          {weeklyTasks.map((task, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              layout
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleWeek(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      Progress: {task.progress}/3
                    </div>
                    {expandedWeek === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {expandedWeek === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="pl-12">
                        <h4 className="font-semibold text-gray-700 mb-2">Subtasks:</h4>
                        <ul className="space-y-2">
                          {task.subtasks.map((subtask, subtaskIndex) => (
                            <li key={subtaskIndex} className="flex items-center gap-2 text-gray-600">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                              {subtask}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 