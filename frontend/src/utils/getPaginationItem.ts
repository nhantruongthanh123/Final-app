export const getPaginationItem = (currentPage: number, totalPages: number) => {
  const startPages = [1, 2, 3];
  const endPages = [totalPages - 2, totalPages - 1, totalPages];

  const middlePages = [];
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    middlePages.push(i);
  }

  const pageSet = new Set([...startPages, ...middlePages, ...endPages]);
  const sortedPages = Array.from(pageSet)
    .filter((p) => p > 0 && p <= totalPages) // Ensure pages are within valid bounds
    .sort((a, b) => a - b);

  const items = [];
  for (let i = 0; i < sortedPages.length; i++) {
    items.push(sortedPages[i]);

    if (i < sortedPages.length - 1 && sortedPages[i + 1] - sortedPages[i] > 1) {
      items.push(`ellipsis-${sortedPages[i]}`);
    }
  }

  return items.map((item) =>
    typeof item === "number" ? item.toString() : "...",
  );
};
