'use client';

import { useState } from 'react';

export default function TestAIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const testWriting = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await fetch('/api/ai/writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Test AI Writing',
          outline: 'Introduction, Main Points, Conclusion',
          tone: 'professional',
          targetAudience: 'business',
          keywords: ['test', 'ai', 'writing']
        })
      });
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testResearch = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: 'accounting',
          targetMarket: 'small-business',
          timeframe: 'current',
          context: 'UK tax law'
        })
      });
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(JSON.stringify(data.results, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testSocial = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await fetch('/api/ai/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogTitle: 'Test Blog Post',
          blogContent: 'This is a test blog post about AI functionality.',
          platforms: ['linkedin', 'instagram'],
          businessInfo: {
            name: 'IVC Accounting',
            tagline: 'OTHER ACCOUNTANTS FILE. WE FIGHT.',
            location: 'Halstead, Essex'
          }
        })
      });
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(JSON.stringify(data.posts, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">AI System Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testWriting}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Writing API'}
        </button>
        
        <button
          onClick={testResearch}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Research API'}
        </button>
        
        <button
          onClick={testSocial}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Social API'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="bg-gray-100 border border-gray-400 px-4 py-3 rounded">
          <strong>Result:</strong>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
} 