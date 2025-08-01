import * as dotenv from 'dotenv';
import Fastify from 'fastify';
import FastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
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

async function main() {
    try {
        // Register rate limiting globally
        await server.register(FastifyRateLimit, {
            max: config.RATE_LIMIT_MAX,
            timeWindow: config.RATE_LIMIT_WINDOW,
            errorResponseBuilder: () => ({
                statusCode: 429,
                error: 'Too Many Requests',
                message: 'You have exceeded the request limit.',
            }),
        });

        // Register Prisma plugin for DB access
        await server.register(prismaPlugin);

        // Register Swagger documentation
        await server.register(fastifySwagger, {
            openapi: {
                info: {
                    title: 'URL Shortener API',
                    description: 'Fastify service to shorten and redirect URLs',
                    version: '1.0.0',
                },
            },
            exposeRoute: true,
            routePrefix: '/docs',
            staticCSP: false,
            uiConfig: {
                docExpansion: 'list',
                deepLinking: false,
            },
        });


        // Register API routes
        await server.register(urlRoutes, { prefix: '/api' });

        // Start the Fastify server
        await server.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err, 'Failed to start server');
        process.exit(1);
    }
}

main();