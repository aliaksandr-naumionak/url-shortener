import Fastify from 'fastify';
import prismaPlugin from '../src/plugins/prisma';
import urlRoutes from '../src/routes/url.routes';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default function buildTestServer() {
    const app = Fastify({ logger: false });

    app.register(prismaPlugin);
    app.register(urlRoutes, { prefix: '/api' });

    return app;
}
