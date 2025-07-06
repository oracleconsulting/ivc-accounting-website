export async function streamCompletion({
  messages,
  model = 'claude-3-sonnet',
  temperature = 0.7,
  max_tokens = 1000
}: {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://ivcaccounting.co.uk',
      'X-Title': 'IVC Blog System',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      stream: false
    }),
  });

  if (!response.ok) {
    throw new Error('OpenRouter API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function analyzeTone(posts: string[]): Promise<string> {
  const prompt = `Analyze the writing style and tone of these blog posts and provide guidelines for maintaining consistency:

${posts.join('\n\n---\n\n')}

Provide specific guidance on:
1. Vocabulary and word choice
2. Sentence structure and length
3. Tone and voice characteristics
4. Common phrases or expressions
5. Level of formality`;

  return streamCompletion({
    messages: [{ role: 'user', content: prompt }],
    model: 'claude-3-opus',
    temperature: 0.3
  });
} 