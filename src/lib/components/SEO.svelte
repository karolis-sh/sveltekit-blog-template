<script>
  import { MetaTags } from 'svelte-meta-tags';
  import { name, twitter } from '../info';

  export let url;
  export let title;
  export let description = undefined;
  export let og = undefined;
</script>

<MetaTags
  {title}
  {description}
  canonical={url}
  openGraph={{
    type: og?.type,
    url,
    title,
    description,
    images: [],
    site_name: name,
  }}
  twitter={{
    handle: twitter,
    cardType: 'summary_large_image',
  }}
/>
