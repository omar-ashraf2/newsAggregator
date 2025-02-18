import reducer, {
  setDateRange,
  setFilterCategory,
  setFilterSource,
  setPage,
  setSearchTerm,
  setSortOrder,
} from "@/features/filters/filterSlice";
import type { SortOrder } from "@/types/SortOrder";
import { describe, expect, it } from "vitest";

describe("filterSlice", () => {
  it("should handle initial state", () => {
    const initialState = reducer(undefined, { type: "@@INIT" });
    expect(initialState.searchTerm).toBe("");
    expect(initialState.fromDate).toBe("");
    expect(initialState.toDate).toBe("");
    expect(initialState.category).toBe("all");
    expect(initialState.source).toBe("all");
    expect(initialState.page).toBe(1);
    expect(initialState.sortOrder).toBe("newest");
  });

  it("should set search term and reset page", () => {
    const prevState = {
      searchTerm: "",
      fromDate: "",
      toDate: "",
      category: "all",
      source: "all",
      page: 5,
      sortOrder: "newest" as SortOrder,
    };
    const nextState = reducer(prevState, setSearchTerm("react"));
    expect(nextState.searchTerm).toBe("react");
    expect(nextState.page).toBe(1);
  });

  it("should not reset page if search term is the same", () => {
    const prevState = {
      searchTerm: "react",
      fromDate: "",
      toDate: "",
      category: "all",
      source: "all",
      page: 5,
      sortOrder: "newest" as SortOrder,
    };
    const nextState = reducer(prevState, setSearchTerm("react"));
    expect(nextState.searchTerm).toBe("react");
    expect(nextState.page).toBe(5);
  });

  it("should set date range and reset page", () => {
    const prevState = {
      searchTerm: "node",
      fromDate: "",
      toDate: "",
      category: "all",
      source: "all",
      page: 3,
      sortOrder: "newest" as SortOrder,
    };
    const nextState = reducer(
      prevState,
      setDateRange({ from: "2023-01-01", to: "2023-01-31" })
    );
    expect(nextState.fromDate).toBe("2023-01-01");
    expect(nextState.toDate).toBe("2023-01-31");
    expect(nextState.page).toBe(1);
  });

  it("should set filter category and reset page", () => {
    const prevState = {
      searchTerm: "",
      fromDate: "",
      toDate: "",
      category: "all",
      source: "all",
      page: 4,
      sortOrder: "newest" as SortOrder,
    };
    const nextState = reducer(prevState, setFilterCategory("technology"));
    expect(nextState.category).toBe("technology");
    expect(nextState.page).toBe(1);
  });

  it("should set filter source and reset page", () => {
    const prevState = {
      searchTerm: "",
      fromDate: "",
      toDate: "",
      category: "all",
      source: "all",
      page: 2,
      sortOrder: "newest" as SortOrder,
    };
    const nextState = reducer(prevState, setFilterSource("blog"));
    expect(nextState.source).toBe("blog");
    expect(nextState.page).toBe(1);
  });

  it("should set page number", () => {
    const prevState = {
      searchTerm: "",
      fromDate: "",
      toDate: "",
      category: "all",
      source: "all",
      page: 1,
      sortOrder: "newest" as SortOrder,
    };
    const nextState = reducer(prevState, setPage(3));
    expect(nextState.page).toBe(3);
  });

  it("should set sort order and reset page", () => {
    const prevState = {
      searchTerm: "",
      fromDate: "",
      toDate: "",
      category: "all",
      source: "all",
      page: 6,
      sortOrder: "newest" as SortOrder,
    };
    const nextState = reducer(prevState, setSortOrder("oldest"));
    expect(nextState.sortOrder).toBe("oldest");
    expect(nextState.page).toBe(1);
  });

  it("should preserve other state properties when updating individual fields", () => {
    const prevState = {
      searchTerm: "react",
      fromDate: "2023-01-01",
      toDate: "2023-01-31",
      category: "technology",
      source: "blog",
      page: 3,
      sortOrder: "newest" as SortOrder,
    };

    const nextState = reducer(prevState, setFilterCategory("programming"));

    expect(nextState).toEqual({
      ...prevState,
      category: "programming",
      page: 1,
    });
  });
});
