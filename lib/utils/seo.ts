interface SEOAnalysis {
  score: number;
  suggestions: string[];
}

/**
 * Analyze SEO performance of a post
 */
export async function analyzeSEO(data: {
  title: string;
  content: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}): Promise<SEOAnalysis> {
  const suggestions: string[] = [];
  let score = 100;

  // Title checks
  if (!data.seo_title) {
    suggestions.push('Add an SEO title');
    score -= 10;
  } else if (data.seo_title.length > 60) {
    suggestions.push('SEO title is too long (max 60 characters)');
    score -= 5;
  } else if (data.seo_title.length < 30) {
    suggestions.push('SEO title is too short (aim for 30-60 characters)');
    score -= 5;
  }

  // Description checks
  if (!data.seo_description) {
    suggestions.push('Add a meta description');
    score -= 15;
  } else if (data.seo_description.length > 160) {
    suggestions.push('Meta description is too long (max 160 characters)');
    score -= 5;
  } else if (data.seo_description.length < 120) {
    suggestions.push('Meta description is too short (aim for 120-160 characters)');
    score -= 5;
  }

  // Keywords checks
  if (data.seo_keywords.length === 0) {
    suggestions.push('Add focus keywords');
    score -= 10;
  } else if (data.seo_keywords.length > 5) {
    suggestions.push('Too many keywords (aim for 3-5)');
    score -= 5;
  }

  // Content checks
  const wordCount = data.content.trim().split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push('Content is too short (aim for at least 300 words)');
    score -= 20;
  }

  // Check keyword density
  if (data.seo_keywords.length > 0) {
    const contentLower = data.content.toLowerCase();
    const keywordDensity = data.seo_keywords.reduce((total, keyword) => {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
      const matches = contentLower.match(regex);
      return total + (matches ? matches.length : 0);
    }, 0) / wordCount * 100;

    if (keywordDensity < 0.5) {
      suggestions.push('Keywords appear too rarely in content');
      score -= 10;
    } else if (keywordDensity > 3) {
      suggestions.push('Keywords appear too frequently (keyword stuffing)');
      score -= 15;
    }
  }

  // Check for headings
  if (!data.content.includes('##')) {
    suggestions.push('Add headings to structure your content');
    score -= 10;
  }

  return {
    score: Math.max(0, score),
    suggestions
  };
}

/**
 * Generate meta description from content
 */
export async function generateMetaDescription(title: string, content: string): Promise<string> {
  // Remove markdown/HTML
  const cleanContent = content
    .replace(/#{1,6}\s/g, '') // Remove markdown headings
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  // Try to find the first meaningful sentence
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  if (sentences.length > 0) {
    // Use first sentence, truncated to fit
    return truncateText(sentences[0].trim(), 155);
  }
  
  // Fallback: use title + beginning of content
  const fallback = `${title}. ${cleanContent}`;
  return truncateText(fallback, 155);
}

/**
 * Suggest keywords based on content
 */
export async function suggestKeywords(content: string): Promise<string[]> {
  // Simple keyword extraction based on word frequency
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 4) // Only words with 5+ characters
    .filter(word => !commonWords.includes(word)); // Remove common words

  // Count word frequency
  const wordFreq = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort by frequency and return top 5
  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

// Common words to exclude from keyword suggestions
const commonWords = [
  'about', 'after', 'again', 'against', 'all', 'also', 'although', 'always',
  'another', 'any', 'anyone', 'anything', 'around', 'because', 'been', 'before',
  'being', 'between', 'both', 'came', 'come', 'could', 'did', 'does', 'doing',
  'done', 'each', 'either', 'else', 'every', 'everyone', 'everything', 'from',
  'get', 'getting', 'given', 'gives', 'goes', 'going', 'had', 'has', 'have',
  'having', 'here', 'how', 'however', 'into', 'its', 'just', 'keep', 'kept',
  'know', 'known', 'knows', 'last', 'later', 'least', 'less', 'like', 'likely',
  'made', 'make', 'makes', 'making', 'many', 'may', 'maybe', 'might', 'more',
  'most', 'much', 'must', 'need', 'needs', 'never', 'next', 'nothing', 'now',
  'often', 'once', 'one', 'only', 'other', 'others', 'our', 'out', 'over',
  'own', 'perhaps', 'please', 'rather', 'really', 'said', 'same', 'says', 'see',
  'seem', 'seemed', 'seems', 'seen', 'several', 'she', 'should', 'show', 'shown',
  'shows', 'since', 'some', 'someone', 'something', 'somewhere', 'still', 'such',
  'sure', 'take', 'taken', 'takes', 'taking', 'than', 'that', 'the', 'their',
  'them', 'then', 'there', 'therefore', 'these', 'they', 'thing', 'things',
  'think', 'thinks', 'this', 'those', 'though', 'thought', 'through', 'thus',
  'too', 'took', 'toward', 'towards', 'under', 'until', 'upon', 'use', 'used',
  'uses', 'using', 'very', 'want', 'wanted', 'wants', 'was', 'way', 'ways',
  'well', 'went', 'were', 'what', 'whatever', 'when', 'where', 'whether',
  'which', 'while', 'who', 'whom', 'whose', 'why', 'will', 'with', 'within',
  'without', 'would', 'year', 'years', 'your'
];

// Helper function for truncating text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
} 