import { FastifyInstance } from 'fastify';
import { shortenUrl, getAllUrls } from '../controllers/url.controller';

export default async function urlRoutes(fastify: FastifyInstance) {
    fastify.post('/shorten', shortenUrl);
    fastify.get('/urls', getAllUrls);
    fastify.get('/:code', async (req, reply) => {
        const { code } = req.params as { code: string };
        const url = await fastify.prisma.url.findUnique({ where: { shortCode: code } });

        if (!url || (url.expiresAt && new Date() > url.expiresAt)) {
            return reply.code(404).send({ error: 'URL not found or expired' });
        }

        await fastify.prisma.url.update({
            where: { id: url.id },
            data: { hitCount: { increment: 1 } },
        });

        reply.redirect(url.originalUrl);
    });
}