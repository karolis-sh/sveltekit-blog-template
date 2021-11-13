import { getEntries } from '$lib/content';
import { getUrl } from '$lib/utils';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ host }) {
  const entries = await getEntries();

  return {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml',
    },
    body: sitemap(
      entries.map((entry) => getUrl(host, entry.metadata.path)).concat([getUrl(host, '/blog')])
    ),
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
