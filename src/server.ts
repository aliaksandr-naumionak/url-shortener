import Fastify from 'fastify';

const server = Fastify({ logger: true });

server.listen({ port: 3000 }, err => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
