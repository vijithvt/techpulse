import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { generateLinkedInPost, LinkedInMode } from "../services/ai";

interface GenerateBody {
  title: string;
  description: string;
  topics: string[];
  mode: LinkedInMode;
  includeHashtags?: boolean;
  isShortVersion?: boolean;
}

export default async function linkedinRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/generate",
    async (request: FastifyRequest<{ Body: GenerateBody }>, reply: FastifyReply) => {
      const { title, description, topics, mode, includeHashtags, isShortVersion } = request.body;

      if (!title) {
        return reply.status(400).send({ error: "Title is required" });
      }

      try {
        const post = await generateLinkedInPost(title, description, topics, mode, includeHashtags, isShortVersion);
        return { post };
      } catch (error: any) {
        return reply.status(500).send({ error: error.message });
      }
    }
  );
}
