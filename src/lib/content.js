export function getEntries() {
  const entries = Object.entries(import.meta.globEager('/content/**/*.md')).map(([, entry]) => ({
    metadata: entry.metadata,
    component: entry.default,
  }));

  return entries;
}

export function getBlogEntries() {
  const entries = Object.entries(import.meta.globEager('/content/blog/**/*.md'))
    .map(([, content]) => ({
      metadata: content.metadata,
      component: content.default,
    }))
    .sort((a, b) =>
      new Date(a.metadata.date).getTime() < new Date(b.metadata.date).getTime() ? 1 : -1
    )
    .map((entry, index, array) => ({
      ...entry,
      next: array[index - 1],
      previous: array[index + 1],
    }));

  return entries;
}
