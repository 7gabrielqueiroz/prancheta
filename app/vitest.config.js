import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', testTimeout: 600000, include: ['tests/**/*.test.js'] } });
