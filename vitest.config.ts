import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.test.ts'],
        coverage: {
            provider: 'c8',
            reporter: ['text', 'html'],
        },
    },
});