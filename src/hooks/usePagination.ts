import { useMemo } from "react";

interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

/**
 * Returns an array of numbers + possible "ellipsis" strings to render a typical pagination range.
 */
export function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
}: UsePaginationProps): (number | "ellipsis")[] {
  return useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    // If total pages is small, just render them all
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate bounds
    const leftBound = Math.max(currentPage - siblingCount, 2);
    const rightBound = Math.min(currentPage + siblingCount, totalPages - 1);

    const pages: (number | "ellipsis")[] = [];
    pages.push(1);

    if (leftBound > 2) {
      pages.push("ellipsis");
    }

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    if (rightBound < totalPages - 1) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages, siblingCount]);
}
