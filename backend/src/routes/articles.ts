import { FastifyInstance } from 'fastify';
import { RSS_SOURCES } from '../config';
import { fetchFeeds, RawArticle } from '../services/rss';
import { normalizeArticles } from '../services/normalize';
import { searchArticles } from '../services/search';
import { getCache, setCache } from '../utils/cache';

export default async function articleRoutes(fastify: FastifyInstance) {
  fastify.get('/articles', async (request, reply) => {
    const { category, topics, sources, q, region, important } = request.query as {
      category?: string;
      topics?: string;
      sources?: string;
      q?: string;
      region?: string;
      important?: string;
    };

    const cacheKey = 'articles_feed_v2';
    const cachedData = getCache<RawArticle[]>(cacheKey);

    let articles: RawArticle[];

    if (cachedData) {
      articles = cachedData;
    } else {
      try {
        const rawArticles = await fetchFeeds();
        articles = normalizeArticles(rawArticles);
        setCache(cacheKey, articles);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Failed to fetch articles' });
      }
    }

    // Apply filters
    let filtered = articles;

    if (region && region !== 'all') {
      filtered = filtered.filter(a => a.region === region.toLowerCase());
    }

    if (important === 'true') {
      filtered = filtered.filter(a => a.isImportant);
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category === category);
    }

    if (sources) {
      const sourceList = sources.split(',').map(s => s.trim());
      filtered = filtered.filter(a => sourceList.includes(a.source));
    }

    // Apply Search Logic SECOND (includes scoring and filtering)
    if (q) {
      filtered = searchArticles(filtered, q);
    } else {
      // If NOT searching, sort by recency globally
      filtered = filtered.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    // Apply Topic filters LAST
    if (topics) {
      const topicList = topics.split(',').map(t => t.trim());
      filtered = filtered.filter(a => 
        topicList.every(t => a.topics.includes(t) || a.category === t)
      );
    }

    return filtered.slice(0, 100); // Limit results
  });
}
