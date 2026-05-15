import { RawArticle } from './rss';

export const normalizeArticles = (articles: RawArticle[]): RawArticle[] => {
  // Deduplicate by URL or Title
  const seen = new Set<string>();
  const uniqueArticles = articles.filter((article) => {
    const key = article.url || article.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date (latest first)
  return uniqueArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
};
