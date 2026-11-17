// Link to the search results page. Kept out of the "use client" components so server pages can use it too.
export function searchHref(text: string, page = 1) {
  const params = new URLSearchParams({ q: text.trim() });
  if (page > 1) params.set("page", String(page));
  return `/search?${params}`;
}
