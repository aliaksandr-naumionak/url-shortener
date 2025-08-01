import buildTestServer from './setup';
import request from 'supertest';

const app = buildTestServer();

beforeAll(async () => {
    await app.ready();
});

afterAll(async () => {
    await app.close();
});

describe('POST /api/shorten', () => {
    it('should return a shortUrl', async () => {
        const res = await request(app.server)
            .post('/api/shorten')
            .send({ originalUrl: 'https://example.com' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('shortUrl');
    });

    it('should return 400 for invalid url', async () => {
        const res = await request(app.server)
            .post('/api/shorten')
            .send({ originalUrl: 'not-a-url' });

        expect(res.statusCode).toBe(400);
    });
});
