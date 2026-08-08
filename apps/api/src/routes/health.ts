import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const healthResponseSchema = z.object({ ok: z.literal(true) });

export const healthRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get('/health', { schema: { response: { 200: healthResponseSchema } } }, async () => ({
    ok: true as const,
  }));
};
