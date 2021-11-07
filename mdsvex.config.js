import path from 'path';
import { visit } from 'unist-util-visit';
import autolinkHeadings from 'rehype-autolink-headings';
import slugPlugin from 'rehype-slug';
import relativeImages from 'mdsvex-relative-images';
import readingTime from 'remark-reading-time';
import preview, { textFormatter, htmlFormatter } from 'remark-preview';

export default {
  extensions: ['.md'],
  smartypants: {
    dashes: 'oldschool',
  },
  remarkPlugins: [
    // adds a `readingTime` frontmatter attribute
    readingTime(),

    // Add a text preview snippet (no formatting) so we can use it in the meta description tag
    preview(textFormatter({ length: 300, maxBlocks: 1 })),

    // Add an HTML preview snippet (formatted) so we can use it when displaying all posts
    preview(
      htmlFormatter({
        length: 300,
        maxBlocks: 1,
      }),
      {
        attribute: 'previewHtml',
      }
    ),
    content,
    videos,
    relativeImages,
  ],
  rehypePlugins: [slugPlugin, [autolinkHeadings, { behavior: 'wrap' }]],
};

/**
 * Add slug to metadata and convert `date` timezone to UTC
 */
function content() {
  return (_, file) => {
    const parsed = path.parse(file.filename);
    const slug =
      '/' +
      path.relative(
        path.join(process.cwd(), 'content'),
        parsed.name === 'index' ? parsed.dir : path.join(parsed.dir, parsed.name)
      );

    file.data.fm = {
      ...file.data.fm,
      slug,

      // remove timezone from parsed date
      date: file.data.fm.date ? new Date(file.data.fm.date).toLocaleDateString() : undefined,
    };
  };
}

/**
 * Adds support to video files in markdown image links
 */
function videos() {
  const extensions = ['mp4', 'webm'];
  return function transformer(tree) {
    visit(tree, 'image', (node) => {
      if (extensions.some((ext) => node.url.endsWith(ext))) {
        node.type = 'html';
        node.value = `
            <video
              src="${node.url}"
              autoplay
              muted
              playsinline
              loop
              title="${node.alt}"
            />
          `;
      }
    });
  };
}
