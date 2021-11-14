import XMLWriter from 'xml-writer';
import { getEntries } from '$lib/content';
import { getUrl } from '$lib/utils';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ host }) {
  const entries = await getEntries();

  const xw = new XMLWriter();

  const el = (tag, children) => {
    xw.startElement(tag);
    if (typeof children === 'function') {
      children();
    } else {
      xw.text(children);
    }
    xw.endElement();
  };

  const addUrl = (url) => {
    el('url', () => {
      el('loc', url);
      el('changefreq', 'daily');
      el('priority', 0.7);
    });
  };

  xw.startDocument('1.0', 'UTF-8');
  xw.startElement('urlset');
  xw.writeAttribute('xmlns', 'https://www.sitemaps.org/schemas/sitemap/0.9');
  entries
    .map((entry) => entry.metadata.path)
    .concat(['/blog'])
    .forEach((path) => addUrl(getUrl(host, path)));
  xw.endElement();
  xw.endDocument();

  return {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml',
    },
    body: xw.toString(),
  };
}
