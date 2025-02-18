/**
 * sourceMap.ts
 *
 * Maps each source string (e.g. "NewsApi") to its corresponding fetch function,
 * ensuring we can add new sources without changing the aggregator logic.
 *
 * This adheres to OCP (Open-Closed Principle).
 */

import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { guardianApi } from "../guardianApi";
import { newsApi } from "../newsApi";
import { nyTimesApi } from "../nyTimesApi";

export const sourceApiMap: Record<
  string,
  (
    baseQuery: BaseQueryFn<
      string | { url: string; method?: string },
      unknown,
      FetchBaseQueryError
    >,
    api: Parameters<typeof newsApi>[1],
    extraOptions: Record<string, unknown>,
    searchTerm: string,
    fromDate: string,
    toDate: string,
    category: string,
    sortOrder: "newest" | "oldest" | "relevance",
    page: number,
    pageSize?: number
  ) => Promise<{ data?: unknown; error?: FetchBaseQueryError }>
> = {
  NewsApi: newsApi,
  "The Guardian": guardianApi,
  "New York Times": nyTimesApi,
};
