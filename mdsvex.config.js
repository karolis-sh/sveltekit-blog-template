import path from 'path';
import { visit } from 'unist-util-visit';
import autolinkHeadings from 'rehype-autolink-headings';
import slugPlugin from 'rehype-slug';
import relativeImages from 'mdsvex-relative-images';
import remarkReadingTime from 'remark-reading-time';
import remarkPreview, { htmlFormatter } from 'remark-preview';

export default {
  extensions: ['.md'],
  smartypants: {
    dashes: 'oldschool',
  },
  remarkPlugins: [
    remarkReadingTime(),
    remarkPreview(
      htmlFormatter({
        length: 300,
        maxBlocks: 1,
      }),
      { attribute: 'previewHtml' }
    ),
    remarkPath(),
    remarkVideos(),
    relativeImages,
  ],
  rehypePlugins: [slugPlugin, [autolinkHeadings, { behavior: 'wrap' }]],
};

function remarkPath(baseDir = 'content') {
  return () => (_, file) => {
    const parsed = path.parse(file.filename);

    file.data.fm = {
      ...file.data.fm,
      path:
        '/' +
        path.relative(
          path.join(process.cwd(), baseDir),
          parsed.name === 'index' ? parsed.dir : path.join(parsed.dir, parsed.name)
        ),
    };
  };
}

function remarkVideos(extensions = ['mp4', 'webm']) {
  return () => (tree) => {
    visit(tree, 'image', (node) => {
      if (extensions.some((ext) => node.url.endsWith(ext))) {
        node.type = 'html';
        node.value = `<video src="${node.url}" autoplay muted playsinline loop title="${node.alt}" />`;
      }
    });
  };
}
