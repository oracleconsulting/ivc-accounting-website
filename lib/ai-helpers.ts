// AI Assistant State Management
export interface AIAssistantState {
  researchNotes?: string;
  improvementSuggestions?: string;
  appliedChanges: string[];
  reviewData?: any;
}

// Function to merge all AI suggestions into a cohesive review
export async function performIntegratedReview(
  content: string,
  aiState: AIAssistantState,
  keywords: string[]
) {
  const response = await fetch('/api/ai/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      keywords,
      previousSuggestions: {
        research: aiState.researchNotes,
        improvements: aiState.improvementSuggestions
      },
      reviewType: 'integrated'
    }),
  });

  if (!response.ok) throw new Error('Integrated review failed');
  return response.json();
}

// Function to generate meta description
export async function generateMetaDescription(content: string, keywords: string[]) {
  const response = await fetch('/api/ai/writing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Generate SEO meta description',
      outline: `Create a compelling meta description for this content: ${content.substring(0, 500)}...`,
      tone: 'SEO optimized',
      targetAudience: 'Search engine users',
      keywords: keywords
    }),
  });

  if (!response.ok) throw new Error('Meta description generation failed');
  const data = await response.json();
  return data.content;
}

// Function to create social media posts
export async function generateSocialMediaPosts(content: string, platforms: string[]) {
  const response = await fetch('/api/ai/social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blogTitle: 'Blog Post',
      blogContent: content.substring(0, 1000),
      platforms: platforms,
      businessInfo: 'IVC Accounting - Chartered Accountants in Halstead, Essex'
    }),
  });

  if (!response.ok) throw new Error('Social media generation failed');
  const data = await response.json();
  return data.posts;
}

// Function to simplify complex sentences
export async function simplifyContent(content: string) {
  const response = await fetch('/api/ai/writing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Simplify complex sentences',
      outline: `Rewrite this content in simpler, clearer language: ${content}`,
      tone: 'Clear and simple',
      targetAudience: 'General audience',
      keywords: []
    }),
  });

  if (!response.ok) throw new Error('Content simplification failed');
  const data = await response.json();
  return data.content;
}

// Function to suggest internal links
export async function suggestInternalLinks(content: string, existingPages: string[]) {
  const response = await fetch('/api/ai/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Internal linking opportunities',
      researchType: 'content analysis',
      targetAudience: 'Content editors'
    }),
  });

  if (!response.ok) throw new Error('Internal link suggestions failed');
  const data = await response.json();
  return data.content;
}

// Content scoring utilities
export function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = countSyllables(text);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let count = 0;
  
  for (const word of words) {
    count += countWordSyllables(word);
  }
  
  return count;
}

function countWordSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// SEO analysis utilities
export function analyzeKeywordDensity(text: string, keywords: string[]) {
  const words = text.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  
  return keywords.map(keyword => {
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    let count = 0;
    
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      let match = true;
      for (let j = 0; j < keywordWords.length; j++) {
        if (words[i + j] !== keywordWords[j]) {
          match = false;
          break;
        }
      }
      if (match) count++;
    }
    
    const density = (count / totalWords) * 100;
    const optimal = density >= 0.5 && density <= 2.5; // Optimal range for most keywords
    
    return {
      keyword,
      count,
      density: Math.round(density * 100) / 100,
      optimal
    };
  });
}

// Brand voice analysis
export function analyzeBrandVoice(text: string): number {
  const brandKeywords = [
    'proactive', 'protective', 'fight', 'passionate', 'success',
    'other accountants file', 'we fight', 'chartered', 'expert',
    'specialist', 'professional', 'trusted', 'reliable'
  ];
  
  const textLower = text.toLowerCase();
  let brandScore = 0;
  
  brandKeywords.forEach(keyword => {
    const count = (textLower.match(new RegExp(keyword, 'g')) || []).length;
    brandScore += count * 10; // 10 points per brand keyword
  });
  
  // Normalize to 0-100 scale
  const normalizedScore = Math.min(100, brandScore);
  
  return Math.round(normalizedScore);
} 