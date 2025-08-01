import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { createShortUrl, getUrls } from '../services/url.service';
import { config } from '../utils/config';

const shortenSchema = z.object({
    originalUrl: z.string().url(),
    expiresAt: z.string().datetime().optional()
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

    const { originalUrl, expiresAt } = parse.data;
    const result = await createShortUrl(originalUrl, req.server.prisma, expiresAt);
    reply.send({ shortUrl: `${config.BASE_URL}/api/${result.shortCode}` });
}

export async function getAllUrls(req: FastifyRequest, reply: FastifyReply) {
    const parse = paginationSchema.safeParse(req);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid pagination params' });

    const { page, limit } = parse.data.query;

    const [urls, total] = await Promise.all([
        getUrls(req.server.prisma, page, limit),
        req.server.prisma.url.count(),
    ]);

    reply.send({
        page,
        limit,
        total,
        urls,
    });
}

export async function redirectToOriginalUrl(req: FastifyRequest, reply: FastifyReply) {
    const { code } = req.params as { code: string };
    const prisma = req.server.prisma;
    const url = await prisma.url.findUnique({ where: { shortCode: code } });

    if (!url || (url.expiresAt && new Date() > url.expiresAt)) {
        return reply.code(404).send({ error: 'URL not found or expired' });
    }

    await prisma.url.update({
        where: { id: url.id },
        data: { hitCount: { increment: 1 } },
    });

    reply.redirect(url.originalUrl);
}