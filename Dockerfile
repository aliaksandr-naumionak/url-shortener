FROM node:20-alpine

# Create app directory
WORKDIR /app
# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Build Prisma client
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Run app in dev mode
CMD ["npx", "ts-node-dev", "src/server.ts"]