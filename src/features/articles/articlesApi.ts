import type { Article } from "@/types/Article";
import type { FetchArticlesParams } from "@/types/FetchArticlesParams";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithInterceptor } from "@/app/baseQueryWithInterceptor";
import { toast } from "@/hooks/use-toast";

import {
  guardianApi,
  mergeAndSortArticles,
  newsApi,
  nyTimesApi,
  transformGuardianData,
  transformNewsAPIData,
  transformNYTimesData,
} from "../services";

import type { GuardianResponse } from "@/types/Guardian";
import type { NewsAPIResponse } from "@/types/NewsAPI";
import type { NYTimesResponseWrapper } from "@/types/NYTimes";

export const PAGE_SIZE_PER_SOURCE = 11;

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

interface ApiCall {
  source: string;
  promise: Promise<{ data?: unknown; error?: FetchBaseQueryError }>;
}

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    fetchArticles: builder.query<
      { articles: Article[]; totalResults: number; pageSize: number },
      FetchArticlesParams
    >({
      async queryFn(params, api, extraOptions, baseQuery) {
        try {
          const { searchTerm, fromDate, toDate, category, source, page } =
            params;
          const shouldFilterByDate =
            fromDate && toDate ? { fromDate, toDate } : {};

          const apiCalls: ApiCall[] = [];

          if (source === "NewsAPI" || source === "all") {
            apiCalls.push({
              source: "NewsAPI",
              promise: newsApi(
                baseQuery,
                api,
                extraOptions,
                searchTerm,
                shouldFilterByDate.fromDate || "",
                shouldFilterByDate.toDate || "",
                category,
                page,
                PAGE_SIZE_PER_SOURCE
              ).catch((error) => ({ error })),
            });
          }
          if (source === "TheGuardian" || source === "all") {
            apiCalls.push({
              source: "TheGuardian",
              promise: guardianApi(
                baseQuery,
                api,
                extraOptions,
                searchTerm,
                category,
                shouldFilterByDate.fromDate || "",
                shouldFilterByDate.toDate || "",
                page,
                PAGE_SIZE_PER_SOURCE
              ).catch((error) => ({ error })),
            });
          }
          if (source === "NYTimes" || source === "all") {
            apiCalls.push({
              source: "NYTimes",
              promise: nyTimesApi(
                baseQuery,
                api,
                extraOptions,
                searchTerm,
                shouldFilterByDate.fromDate || "",
                category,
                page
              ).catch((error) => ({ error })),
            });
          }

          const settledResults = await Promise.allSettled(
            apiCalls.map((call) => call.promise)
          );

          const newsArticles: Article[] = [];
          const guardianArticles: Article[] = [];
          const nyTimesArticles: Article[] = [];
          let totalResultsSum = 0;
          const failedAPIs: string[] = [];
          const failedMessages: string[] = [];

          settledResults.forEach((result, index) => {
            const currentSource = apiCalls[index].source;
            if (result.status === "fulfilled") {
              const response = result.value;
              if (response.error) {
                failedAPIs.push(currentSource);
                failedMessages.push(
                  (response.error?.data as { message?: string })?.message ||
                    `${currentSource} request failed.`
                );
              } else {
                if (
                  currentSource === "NewsAPI" &&
                  isNewsAPIResponse(response.data)
                ) {
                  const articles = transformNewsAPIData(response.data);
                  newsArticles.push(...articles);
                  totalResultsSum += response.data.totalResults || 0;
                } else if (
                  currentSource === "TheGuardian" &&
                  isGuardianResponse(response.data)
                ) {
                  const articles = transformGuardianData(response.data);
                  guardianArticles.push(...articles);
                  totalResultsSum += response.data.response.total || 0;
                } else if (
                  currentSource === "NYTimes" &&
                  isNYTimesResponse(response.data)
                ) {
                  const articles = transformNYTimesData(response.data);
                  nyTimesArticles.push(...articles);
                  totalResultsSum += response.data.response.meta.hits || 0;
                }
              }
            } else {
              failedAPIs.push(currentSource);
              failedMessages.push(`${currentSource} request failed.`);
            }
          });

          if (failedAPIs.length > 0) {
            toast({
              title: "Some sources failed",
              description: `Failed to fetch from: ${failedAPIs.join(
                ", "
              )}. ${failedMessages.join(" ")}`,
              variant: "destructive",
            });
          }

          const mergedArticles = mergeAndSortArticles(
            newsArticles,
            guardianArticles,
            nyTimesArticles
          );

          return {
            data: {
              articles: mergedArticles,
              totalResults: totalResultsSum,
              pageSize: mergedArticles.length,
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
    }),
  }),
});

export const { useFetchArticlesQuery } = articlesApi;
