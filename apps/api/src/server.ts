import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { getEnv } from './env.js';
import { sendError } from './error-envelope.js';
import { healthRoutes } from './routes/health.js';
import { registerSockets } from './sockets/index.js';

export async function buildServer(): Promise<FastifyInstance> {
  const env = getEnv();

  const fastify = Fastify({
    logger: { level: env.logLevel },
  }).withTypeProvider<ZodTypeProvider>();

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  await fastify.register(cors, {
    origin: env.corsOrigins.length > 0 ? env.corsOrigins : '*',
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE'],
  });

  fastify.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      sendError(reply, 400, 'validation', error.message);
      return;
    }
    request.log.error({ err: error }, 'unhandled request error');
    sendError(reply, 500, 'internal', 'Internal server error');
  });

  fastify.setNotFoundHandler((request, reply) => {
    sendError(reply, 404, 'not_found', `Route ${request.method}:${request.url} not found`);
  });

  await fastify.register(
    async (v1) => {
      await v1.register(healthRoutes);
    },
    { prefix: '/v1' },
  );

  await registerSockets(fastify);

  return fastify;
}
