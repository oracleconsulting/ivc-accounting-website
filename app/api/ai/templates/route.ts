import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const { templateId, customization } = await request.json();
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }
    
    // Template library
    const templates = {
      'monthly-tax-update': {
        structure: `# [Month] Tax Update: Key Changes for [Business Type]
## What's New This Month
[3-4 bullet points of changes]
## Impact on Your Business
[Specific implications]
## Action Items
[Checklist of things to do]
## Deadlines
[Important dates]`,
        tone: 'informative yet urgent'
      },
      'small-business-guide': {
        structure: `# The Complete Guide to [Topic] for UK Small Businesses
## Why This Matters Now
[Hook and relevance]
## Step-by-Step Process
[Detailed walkthrough]
## Common Pitfalls
[What to avoid]
## Tools and Resources
[Helpful links and tools]`,
        tone: 'friendly and practical'
      },
      'compliance-checklist': {
        structure: `# [Compliance Area] Checklist for [Year]
## Overview
[Brief context]
## Essential Requirements
[Must-do items]
## Best Practices
[Recommended actions]
## Red Flags
[Warning signs]`,
        tone: 'authoritative and clear'
      }
    };
    
    const template = templates[templateId as keyof typeof templates];
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    
    const systemPrompt = `You are a content template customization expert. Take the template structure and customize it based on the user's requirements. Maintain the ${template.tone} tone.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
        'X-Title': 'IVC Template Customizer'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Customize this template:\n${template.structure}\n\nCustomization requirements: ${JSON.stringify(customization)}` }
        ],
        temperature: 0.6,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('Template customization failed');
    }

    const data = await response.json();
    const customizedContent = data.choices?.[0]?.message?.content || '';
    
    return NextResponse.json({ 
      content: customizedContent,
      templateId,
      customization
    });
    
  } catch (error) {
    console.error('Template error:', error);
    return NextResponse.json({ error: 'Template customization failed' }, { status: 500 });
  }
} 