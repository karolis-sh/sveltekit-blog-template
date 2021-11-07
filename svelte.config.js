import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-cloudflare-workers';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [mdsvex(mdsvexConfig), [preprocess({ postcss: true })]],
  kit: {
    host: dev ? 'localhost:3000' : 'svelte-test.ksh.workers.dev',
    target: '#svelte',
    adapter: adapter(),
    vite: { server: { fs: { allow: ['content'] } } },
  },
};

export default config;

// Workaround until SvelteKit uses Vite 2.3.8 (and it's confirmed to fix the Tailwind JIT problem)
process.env.TAILWIND_MODE = dev ? 'watch' : 'build';
