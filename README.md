# URL Shortener Microservice

A simple, performant URL shortener service built with **Fastify**, **TypeScript**, and **Prisma (SQLite)**.

## Features

- Shorten long URLs to short codes
- Redirect from short code to original URL
- Persistent storage with SQLite
- Built with Fastify (high performance)
- Dockerized for consistent deployment
- Optional extras:
    - Avoids duplicate entries
    - Link expiration
    - Hit counter
    - Input validation with Zod

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/) (if not already included)

---

### Local Development (with Docker)

```bash
# Clone the repo
git clone https://github.com/yourname/url-shortener.git
cd url-shortener

# Start the service
docker-compose up --build
```

### Local Development (without Docker)

```bash
# Clone the repo
git clone https://github.com/yourname/url-shortener.git
cd url-shortener

npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```
