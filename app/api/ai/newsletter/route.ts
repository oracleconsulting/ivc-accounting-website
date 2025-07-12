// /app/api/ai/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { title, content, style = 'professional-engaging' } = body;

    // Generate newsletter using Claude
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ivcaccounting.com',
        'X-Title': 'IVC Newsletter Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are an expert email newsletter creator for IVC Accounting. 
            Transform blog content into engaging email newsletters that drive action.
            
            Newsletter Style: ${style}
            
            Structure:
            1. Subject Line: Compelling, 30-50 characters
            2. Preheader: Intriguing preview text, 40-90 characters
            3. Header: Personal greeting and hook
            4. Introduction: Brief context and value proposition
            5. Main Content: 3-5 key points with clear headers
            6. Call to Action: Clear next steps
            7. Footer: Contact info and unsubscribe
            
            Guidelines:
            - Write in a conversational yet professional tone
            - Use short paragraphs (2-3 sentences max)
            - Include bullet points for easy scanning
            - Add personal touches and client benefits
            - Create urgency without being pushy
            - Mobile-optimized formatting`
          },
          {
            role: 'user',
            content: `Create an email newsletter from this blog post:
            
            Title: ${title}
            
            Content: ${content}
            
            Format the response as JSON with these fields:
            {
              "subject": "Email subject line",
              "preheader": "Preview text",
              "html": "Full HTML newsletter content",
              "plainText": "Plain text version",
              "sections": [
                {
                  "type": "header|content|cta|footer",
                  "content": "Section content"
                }
              ],
              "cta": {
                "text": "Button text",
                "url": "Link URL"
              }
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate newsletter');
    }

    const data = await response.json();
    const newsletter = JSON.parse(data.choices[0].message.content);

    // Generate HTML template
    const htmlContent = generateNewsletterHTML(newsletter);
    newsletter.html = htmlContent;

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Newsletter generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate newsletter' },
      { status: 500 }
    );
  }
}

function generateNewsletterHTML(newsletter: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    /* Mobile styles */
    @media screen and (max-width: 600px) {
      .mobile-hide { display: none !important; }
      .mobile-center { text-align: center !important; }
      .container { width: 100% !important; max-width: 100% !important; }
      .content { padding: 10px !important; }
      h1 { font-size: 24px !important; }
      h2 { font-size: 20px !important; }
      .button { width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${newsletter.preheader}
  </div>
  
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 40px 20px 20px 20px;">
              <img src="https://ivcaccounting.com/logo.png" alt="IVC Accounting" width="200" style="display: block;">
            </td>
          </tr>
          
          <!-- Main Content -->
          ${newsletter.sections.map((section: any) => {
            switch (section.type) {
              case 'header':
                return `
          <tr>
            <td class="content" style="padding: 20px 40px;">
              <h1 style="color: #333333; font-size: 28px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
                ${section.content}
              </h1>
            </td>
          </tr>`;
              
              case 'content':
                return `
          <tr>
            <td class="content" style="padding: 0 40px 20px 40px;">
              <div style="color: #555555; font-size: 16px; line-height: 1.6;">
                ${section.content}
              </div>
            </td>
          </tr>`;
              
              case 'cta':
                return `
          <tr>
            <td align="center" style="padding: 30px 40px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 4px; background-color: #7C3AED;">
                    <a href="${newsletter.cta.url}" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;">
                      ${newsletter.cta.text}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
              
              case 'footer':
                return `
          <tr>
            <td style="padding: 40px 40px 30px 40px; border-top: 1px solid #eeeeee;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="color: #999999; font-size: 14px; line-height: 1.5;">
                    ${section.content}
                    <br><br>
                    IVC Accounting | 123 Main St, Suite 100 | City, State 12345
                    <br>
                    <a href="{unsubscribe_url}" style="color: #999999; text-decoration: underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
              
              default:
                return '';
            }
          }).join('')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}