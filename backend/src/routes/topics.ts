import { FastifyInstance } from 'fastify';
import { fetchFeeds, RawArticle } from '../services/rss';
import { getCache, setCache } from '../utils/cache';

export default async function topicRoutes(fastify: FastifyInstance) {
  fastify.get('/topics', async (request, reply) => {
    const cacheKey = 'aggregated_topics';
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const articles = await fetchFeeds();
      const topicCounts: Record<string, number> = {};

      articles.forEach((article) => {
        // Count category as a topic too for the filter bar
        if (article.category) {
          topicCounts[article.category] = (topicCounts[article.category] || 0) + 1;
        }
        
        article.topics.forEach((topic) => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      });

      const aggregated = Object.entries(topicCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setCache(cacheKey, aggregated);
      return aggregated;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to aggregate topics' });
    }
  });
}
