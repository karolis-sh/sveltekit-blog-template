import XMLWriter from 'xml-writer';
import { name } from '$lib/info';
import { getUrl, getFileUrl } from '$lib/utils';
import { getBlogEntries } from '$lib/content';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ host }) {
  const entries = await getBlogEntries();

  const xw = new XMLWriter();

  const el = (tag, children, safe) => {
    xw.startElement(tag);
    if (typeof children === 'function') {
      children();
    } else {
      if (children) {
        if (safe) {
          xw.text(children);
        } else {
          xw.writeCData(children);
        }
      }
    }

    xw.endElement();
  };

  xw.startDocument('1.0', 'UTF-8');
  xw.startElement('rss');
  xw.writeAttribute('xmlns:dc', 'https://purl.org/dc/elements/1.1/');
  xw.writeAttribute('xmlns:content', 'https://purl.org/rss/1.0/modules/content/');
  xw.writeAttribute('xmlns:atom', 'https://www.w3.org/2005/Atom');
  xw.writeAttribute('version', '2.0');
  el('channel', () => {
    const title = 'karolis.sh';
    const link = getUrl(host, '/blog');
    el('title', title);
    el('description', name + ' on Software Engineering');
    el('link', link);
    el('language', 'en', true);

    xw.startElement('atom:link');
    xw.writeAttribute('href', getFileUrl(host, '/blog/rss.xml'));
    xw.writeAttribute('rel', 'self');
    xw.writeAttribute('type', 'application/rss+xml');
    xw.endElement();

    el('image', () => {
      el('url', getFileUrl(host, '/favicon.png'), true);
      el('title', title);
      el('link', link, true);
    });
    el('category', 'JavaScript');

    entries.forEach(({ metadata: { path, title, date, previewHtml } }) => {
      const url = getUrl(host, path);

      el('item', () => {
        el('title', title);
        el('link', url, true);
        el('pubDate', new Date(date).toUTCString(), true);
        el(
          'description',
          `${previewHtml}
<div style="margin-top: 40px; margin-bottom: 20px; font-style: italic;">
  <strong>
    <a href="${url}">Continue Reading...</a>
  </strong>
</div>`
        );
      });
    });
  });
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
