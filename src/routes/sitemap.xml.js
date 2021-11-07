import { getEntries } from '$lib/content';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ host }) {
  const entries = await getEntries();

  const url = (path) => 'https://' + host + path;

  return {
    headers: {
      'Content-Type': 'application/xml',
    },
    body: sitemap(entries.map((entry) => url(entry.metadata.path)).concat([url('/blog')])),
  };
}

function sitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url}</loc>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
</url>`
  )
  .join('\n')}
</urlset>`;
}
