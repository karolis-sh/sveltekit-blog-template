<script context="module">
  import { getBlogEntries } from '$lib/content';

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    const entry = getBlogEntries().find((content) => page.path === content.metadata.slug);

    if (!entry) return { status: 404 };

    console.log('entry :>> ', entry);

    return { props: entry };
  }
</script>

<script>
  import { format } from 'date-fns';
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import { name, website } from '$lib/info';

  export let metadata;
  export let component;
  export let next;
  export let previous;

  const { title, date, readingTime } = metadata;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<article>
  <h1 class="!mt-0 !mb-1">{title}</h1>
  <div>
    <time datetime={new Date(date).toISOString()}>{format(new Date(date), 'MMMM d, yyyy')}</time>
    •
    <span>{readingTime.text}</span>
  </div>
  <svelte:component this={component} />
</article>

<div class="pt-12 flex justify-between">
  {#if previous}
    <ButtonLink isBack href={previous.metadata.slug}>{previous.metadata.title}</ButtonLink>
  {:else}
    <div />
  {/if}
  {#if next}
    <ButtonLink href={next.metadata.slug}>{next.metadata.title}</ButtonLink>
  {/if}
</div>
