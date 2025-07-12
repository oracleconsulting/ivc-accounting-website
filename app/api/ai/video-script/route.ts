// /app/api/ai/video-script/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      content, 
      duration = '5-7 minutes',
      style = 'educational-engaging' 
    } = body;

    // Generate video script using Claude
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ivcaccounting.com',
        'X-Title': 'IVC Video Script Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          {
            role: 'system',
            content: `You are an expert video script writer for IVC Accounting's YouTube channel. 
            Create engaging, educational video scripts that convert viewers into clients.
            
            Video Style: ${style}
            Target Duration: ${duration}
            
            Script Structure:
            1. Hook (0-15 seconds): Attention-grabbing opening
            2. Introduction (15-30 seconds): What viewers will learn
            3. Main Content (3-5 minutes): Key points with examples
            4. Summary (30 seconds): Recap main takeaways
            5. Call to Action (15-30 seconds): Next steps
            
            Include:
            - Scene descriptions and visual cues
            - B-roll suggestions
            - On-screen text/graphics
            - Transition notes
            - Speaking pace indicators
            - Emotional tone markers
            
            Writing Guidelines:
            - Conversational, energetic tone
            - Short, punchy sentences
            - Natural pauses for emphasis
            - Questions to engage viewers
            - Stories and examples
            - Clear value propositions`
          },
          {
            role: 'user',
            content: `Create a video script from this blog post:
            
            Title: ${title}
            
            Content: ${content}
            
            Format as JSON:
            {
              "title": "Video title",
              "duration": "Estimated duration",
              "hook": {
                "text": "Opening hook script",
                "visualNotes": "What to show on screen",
                "duration": "15 seconds"
              },
              "introduction": {
                "text": "Introduction script",
                "visualNotes": "Visual elements",
                "duration": "30 seconds"
              },
              "mainContent": [
                {
                  "section": "Section title",
                  "text": "Script for this section",
                  "visualNotes": "B-roll, graphics, etc.",
                  "duration": "X minutes"
                }
              ],
              "summary": {
                "text": "Summary script",
                "visualNotes": "Recap graphics",
                "duration": "30 seconds"
              },
              "callToAction": {
                "text": "CTA script",
                "visualNotes": "Contact info, links",
                "duration": "30 seconds"
              },
              "totalWords": 1000,
              "speakingPace": "150 words per minute",
              "equipment": ["Camera", "Microphone", "Lighting"],
              "bRollSuggestions": ["List of B-roll shots needed"],
              "graphicsNeeded": ["List of graphics/animations"]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate video script');
    }

    const data = await response.json();
    const videoScript = JSON.parse(data.choices[0].message.content);

    // Generate formatted script document
    const formattedScript = formatVideoScript(videoScript);

    // Save script to storage
    const fileName = `video-script-${Date.now()}.txt`;
    const { data: upload, error: uploadError } = await supabase.storage
      .from('downloads')
      .upload(fileName, formattedScript, {
        contentType: 'text/plain',
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('downloads')
      .getPublicUrl(fileName);

    return NextResponse.json({
      script: videoScript,
      url: publicUrl,
      formattedScript
    });
  } catch (error) {
    console.error('Video script generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video script' },
      { status: 500 }
    );
  }
}

function formatVideoScript(script: any): string {
  return `
VIDEO SCRIPT: ${script.title}
Duration: ${script.duration}
Speaking Pace: ${script.speakingPace}
Total Words: ${script.totalWords}

========================================
EQUIPMENT NEEDED
========================================
${script.equipment.join('\n')}

========================================
B-ROLL SUGGESTIONS
========================================
${script.bRollSuggestions.join('\n')}

========================================
GRAPHICS NEEDED
========================================
${script.graphicsNeeded.join('\n')}

========================================
SCRIPT
========================================

[HOOK - ${script.hook.duration}]
${script.hook.text}

VISUAL NOTES: ${script.hook.visualNotes}

---

[INTRODUCTION - ${script.introduction.duration}]
${script.introduction.text}

VISUAL NOTES: ${script.introduction.visualNotes}

---

[MAIN CONTENT]
${script.mainContent.map((section: any) => `
[${section.section.toUpperCase()} - ${section.duration}]
${section.text}

VISUAL NOTES: ${section.visualNotes}
`).join('\n---\n')}

---

[SUMMARY - ${script.summary.duration}]
${script.summary.text}

VISUAL NOTES: ${script.summary.visualNotes}

---

[CALL TO ACTION - ${script.callToAction.duration}]
${script.callToAction.text}

VISUAL NOTES: ${script.callToAction.visualNotes}

========================================
END OF SCRIPT
========================================
`;
}