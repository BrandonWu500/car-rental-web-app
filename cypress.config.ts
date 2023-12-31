import { resetDB } from '@/prisma/reset-db';
import { seed, seedMany } from '@/prisma/seed';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        'db:reset': () => resetDB().then(() => null),
        seed: () => seed().then(() => null),
        seedMany: () => seedMany().then(() => null),
      });
    },
    baseUrl: 'http://localhost:3000',
  },
});
