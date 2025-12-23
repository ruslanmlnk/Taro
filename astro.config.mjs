// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  host: '0.0.0.0', // Or simply host: true
  port: 4321,
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    envDir: '.'
  }
});
