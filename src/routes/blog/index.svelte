<script context="module">
  import { getBlogEntries } from '$lib/content';

  export const prerender = true;

  export const load = async () => {
    return {
      props: {
        entries: getBlogEntries().map((entry) => entry.metadata),
      },
    };
  };
</script>

<script>
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import { name } from '$lib/info.js';
  import { format } from 'date-fns';
  export let entries;
</script>

<svelte:head>
  <title>{name}</title>
</svelte:head>

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
