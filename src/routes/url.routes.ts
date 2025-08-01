import { FastifyInstance } from 'fastify';
import { shortenUrl, getAllUrls, redirectToOriginalUrl } from '../controllers/url.controller';

export default async function urlRoutes(fastify: FastifyInstance) {
    fastify.post('/shorten', {
        schema: {
            summary: 'Create a shortened URL',
            body: {
                type: 'object',
                required: ['originalUrl'],
                properties: {
                    originalUrl: { type: 'string', format: 'uri' },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        shortUrl: { type: 'string' },
                    },
                },
                400: {
                    description: 'Invalid input',
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
        handler: shortenUrl,
    });
    fastify.get('/urls', {
        schema: {
            summary: 'Get paginated list of shortened URLs',
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        urls: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    originalUrl: { type: 'string' },
                                    shortCode: { type: 'string' },
                                    createdAt: { type: 'string', format: 'date-time' },
                                    expiresAt: { type: 'string', format: 'date-time', nullable: true },
                                    hitCount: { type: 'number' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid pagination parameters',
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
        handler: getAllUrls,
    });

    fastify.get('/:code', {
        schema: {
            summary: 'Redirect to original URL',
            params: {
                type: 'object',
                properties: {
                    code: { type: 'string' },
                },
                required: ['code'],
            },
            response: {
                302: {
                    type: 'null',
                    description: 'Redirect to the original URL',
                },
                404: {
                    description: 'Short code not found or expired',
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
        handler: redirectToOriginalUrl,
    });
}