import React, { useEffect, useState } from 'react';
import { useOracleData } from '../../contexts/OracleDataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const AssessmentsPage = ({ isComplete }: { isComplete: boolean }) => {
  const { data } = useOracleData();
  const navigate = useNavigate();

  // Show fit message if Part 1 is complete but Part 2 is not
  if (data?.part1Complete && !data?.part2Complete && data?.fitMessage) {
    return (
      <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Assessment Progress</h2>
          
          {/* Part 1 Completion Message */}
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 shadow-xl text-white mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Part 1 Complete!</h3>
                <p className="text-blue-50">Here's what we discovered about you</p>
              </div>
            </div>
          </motion.div>

          {/* Fit Message Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Personalized Fit Analysis</h3>
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: data.fitMessage.replace(/\n/g, '<br />') }} />
            </div>
          </motion.div>

          {/* Part 2 Call to Action */}
          <motion.div
            className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 shadow-xl text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready for Part 2?</h3>
                <p className="text-teal-50">Let's dive deeper into your business and create your personalized roadmap.</p>
              </div>
              <button
                onClick={() => navigate('/assessment/part2')}
                className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors"
              >
                Start Part 2 →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ... rest of the component code ...
}; 