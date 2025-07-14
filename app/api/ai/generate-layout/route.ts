import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, title, keywords, contentType } = await req.json();
    
    // Analyze content to determine best layout
    const wordCount = content.split(/\s+/).length;
    const hasNumbers = /\d+%|\d+\s*(million|billion|thousand)|\£\d+/i.test(content);
    const hasQuestions = (content.match(/\?/g) || []).length > 2;
    const hasLists = content.includes('•') || content.includes('-') || /^\d+\./m.test(content);
    
    // Generate layout suggestions based on content analysis
    const layoutSuggestions = [];
    
    // Professional Service Layout - for business/accounting content
    if (keywords.some((k: string) => /tax|accounting|business|finance|legal/i.test(k))) {
      layoutSuggestions.push({
        id: 'professional-service',
        name: 'Professional Service Layout',
        score: 95,
        components: [
          {
            type: 'hero',
            config: {
              headline: title || 'Transform Your Business',
              subheadline: 'Expert insights and strategies for growth',
              backgroundStyle: 'gradient',
              ctaText: 'Get Started',
              ctaStyle: 'primary'
            }
          },
          {
            type: 'stats',
            config: {
              title: 'Why This Matters',
              stats: [
                { number: '73%', label: 'of businesses miss tax savings' },
                { number: '£5.5k', label: 'average annual savings' },
                { number: '89%', label: 'client satisfaction rate' },
                { number: '24/7', label: 'support available' }
              ]
            }
          },
          {
            type: 'comparison',
            config: {
              title: 'Traditional vs Modern Approach',
              leftColumn: 'Traditional Methods',
              rightColumn: 'Our Approach',
              rows: [
                ['Manual calculations', 'Automated systems'],
                ['Yearly reviews', 'Real-time monitoring'],
                ['Generic advice', 'Tailored strategies'],
                ['Reactive planning', 'Proactive optimization']
              ]
            }
          },
          {
            type: 'testimonial',
            config: {
              quotes: [
                {
                  text: 'IVC Accounting transformed our financial processes. We\'ve saved thousands!',
                  author: 'Sarah Johnson',
                  role: 'CEO, TechStart Ltd'
                },
                {
                  text: 'The best accounting decision we\'ve ever made for our business.',
                  author: 'Michael Chen',
                  role: 'Director, Chen Enterprises'
                }
              ]
            }
          },
          {
            type: 'cta',
            config: {
              headline: 'Ready to Transform Your Business?',
              subtext: 'Get expert advice tailored to your needs',
              primaryButton: 'Schedule Free Consultation',
              secondaryButton: 'Download Our Guide'
            }
          }
        ],
        description: 'Trust-building layout perfect for professional services',
        preview: '🎯 Hero → 📊 Stats → 📋 Comparison → 💬 Testimonials → 🎯 CTA',
        css: {
          primaryColor: '#ff6b35',
          secondaryColor: '#1a2b4a',
          accentColor: '#4a90e2',
          backgroundColor: '#f5f1e8'
        }
      });
    }
    
    // Educational Blog Layout - for informative content
    if (wordCount > 800 || hasLists) {
      layoutSuggestions.push({
        id: 'educational-blog',
        name: 'Educational Blog Layout',
        score: 90,
        components: [
          {
            type: 'hero',
            config: {
              style: 'minimal',
              showReadingTime: true,
              showAuthor: true,
              showDate: true
            }
          },
          {
            type: 'toc',
            config: {
              title: 'In This Article',
              sticky: true,
              autoGenerate: true
            }
          },
          {
            type: 'content',
            config: {
              enhancedTypography: true,
              dropCap: true,
              pullQuotes: true
            }
          },
          {
            type: 'faq',
            config: {
              title: 'Frequently Asked Questions',
              questions: hasQuestions ? 'auto-extract' : 'generate',
              expandable: true
            }
          },
          {
            type: 'relatedPosts',
            config: {
              title: 'Continue Learning',
              count: 3,
              style: 'cards'
            }
          },
          {
            type: 'newsletter',
            config: {
              headline: 'Stay Updated',
              description: 'Get the latest insights delivered to your inbox'
            }
          }
        ],
        description: 'Information-rich layout for educational content',
        preview: '📚 Hero → 📑 TOC → 📝 Content → ❓ FAQ → 🔗 Related → 📧 Newsletter'
      });
    }
    
    // Data-Driven Layout - for content with statistics
    if (hasNumbers) {
      layoutSuggestions.push({
        id: 'data-driven',
        name: 'Data-Driven Layout',
        score: 85,
        components: [
          {
            type: 'stats',
            config: {
              style: 'cards',
              animated: true,
              countUp: true
            }
          },
          {
            type: 'infographic',
            config: {
              title: 'Key Insights Visualized',
              style: 'modern',
              interactive: true
            }
          },
          {
            type: 'chart',
            config: {
              type: 'bar',
              title: 'Growth Potential',
              animated: true
            }
          },
          {
            type: 'comparison',
            config: {
              style: 'visual',
              showPercentages: true
            }
          },
          {
            type: 'quote',
            config: {
              style: 'highlight',
              citations: true
            }
          },
          {
            type: 'download',
            config: {
              title: 'Get the Full Report',
              fileType: 'pdf',
              gated: true
            }
          }
        ],
        description: 'Numbers-focused layout for analytical content',
        preview: '📊 Stats → 📈 Infographic → 📉 Charts → 📋 Compare → 💭 Quote → 📥 Download'
      });
    }
    
    // Interactive Layout - for engaging content
    layoutSuggestions.push({
      id: 'interactive',
      name: 'Interactive Experience Layout',
      score: 80,
      components: [
        {
          type: 'hero',
          config: {
            style: 'video-background',
            autoplay: true,
            parallax: true
          }
        },
        {
          type: 'calculator',
          config: {
            title: 'Calculate Your Savings',
            fields: ['revenue', 'expenses', 'employees'],
            realtime: true
          }
        },
        {
          type: 'timeline',
          config: {
            title: 'Your Journey to Success',
            interactive: true,
            animated: true
          }
        },
        {
          type: 'quiz',
          config: {
            title: 'Find Your Perfect Solution',
            questions: 5,
            personalized: true
          }
        },
        {
          type: 'video',
          config: {
            title: 'See It In Action',
            thumbnail: 'auto-generate',
            chapters: true
          }
        },
        {
          type: 'booking',
          config: {
            title: 'Book Your Consultation',
            calendar: true,
            availability: 'real-time'
          }
        }
      ],
      description: 'Highly engaging layout with interactive elements',
      preview: '🎬 Video Hero → 🧮 Calculator → 📅 Timeline → ❓ Quiz → 🎥 Demo → 📅 Booking'
    });
    
    // Generate HTML preview for the top suggestion
    const topLayout = layoutSuggestions[0];
    const htmlPreview = generateHTMLPreview(topLayout, { title, content: content.substring(0, 500) });
    
    // Sort by score
    layoutSuggestions.sort((a, b) => b.score - a.score);
    
    return NextResponse.json({
      suggestions: layoutSuggestions,
      topSuggestion: layoutSuggestions[0],
      htmlPreview,
      contentAnalysis: {
        wordCount,
        hasNumbers,
        hasQuestions,
        hasLists,
        recommendedLayout: layoutSuggestions[0].id
      }
    });
    
  } catch (error) {
    console.error('Failed to generate layout:', error);
    return NextResponse.json(
      { error: 'Failed to generate layout suggestions' }, 
      { status: 500 }
    );
  }
}

