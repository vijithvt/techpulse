import { RawArticle } from './rss';
import NodeCache from 'node-cache';

const trendCache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

export interface TrendingTopic {
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  growth?: number;
}

export const calculateTrending = (articles: RawArticle[]): TrendingTopic[] => {
  const cached = trendCache.get<TrendingTopic[]>('trending_topics');
  if (cached) return cached;

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const prev24h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  let currentArticles = articles.filter(a => new Date(a.publishedAt) > last24h);
  let previousArticles = articles.filter(a => {
    const date = new Date(a.publishedAt);
    return date > prev24h && date <= last24h;
  });

  // Fallback: If no recent articles, use all articles to populate the trending list
  if (currentArticles.length === 0) {
    currentArticles = articles;
    previousArticles = []; // No comparison for old articles
  }

  const getTopicCounts = (articleList: RawArticle[]) => {
    const counts: Record<string, number> = {};
    articleList.forEach(a => {
      a.topics.forEach(topic => {
        counts[topic] = (counts[topic] || 0) + 1;
      });
      if (a.category && a.category !== 'All') {
        counts[a.category] = (counts[a.category] || 0) + 1;
      }
    });
    return counts;
  };

  const currentCounts = getTopicCounts(currentArticles);
  const previousCounts = getTopicCounts(previousArticles);

  const trending: TrendingTopic[] = Object.entries(currentCounts)
    .map(([name, count]) => {
      const prevCount = previousCounts[name] || 0;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      let growth = 0;
      
      if (prevCount > 0) {
        growth = Math.round(((count - prevCount) / prevCount) * 100);
      } else if (count > 0 && previousArticles.length > 0) {
        growth = 100; // New topic in this period
      }

      if (count > prevCount && prevCount > 0) trend = 'up';
      else if (count < prevCount && prevCount > 0) trend = 'down';
      else if (count > 2 && prevCount === 0) trend = 'up';

      return { name, count, trend, growth };
    })
    .filter(item => item.count > 0) // Show all topics found
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  trendCache.set('trending_topics', trending);
  return trending;
};
