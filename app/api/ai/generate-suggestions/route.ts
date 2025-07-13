import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, keywords, title } = await req.json();
    
    const suggestions = [
      {
        id: Date.now() + 1,
        type: 'structure',
        title: 'Add FAQ Section',
        description: 'Readers love FAQ sections',
        suggestion: 'Create an FAQ section addressing common questions about ' + (title || 'this topic'),
        impact: 'high'
      },
      {
        id: Date.now() + 2,
        type: 'content',
        title: 'Include Case Study',
        description: 'Real examples build trust',
        suggestion: 'Add a brief case study showing how a client benefited from these strategies',
        impact: 'high'
      },
      {
        id: Date.now() + 3,
        type: 'seo',
        title: 'Add Schema Markup',
        description: 'Improve search visibility',
        suggestion: 'Include FAQ schema markup for better search results',
        impact: 'medium'
      },
      {
        id: Date.now() + 4,
        type: 'engagement',
        title: 'Create Downloadable Resource',
        description: 'Increase lead generation',
        suggestion: 'Offer a downloadable checklist or guide related to ' + (keywords[0] || 'this topic'),
        impact: 'high'
      }
    ];
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
} 