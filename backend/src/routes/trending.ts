import { FastifyInstance } from 'fastify';
import { calculateTrending } from '../services/trending';
import { getCache } from '../utils/cache';
import { RawArticle } from '../services/rss';

export default async function trendingRoutes(fastify: FastifyInstance) {
  fastify.get('/trending', async (request, reply) => {
    const articles = getCache<RawArticle[]>('articles_feed_v2') || [];
    const trending = calculateTrending(articles);
    return trending;
  });
}
