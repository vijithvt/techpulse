import { RawArticle } from './rss';

export interface ScoredArticle extends RawArticle {
  score: number;
}

export const searchArticles = (articles: RawArticle[], query: string): RawArticle[] => {
  if (!query) return articles;

  const normalizedQuery = query.toLowerCase().trim();
  const keywords = normalizedQuery.split(/\s+/);

  const scoredResults: ScoredArticle[] = articles.map(article => {
    let score = 0;
    const title = article.title.toLowerCase();
    const description = (article.description || '').toLowerCase();
    const topics = article.topics.map(t => t.toLowerCase());
    const source = article.source.toLowerCase();

    // Check each keyword
    keywords.forEach(keyword => {
      // Title match (Highest priority)
      if (title.includes(keyword)) {
        score += 5;
        // Bonus for exact word match in title
        if (new RegExp(`\\b${keyword}\\b`).test(title)) score += 2;
      }

      // Topic match (Medium priority)
      if (topics.some(t => t.includes(keyword))) {
        score += 3;
      }

      // Description match (Lower priority)
      if (description.includes(keyword)) {
        score += 1;
      }

      // Source match (Optional)
      if (source.includes(keyword)) {
        score += 1;
      }
    });

    return { ...article, score };
  });

  // Filter out zero scores and sort
  return scoredResults
    .filter(a => a.score > 0)
    .sort((a, b) => {
      // 1. Sort by score (Relevance)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // 2. Sort by date (Recency)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
};
