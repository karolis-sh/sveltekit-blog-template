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
  import Subheader from './_Subheader.svelte';

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
            <a href={entry.path}>{entry.title}</a>
          </h1>
          <Subheader date={entry.date} readingTime={entry.readingTime} />
        </div>
        <div>{@html entry.previewHtml}</div>
        <div class="flex justify-end w-full">
          <ButtonLink href={entry.path}>Read More</ButtonLink>
        </div>
      </div>
    {/each}
  </div>
</div>
