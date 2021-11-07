<script context="module">
  import { getEntries } from '$lib/content';

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    const entry = getEntries().find((content) => page.path === content.metadata.slug);

    if (!entry) return { status: 404 };

    return { props: entry };
  }
</script>

<script>
  export let component;
  export let metadata;

  const { title } = metadata;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<svelte:component this={component} />
