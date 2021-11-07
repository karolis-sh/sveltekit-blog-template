<script context="module">
  import { getEntries } from '$lib/content';

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    const entry = getEntries().find((content) => page.path === content.metadata.path);

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

  export let url;
  export let component;
  export let metadata;

  const { title, description } = metadata;
</script>

<SEO {url} {title} {description} />

<svelte:component this={component} />
