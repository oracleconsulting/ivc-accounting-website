import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    // Define internal link opportunities
    const linkOpportunities = [
      { phrase: 'tax relief', url: '/services/tax-relief-consulting' },
      { phrase: 'making tax digital', url: '/blog/making-tax-digital-guide' },
      { phrase: 'R&D credits', url: '/services/rd-tax-credits' },
      { phrase: 'VAT', url: '/services/vat-consulting' },
      { phrase: 'payroll', url: '/services/payroll-management' },
      { phrase: 'accounts', url: '/services/accountant-halstead' }
    ];
    
    let enhanced = content;
    
    linkOpportunities.forEach(({ phrase, url }) => {
      const regex = new RegExp(`\\b${phrase}\\b(?![^<]*>)`, 'gi');
      let count = 0;
      enhanced = enhanced.replace(regex, (match: string) => {
        // Only link first 2 occurrences to avoid over-linking
        if (count < 2) {
          count++;
          return `[${match}](${url})`;
        }
        return match;
      });
    });
    
    return NextResponse.json({ enhanced });
    
  } catch (error) {
    console.error('Auto-link error:', error);
    return NextResponse.json({ enhanced: request.body }, { status: 500 });
  }
} 