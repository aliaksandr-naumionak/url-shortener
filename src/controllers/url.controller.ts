import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { createShortUrl, getUrls } from '../services/url.service';
import { config } from '../utils/config';

const shortenSchema = z.object({
    originalUrl: z.string().url(),
});

const paginationSchema = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(config.DEFAULT_PAGE),
        limit: z.coerce.number().min(1).max(100).default(config.DEFAULT_LIMIT),
    }),
});

export async function shortenUrl(req: FastifyRequest, reply: FastifyReply) {
    const parse = shortenSchema.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid URL' });

    const { originalUrl } = parse.data;
    const result = await createShortUrl(originalUrl, req.server.prisma);
    reply.send({ shortUrl: `${config.BASE_URL}/${result.shortCode}` });
}

export async function getAllUrls(req: FastifyRequest, reply: FastifyReply) {
    const parse = paginationSchema.safeParse(req);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid pagination params' });

    const { page, limit } = parse.data.query;
    const urls = await getUrls(req.server.prisma, page, limit);
    reply.send(urls);
}