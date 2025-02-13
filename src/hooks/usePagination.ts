import { useMemo } from "react";

interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  boundaryCount?: number;
}

export function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: UsePaginationProps): (number | "ellipsis")[] {
  return useMemo(() => {
    const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1) as (
        | number
        | "ellipsis"
      )[];
    }

    const leftSiblingIndex = Math.max(
      currentPage - siblingCount,
      boundaryCount + 2
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount - 1
    );

    const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
    const showRightEllipsis =
      rightSiblingIndex < totalPages - boundaryCount - 1;

    const startPages = Array.from(
      { length: boundaryCount },
      (_, i) => i + 1
    ) as (number | "ellipsis")[];
    const endPages = Array.from(
      { length: boundaryCount },
      (_, i) => totalPages - boundaryCount + 1 + i
    ) as (number | "ellipsis")[];

    let middlePages: (number | "ellipsis")[] = [];

    if (showLeftEllipsis && showRightEllipsis) {
      middlePages = [
        "ellipsis" as const,
        ...(Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ) as (number | "ellipsis")[]),
        "ellipsis" as const,
      ];
    } else if (!showLeftEllipsis && showRightEllipsis) {
      const startLength = boundaryCount;
      const neededLength = leftSiblingIndex + siblingCount + 1;
      middlePages = [
        ...(Array.from(
          { length: neededLength - startLength },
          (_, i) => i + startLength + 1
        ) as (number | "ellipsis")[]),
        "ellipsis" as const,
      ];
    } else if (showLeftEllipsis && !showRightEllipsis) {
      middlePages = [
        "ellipsis" as const,
        ...(Array.from(
          { length: totalPages - rightSiblingIndex + siblingCount },
          (_, i) => rightSiblingIndex - siblingCount + i
        ) as (number | "ellipsis")[]),
      ];
    }

    return [...startPages, ...middlePages, ...endPages];
  }, [currentPage, totalPages, siblingCount, boundaryCount]);
}
