import { PrismaClient } from '@prisma/client';
import { generateHashCode } from '../utils/generateCode';
import { config } from '../utils/config';

export async function createShortUrl(originalUrl: string, prisma: PrismaClient, expiresAt?: string) {
    const existing = await prisma.url.findUnique({ where: { originalUrl } });
    if (existing) return existing;

    const shortCode = generateHashCode(originalUrl, config.CODE_LENGTH);
    return prisma.url.create({ data: { originalUrl, shortCode, expiresAt: expiresAt ? new Date(expiresAt) : null, } });
}

export async function getUrls(prisma: PrismaClient, page: number, limit: number) {
    return prisma.url.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
    });
}
