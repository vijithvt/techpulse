import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import articleRoutes from './routes/articles';
import topicRoutes from './routes/topics';
import trendingRoutes from './routes/trending';
import linkedinRoutes from './routes/linkedin';
import { PORT } from './config';

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
    });

    await fastify.register(articleRoutes, { prefix: '/api' });
    await fastify.register(topicRoutes, { prefix: '/api' });
    await fastify.register(trendingRoutes, { prefix: '/api' });
    await fastify.register(linkedinRoutes, { prefix: '/api/linkedin' });

    await fastify.listen({ port: Number(PORT), host: '127.0.0.1' });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
 
