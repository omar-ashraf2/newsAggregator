import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithInterceptor } from "@/app/baseQueryWithInterceptor";
import { toast } from "@/hooks/use-toast";

// Types
import type { Article } from "@/types/Article";
import type { FetchArticlesParams } from "@/types/FetchArticlesParams";
import type { GuardianResponse } from "@/types/Guardian";
import type { NewsAPIResponse } from "@/types/NewsAPI";
import type { NYTimesResponseWrapper } from "@/types/NYTimes";

// API calls for each source
import { guardianApi } from "@/features/services/guardianApi";
import { newsApi } from "@/features/services/newsApi";
import { nyTimesApi } from "@/features/services/nyTimesApi";

// Utility transforms
import {
  mergeAndSortArticles,
  transformGuardianData,
  transformNewsAPIData,
  transformNYTimesData,
} from "@/features/services";

// Constants
export const PAGE_SIZE_PER_SOURCE = 12;
const MAX_PAGE = 100;

// Type guards
function isNewsAPIResponse(data: unknown): data is NewsAPIResponse {
  return (
    !!data && typeof data === "object" && "status" in data && "articles" in data
  );
}

function isGuardianResponse(data: unknown): data is GuardianResponse {
  return !!data && typeof data === "object" && "response" in data;
}

function isNYTimesResponse(data: unknown): data is NYTimesResponseWrapper {
  return (
    !!data && typeof data === "object" && "status" in data && "response" in data
  );
}

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
          const { searchTerm, fromDate, toDate, category, source, page } =
            params;

          // Ensure page is in valid range:
          const clampedPage = Math.max(1, Math.min(page, MAX_PAGE));

          /**
           * Decide which sources we need to call:
           * If user picks "all", fetch from each. Otherwise, just from the selected one.
           */
          const sourcesToFetch =
            source === "all"
              ? ["NewsApi", "The Guardian", "New York Times"]
              : [source];

          // This is the number of items we REQUEST per source:
          const requestedSourcesCount = sourcesToFetch.length;
          const aggregatorPageSize =
            requestedSourcesCount * PAGE_SIZE_PER_SOURCE;

          // Build an array of fetch promises (one per source).
          const fetchPromises = sourcesToFetch.map(async (src) => {
            switch (src) {
              case "NewsApi":
                return {
                  source: src,
                  ...(await newsApi(
                    baseQuery,
                    api,
                    extraOptions,
                    searchTerm,
                    fromDate,
                    toDate,
                    category,
                    clampedPage,
                    PAGE_SIZE_PER_SOURCE
                  )),
                };
              case "The Guardian":
                return {
                  source: src,
                  ...(await guardianApi(
                    baseQuery,
                    api,
                    extraOptions,
                    searchTerm,
                    category,
                    fromDate,
                    toDate,
                    clampedPage,
                    PAGE_SIZE_PER_SOURCE
                  )),
                };
              case "New York Times":
                return {
                  source: src,
                  ...(await nyTimesApi(
                    baseQuery,
                    api,
                    extraOptions,
                    searchTerm,
                    fromDate,
                    category,
                    clampedPage
                  )),
                };
              default:
                // If somehow an unknown source got through:
                return { source: src, data: null, error: null };
            }
          });

          // Run them all in parallel.
          const settledResults = await Promise.allSettled(fetchPromises);

          // Container for all final transformed articles
          const allArticles: Article[] = [];
          let totalResultsSum = 0;

          // For storing any partial failures
          const failedSources: string[] = [];
          const failedMessages: string[] = [];

          // Handle results
          for (const result of settledResults) {
            if (result.status === "fulfilled") {
              const { source, data, error } = result.value;
              if (error) {
                // If we got an error from baseQuery, track it
                failedSources.push(source);
                const msg =
                  (error.data as { message?: string })?.message ||
                  `${source} request failed.`;
                failedMessages.push(msg);
              } else if (data) {
                // We have a successful data from the source
                if (source === "NewsApi" && isNewsAPIResponse(data)) {
                  const articles = transformNewsAPIData(data);
                  allArticles.push(...articles);
                  totalResultsSum += data.totalResults || 0;
                } else if (
                  source === "The Guardian" &&
                  isGuardianResponse(data)
                ) {
                  const articles = transformGuardianData(data);
                  allArticles.push(...articles);
                  totalResultsSum += data.response.total || 0;
                } else if (
                  source === "New York Times" &&
                  isNYTimesResponse(data)
                ) {
                  const articles = transformNYTimesData(data);
                  allArticles.push(...articles);
                  totalResultsSum += data.response.meta.hits || 0;
                }
              }
            } else {
              // The actual promise itself failed
              // (e.g. network error, promise rejection)
              failedSources.push("Unknown source");
              failedMessages.push("A source request failed unexpectedly.");
            }
          }

          // If some sources failed, show a toast or handle gracefully
          if (failedSources.length > 0) {
            toast({
              title: "Some sources failed",
              description: `Failed to fetch from: ${failedSources.join(", ")}. 
                ${failedMessages.join(" ")}`,
              variant: "destructive",
            });
          }

          // Now merge and sort all articles by date desc
          const mergedArticles = mergeAndSortArticles(allArticles);

          return {
            data: {
              articles: mergedArticles,
              totalResults: totalResultsSum,
              combinedPageSize: aggregatorPageSize,
            },
          };
        } catch (error) {
          // If something goes wrong altogether
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: error,
            } as FetchBaseQueryError,
          };
        }
      },
    }),
  }),
});

export const { useFetchArticlesQuery } = articlesApi;
