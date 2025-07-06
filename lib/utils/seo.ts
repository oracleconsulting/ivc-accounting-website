export async function analyzeSEO(data: {
  title: string;
  content: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}) {
  let score = 0;
  const suggestions: string[] = [];

  // Title checks
  if (data.seo_title.length >= 50 && data.seo_title.length <= 60) {
    score += 20;
  } else {
    suggestions.push('SEO title should be between 50-60 characters');
  }

  // Description checks
  if (data.seo_description.length >= 120 && data.seo_description.length <= 160) {
    score += 20;
  } else {
    suggestions.push('Meta description should be between 120-160 characters');
  }

  // Content length
  const wordCount = data.content.split(/\s+/).length;
  if (wordCount >= 300) {
    score += 20;
  } else {
    suggestions.push('Content should be at least 300 words');
  }

  // Keyword density
  const contentLower = data.content.toLowerCase();
  const keywordDensity = data.seo_keywords.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  ).length / Math.max(data.seo_keywords.length, 1);

  if (keywordDensity >= 0.7) {
    score += 20;
  } else {
    suggestions.push('Include more of your focus keywords in the content');
  }

  // Headers check
  const hasH2 = /<h2/i.test(data.content);
  if (hasH2) {
    score += 20;
  } else {
    suggestions.push('Add at least one H2 heading to structure your content');
  }

  return { score, suggestions };
}

export async function generateMetaDescription(title: string, content: string): Promise<string> {
  // Simple implementation - in production, use OpenRouter API
  const excerpt = content.substring(0, 160).replace(/\s+\w*$/, '');
  return excerpt.length > 0 ? excerpt : title.substring(0, 160);
}

export async function suggestKeywords(content: string): Promise<string[]> {
  const words = content.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    if (word.length > 4 && !STOP_WORDS.includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

const STOP_WORDS = [
  'about', 'after', 'before', 'between', 'during', 'under', 'again', 
  'further', 'then', 'once', 'the', 'and', 'or', 'but', 'in', 'on', 
  'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can'
]; 