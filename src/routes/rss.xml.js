import { Feed } from 'feed';
import { name } from '$lib/info';
import { getUrl } from '$lib/utils';
import { getBlogEntries } from '$lib/content';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ host }) {
  const entries = await getBlogEntries();
  const link = getUrl(host);

  const feed = new Feed({
    title: name + ' RSS Feed',
    description: 'This is my personal feed!',
    id: link,
    link,
    language: 'en',
    // image: 'http://example.com/image.png',
    // favicon: 'http://example.com/favicon.ico',
    copyright: 'All rights reserved ' + new Date().getFullYear() + ', ' + name,
    feedLinks: {
      atom: getUrl(host, '/rss.xml'),
    },
    author: { name, link },
  });

  entries.forEach(({ metadata: { path, title, description, date, previewHtml } }) => {
    const url = getUrl(host, path);

    feed.addItem({
      title: title,
      id: url,
      link: url,
      description: description,
      content: previewHtml + '\n' + readMore(url),
      date: new Date(date),
      // image: post.image,
    });
  });

  return {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml',
    },
    body: feed.atom1(),
  };
}

function readMore(url) {
  return `<div style="margin-top: 50px; font-style: italic;">
  <strong>
    <a href="${url}">Keep reading</a>
  </strong>
</div>`;
}
