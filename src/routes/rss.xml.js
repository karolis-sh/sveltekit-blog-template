import XMLWriter from 'xml-writer';
import { name } from '$lib/info';
import { getUrl } from '$lib/utils';
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
    const title = name + ' RSS Feed';
    const link = getUrl(host);
    el('title', title);
    el('link', link);
    el('language', 'en', true);
    el('description', 'Blog posts on stuff');
    el('image', () => {
      el('url', link + '/favicon.png', true);
      el('title', title, true);
      el('link', link, true);
    });
    el('category', 'JavaScript');

    entries.forEach(({ metadata: { path, title, description, date, previewHtml } }) => {
      const url = getUrl(host, path);

      el('item', () => {
        el('title', title);
        el('link', url, true);
        el('description', description);
        el('pubDate', new Date(date).toUTCString(), true);
        el('content:encoded', previewHtml + '\n' + readMore(url));
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

function readMore(url) {
  return `<div style="margin-top: 50px; font-style: italic;">
  <strong>
    <a href="${url}">Keep reading</a>
  </strong>
</div>`;
}
