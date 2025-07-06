import { NextRequest, NextResponse } from 'next/server';
import { pineconeService } from '@/lib/services/pineconeService';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Research topics relevant to UK accounting and target markets
const RESEARCH_PROMPTS = {
  'accounting': {
    sources: ['HMRC updates', 'Budget announcements', 'Tax law changes'],
    focus: ['MTD updates', 'Corporation tax', 'VAT changes', 'R&D credits']
  },
  'small-business': {
    sources: ['Government schemes', 'Business support', 'Economic trends'],
    focus: ['Cash flow', 'Growth strategies', 'Compliance', 'Cost reduction']
  }
};

export async function POST(request: NextRequest) {
  try {
    const { industry, targetMarket, timeframe, context } = await request.json();

    // Get AI settings
    const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ai/settings`);
    const settings = await settingsResponse.json();
    
    // Search knowledge base for relevant context
    let knowledgeContext = '';
    try {
      const relevantDocs = await pineconeService.searchSimilar(
        `${industry} ${targetMarket} ${timeframe}`,
        5,
        { type: 'knowledge' }
      );
      
      knowledgeContext = relevantDocs
        .map(doc => doc.metadata?.content || '')
        .filter((content): content is string => typeof content === 'string' && content.length > 0)
        .join('\n\n');
    } catch (error) {
      console.warn('Failed to fetch knowledge context:', error);
    }

    // Create a sophisticated research prompt with knowledge context
    const systemPrompt = settings.research_system_prompt + `
    
    Relevant knowledge base context:
    ${knowledgeContext}
    
    Use this context to provide more informed and relevant research suggestions.`;

    const userPrompt = `Research current topics in ${industry} for ${targetMarket} during ${timeframe}.
Find 5 high-impact topics that:
1. Have recent developments or changes
2. Directly affect the target audience's finances
3. Provide actionable advice opportunities
4. Have SEO potential with clear search intent
5. Can differentiate IVC Accounting's expertise

For each topic provide:
- Clear title
- Impact assessment (why it matters now)
- Target audience specifics
- 5-7 relevant keywords
- Credible sources to reference`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.ivcaccounting.co.uk',
        'X-Title': 'IVC Blog Research'
      },
      body: JSON.stringify({
        model: settings.research_model || 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: settings.research_temperature || 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    const researchContent = data.choices[0].message.content;

    // Parse the AI response into structured data
    const results = parseResearchResults(researchContent);

    return NextResponse.json({ 
      results,
      knowledgeContextUsed: knowledgeContext.length > 0,
      settings: {
        model: settings.research_model,
        temperature: settings.research_temperature
      }
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform research' },
      { status: 500 }
    );
  }
}

function parseResearchResults(content: string): any[] {
  // This would parse the AI response into structured ResearchResult objects
  // For now, returning mock data
  return [
    {
      topic: "Spring Budget 2024: Key Changes for Small Businesses",
      relevance: 95,
      impact: "New dividend tax thresholds and R&D credit changes affect 80% of Essex SMEs",
      keywords: ["spring budget 2024", "dividend tax", "R&D tax credits", "small business tax"],
      sources: ["HMRC", "Treasury"],
      targetAudience: "Small business owners with £50k-£500k revenue"
    },
    {
      topic: "Making Tax Digital: Phase 2 Preparation Guide",
      relevance: 88,
      impact: "ITSA requirements starting April 2026 - businesses need 18 months to prepare",
      keywords: ["making tax digital", "MTD ITSA", "digital tax", "HMRC compliance"],
      sources: ["HMRC MTD Guide"],
      targetAudience: "Self-employed and landlords with income over £10k"
    }
  ];
} 