function generateHTMLPreview(layout: any, content: any): string {
  const { title, content: excerpt } = content;
  const { css } = layout;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: ${css?.backgroundColor || '#fff'};
    }
    .hero {
      background: linear-gradient(135deg, ${css?.primaryColor || '#ff6b35'} 0%, ${css?.secondaryColor || '#1a2b4a'} 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }
    .hero h1 {
      font-size: 3rem;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      padding: 60px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .stat-card {
      background: white;
      padding: 30px;
      border-radius: 0;
      border: 2px solid ${css?.secondaryColor || '#1a2b4a'};
      text-align: center;
    }
    .stat-number {
      font-size: 2.5rem;
      font-weight: 900;
      color: ${css?.primaryColor || '#ff6b35'};
    }
    .content {
      max-width: 800px;
      margin: 60px auto;
      padding: 0 20px;
      line-height: 1.8;
      color: ${css?.secondaryColor || '#1a2b4a'};
    }
    .cta {
      background: ${css?.secondaryColor || '#1a2b4a'};
      color: white;
      padding: 60px 20px;
      text-align: center;
    }
    .cta-button {
      background: ${css?.primaryColor || '#ff6b35'};
      color: white;
      padding: 15px 40px;
      font-size: 1.1rem;
      font-weight: 900;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${title || 'Transform Your Business'}</h1>
    <p>Expert strategies that deliver real results</p>
  </div>
  
  <div class="stats">
    <div class="stat-card">
      <div class="stat-number">73%</div>
      <div>Businesses Missing Savings</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">£5.5k</div>
      <div>Average Annual Savings</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">89%</div>
      <div>Client Satisfaction</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">24/7</div>
      <div>Expert Support</div>
    </div>
  </div>
  
  <div class="content">
    <p>${excerpt}...</p>
  </div>
  
  <div class="cta">
    <h2>Ready to Get Started?</h2>
    <p>Transform your business with expert guidance</p>
    <button class="cta-button">Schedule Free Consultation</button>
  </div>
</body>
</html>
  `;
} 