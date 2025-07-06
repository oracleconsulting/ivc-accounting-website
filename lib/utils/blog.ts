export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
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