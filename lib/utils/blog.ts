/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Calculate estimated read time based on word count
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadTime(text: string): number {
  const wordsPerMinute = 225;
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime); // Minimum 1 minute
}

/**
 * Extract plain text from HTML content
 */
export function extractTextFromHTML(html: string): string {
  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Try to break at a word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Format date for display
 */
export function formatPostDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Get reading level (Flesch Reading Ease approximation)
 */
export function getReadingLevel(text: string): {
  score: number;
  level: string;
  description: string;
} {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.trim().split(/\s+/);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);
  
  const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
  const avgSyllablesPerWord = syllables / Math.max(1, words.length);
  
  // Flesch Reading Ease formula
  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  
  let level, description;
  if (score >= 90) {
    level = 'Very Easy';
    description = '5th grade level';
  } else if (score >= 80) {
    level = 'Easy';
    description = '6th grade level';
  } else if (score >= 70) {
    level = 'Fairly Easy';
    description = '7th grade level';
  } else if (score >= 60) {
    level = 'Standard';
    description = '8th-9th grade level';
  } else if (score >= 50) {
    level = 'Fairly Difficult';
    description = '10th-12th grade level';
  } else if (score >= 30) {
    level = 'Difficult';
    description = 'College level';
  } else {
    level = 'Very Difficult';
    description = 'University graduate level';
  }
  
  return { 
    score: Math.max(0, Math.min(100, Math.round(score))), 
    level, 
    description 
  };
}

// Helper function to count syllables in a word
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = /[aeiou]/.test(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Adjust for silent e
  if (word.endsWith('e')) {
    count--;
  }
  
  // Ensure at least one syllable
  return Math.max(1, count);
}

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
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