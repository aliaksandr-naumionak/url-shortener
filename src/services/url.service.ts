import { PrismaClient } from '@prisma/client';
import { generateHashCode } from '../utils/generateCode';
import { config } from '../utils/config';

export async function createShortUrl(originalUrl: string, prisma: PrismaClient) {
    const existing = await prisma.url.findUnique({ where: { originalUrl } });
    if (existing) return existing;

    const shortCode = generateHashCode(originalUrl, config.CODE_LENGTH);
    return prisma.url.create({ data: { originalUrl, shortCode } });
}

export async function getUrls(prisma: PrismaClient) {
    return prisma.url.findMany();
}
