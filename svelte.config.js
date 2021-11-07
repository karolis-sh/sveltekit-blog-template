import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    mdsvex(mdsvexConfig),
    [
      preprocess({
        postcss: true,
      }),
    ],
  ],

  kit: {
    host: dev ? 'localhost:3000' : 'karolis.sh',
    target: '#svelte',
    adapter: adapter(),
    vite: { server: { fs: { allow: ['content'] } } },
  },
};

export default config;

// Workaround until SvelteKit uses Vite 2.3.8 (and it's confirmed to fix the Tailwind JIT problem)
process.env.TAILWIND_MODE = dev ? 'watch' : 'build';
