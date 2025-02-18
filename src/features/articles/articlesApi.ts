/**
 * articlesApi.ts
 *
 * RTK Query aggregator endpoint for multiple sources.
 *
 * Points of SOLID:
 *  - SRP: This file only orchestrates queries, returning final articles.
 *    Partial-failure & source mapping are in separate helpers.
 *  - OCP: We add new sources by updating `sourceApiMap`.
 */

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithInterceptor } from "@/app/baseQueryWithInterceptor";
import { toast } from "@/hooks/use-toast";

import type { Article } from "@/types/Article";
import type { FetchArticlesParams } from "@/types/FetchArticlesParams";

// Helpers
import { mergeAndSortArticles } from "./helpers/mergeArticles";
import { handleSettledResults } from "./helpers/partialFailures";
import { sourceApiMap } from "./helpers/sourceMap";

// Constants
export const PAGE_SIZE_PER_SOURCE = 10;
const MAX_PAGE = 50;

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    fetchArticles: builder.query<
      {
        articles: Article[];
        totalResults: number;
        combinedPageSize: number;
      },
      FetchArticlesParams
    >({
      async queryFn(params, api, extraOptions, baseQuery) {
        try {
          const {
            searchTerm,
            fromDate,
            toDate,
            category,
            source,
            page,
            sortOrder,
          } = params;

          // clamp page
          const clampedPage = Math.max(1, Math.min(page, MAX_PAGE));

          // If user wants "all" => fetch from each source, else just that source
          const sourcesToFetch =
            source === "all"
              ? ["NewsApi", "The Guardian", "New York Times"]
              : [source];

          // aggregatorPageSize = #sources * PAGE_SIZE_PER_SOURCE
          const aggregatorPageSize =
            sourcesToFetch.length * PAGE_SIZE_PER_SOURCE;

          // Build array of fetch promises
          const fetchPromises = sourcesToFetch.map(async (src) => {
            const fetchFn = sourceApiMap[src];
            if (!fetchFn) {
              // unknown source => do nothing
              return { source: src, data: null, error: null };
            }
            return {
              source: src,
              ...(await fetchFn(
                baseQuery,
                api,
                extraOptions,
                searchTerm,
                fromDate,
                toDate,
                category,
                sortOrder,
                clampedPage,
                PAGE_SIZE_PER_SOURCE
              )),
            };
          });

          // Wait for all fetches (partial or full success)
          const settledResults = await Promise.allSettled(fetchPromises);

          // Use helper to handle partial failures + transform data
          const {
            allArticles,
            totalResultsSum,
            failedSources,
            failedMessages,
          } = handleSettledResults(settledResults);

          // If some sources failed, show user feedback
          if (failedSources.length > 0) {
            toast({
              title: "Some sources failed",
              description: `Failed to fetch from: ${failedSources.join(", ")}. 
                ${failedMessages.join(" ")}`,
              variant: "destructive",
            });
          }

          // Merge & sort final results
          const mergedArticles = mergeAndSortArticles(allArticles, sortOrder);

          return {
            data: {
              articles: mergedArticles,
              totalResults: totalResultsSum,
              combinedPageSize: aggregatorPageSize,
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: error,
            } as FetchBaseQueryError,
          };
        }
      },
      keepUnusedDataFor: 120, // cache for 2 minutes
    }),
  }),
});

export const { useFetchArticlesQuery } = articlesApi;
