import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  const tests: any = {
    envCheck: {
      hasKey: !!OPENROUTER_API_KEY,
      keyLength: OPENROUTER_API_KEY?.length,
      keyPrefix: OPENROUTER_API_KEY?.substring(0, 10) + '...',
      nodeEnv: process.env.NODE_ENV,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  };

  // Test OpenRouter connectivity
  if (OPENROUTER_API_KEY) {
    try {
      console.log('Testing OpenRouter connectivity...');
      const startTime = Date.now();
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        }
      });
      
      tests.openRouterConnectivity = {
        status: response.status,
        responseTime: Date.now() - startTime,
        ok: response.ok
      };
      
      if (response.ok) {
        const data = await response.json();
        tests.openRouterConnectivity.modelsCount = data.data?.length || 0;
        console.log('✅ OpenRouter connectivity test passed');
      } else {
        console.error('❌ OpenRouter connectivity test failed:', response.status);
      }
    } catch (error: any) {
      tests.openRouterConnectivity = {
        error: error.message,
        type: error.name
      };
      console.error('❌ OpenRouter connectivity test error:', error.message);
    }
  }

  // Test a simple completion
  if (OPENROUTER_API_KEY) {
    try {
      console.log('Testing simple AI completion...');
      const startTime = Date.now();
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
          'X-Title': 'IVC AI Debug Test'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [{ role: 'user', content: 'Say "test successful"' }],
          max_tokens: 10
        })
      });
      
      const data = await response.json();
      tests.simpleCompletion = {
        status: response.status,
        responseTime: Date.now() - startTime,
        ok: response.ok,
        content: data.choices?.[0]?.message?.content,
        error: data.error
      };
      
      if (response.ok && data.choices?.[0]?.message?.content) {
        console.log('✅ Simple AI completion test passed');
      } else {
        console.error('❌ Simple AI completion test failed:', data.error);
      }
    } catch (error: any) {
      tests.simpleCompletion = {
        error: error.message,
        type: error.name
      };
      console.error('❌ Simple AI completion test error:', error.message);
    }
  }

  // Test AI settings endpoint
  try {
    console.log('Testing AI settings endpoint...');
    const startTime = Date.now();
    const settingsUrl = 'http://localhost:3000/api/ai/settings';
    const response = await fetch(settingsUrl);
    
    tests.aiSettings = {
      status: response.status,
      responseTime: Date.now() - startTime,
      ok: response.ok
    };
    
    if (response.ok) {
      const data = await response.json();
      tests.aiSettings.data = data;
      console.log('✅ AI settings test passed');
    } else {
      console.error('❌ AI settings test failed:', response.status);
    }
  } catch (error: any) {
    tests.aiSettings = {
      error: error.message,
      type: error.name
    };
    console.error('❌ AI settings test error:', error.message);
  }

  // Test environment variable loading
  tests.envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    OPENROUTER_API_KEY: OPENROUTER_API_KEY ? '***SET***' : 'NOT_SET',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'
  };

  console.log('=== AI Debug Test Complete ===');
  console.log('Results:', JSON.stringify(tests, null, 2));

  return NextResponse.json(tests);
} 