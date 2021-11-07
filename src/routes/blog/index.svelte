<script context="module">
  import { getBlogEntries } from '$lib/content';

  export const prerender = true;

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    return {
      props: {
        entries: getBlogEntries().map((entry) => entry.metadata),
        url: 'https://' + page.host + page.path,
      },
    };
  }
</script>

<script>
  import SEO from '$lib/components/SEO.svelte';
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import { format } from 'date-fns';

  export let url;
  export let entries;

  const title = 'Blog Posts';
  const description = 'Blog Posts about stuff';
</script>

<SEO {url} {title} {description} />

<div class="flex flex-col flex-grow">
  <div class="flex-grow divide-y divide-gray-300 dark:divide-gray-700">
    {#each entries as entry}
      <div class="py-8 first:pt-0">
        <div>
          <h1 class="!mt-0 !mb-1">
            <a href={entry.slug}>{entry.title}</a>
          </h1>
          <time>{format(new Date(entry.date), 'MMMM d, yyyy')}</time>
          •
          <span>{entry.readingTime.text}</span>
        </div>
        <div>{@html entry.previewHtml}</div>
        <div class="flex justify-end w-full">
          <ButtonLink href={entry.slug}>Read More</ButtonLink>
        </div>
      </div>
    {/each}
  </div>
</div>
