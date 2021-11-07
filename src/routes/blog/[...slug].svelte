<script context="module">
  import { getBlogEntries } from '$lib/content';

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    const entry = getBlogEntries().find((content) => page.path === content.metadata.path);

    if (!entry) return { status: 404 };

    return {
      props: {
        ...entry,
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
  export let metadata;
  export let component;
  export let next;
  export let previous;

  const { title, description, date, readingTime } = metadata;
</script>

<SEO {url} {title} {description} og={{ type: 'article' }} />

<article>
  <h1 class="!mt-0 !mb-1">{title}</h1>
  <Subheader {date} {readingTime} />
  <svelte:component this={component} />
</article>

<div class="pt-12 flex justify-between">
  {#if previous}
    <ButtonLink isBack href={previous.metadata.path}>{previous.metadata.title}</ButtonLink>
  {:else}
    <div />
  {/if}
  {#if next}
    <ButtonLink href={next.metadata.path}>{next.metadata.title}</ButtonLink>
  {/if}
</div>
