import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { createShortUrl, getUrls } from '../services/url.service';
import { config } from '../utils/config';

const shortenSchema = z.object({
    originalUrl: z.string().url(),
});

export async function shortenUrl(req: FastifyRequest, reply: FastifyReply) {
    const parse = shortenSchema.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid URL' });

    const { originalUrl } = parse.data;
    const result = await createShortUrl(originalUrl, req.server.prisma);
    reply.send({ shortUrl: `${config.BASE_URL}/${result.shortCode}` });
}

export async function getAllUrls(req: FastifyRequest, reply: FastifyReply) {
    const urls = await getUrls(req.server.prisma);
    reply.send(urls);
}