import crypto from 'crypto';

export function generateHashCode(input: string, length = 6): string {
    return crypto.createHash('sha256')
        .update(input)
        .digest('base64url')
        .slice(0, length);
}