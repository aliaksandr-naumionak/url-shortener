import Fastify from 'fastify';
import urlRoutes from './routes/url.routes';
import prismaPlugin from './plugins/prisma';
import * as dotenv from 'dotenv';

dotenv.config();

const server = Fastify({ logger: true });

server.register(prismaPlugin);
server.register(urlRoutes, { prefix: '/api' });

server.listen({ port: 3000 }, err => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
