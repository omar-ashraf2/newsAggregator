import { usePagination } from "@/hooks/usePagination";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("usePagination", () => {
  it("should return all pages if totalPages <= siblingCount * 2 + 5", () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 1, totalPages: 5, siblingCount: 1 })
    );
    expect(result.current).toEqual([1, 2, 3, 4, 5]);
  });

  it("should include ellipsis if range is large", () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 5, totalPages: 12, siblingCount: 1 })
    );
    expect(result.current).toContain("ellipsis");
  });
});
