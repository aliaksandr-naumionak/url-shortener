import * as dotenv from 'dotenv';
import Fastify from 'fastify';
import FastifyRateLimit from '@fastify/rate-limit';
import urlRoutes from './routes/url.routes';
import prismaPlugin from './plugins/prisma';
import { config } from './utils/config';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

const server = Fastify({
    logger: isDev
        ? {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                },
            },
            base: {
                service: 'url-shortener',
                env: process.env.NODE_ENV || 'development',
            },
        }
        : {
            level: 'info',
            base: {
                service: 'url-shortener',
                env: process.env.NODE_ENV || 'production',
            },
        },
});

server.register(FastifyRateLimit, {
    max: config.RATE_LIMIT_MAX, // max requests
    timeWindow: config.RATE_LIMIT_WINDOW, // per time window
    errorResponseBuilder: () => ({
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'You have exceeded the request limit.',
    }),
});

server.register(prismaPlugin);
server.register(urlRoutes, { prefix: '/api' });

server.setErrorHandler((error, req, reply) => {
    req.log.error(error, 'Unhandled error');
    reply.status(500).send({ error: 'Internal Server Error' });
});

server.listen({ port: 3000 }, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
