import type { Article } from "@/types/Article";
import type { FetchArticlesParams } from "@/types/FetchArticlesParams";
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
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

export const PAGE_SIZE_PER_SOURCE = 5;

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    fetchArticles: builder.query<
      { articles: Article[]; totalResults: number; pageSize: number },
      FetchArticlesParams
    >({
      async queryFn(
        params,
        api,
        extraOptions,
        baseQuery
      ): Promise<
        QueryReturnValue<
          { articles: Article[]; totalResults: number; pageSize: number },
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >
      > {
        try {
          const { searchTerm, date, category, page } = params;

          // Fetch all APIs in parallel
          const responses = await Promise.allSettled([
            newsApi(
              baseQuery,
              api,
              extraOptions,
              searchTerm,
              date,
              page,
              PAGE_SIZE_PER_SOURCE
            ),
            guardianApi(
              baseQuery,
              api,
              extraOptions,
              searchTerm,
              category,
              page,
              PAGE_SIZE_PER_SOURCE
            ),
            nyTimesApi(baseQuery, api, extraOptions, searchTerm, page),
          ]);

          const [newsResult, guardianResult, nyTimesResult] = responses;

          // Extract successful responses
          const newsData =
            newsResult.status === "fulfilled" && newsResult.value.data
              ? transformNewsAPIData(newsResult.value.data)
              : [];

          const guardianData =
            guardianResult.status === "fulfilled" && guardianResult.value.data
              ? transformGuardianData(guardianResult.value.data)
              : [];

          const nyTimesData =
            nyTimesResult.status === "fulfilled" && nyTimesResult.value.data
              ? transformNYTimesData(nyTimesResult.value.data)
              : [];

          const combinedArticles = mergeAndSortArticles(
            newsData,
            guardianData,
            nyTimesData
          );

          // Handle API failures and extract meaningful messages
          const failedAPIs = [];
          const failedMessages = [];

          if (newsResult.status === "rejected") {
            failedAPIs.push("NewsAPI");
            failedMessages.push(
              newsResult.reason?.error?.data?.message || "Unknown NewsAPI Error"
            );
          }
          if (guardianResult.status === "rejected") {
            failedAPIs.push("The Guardian");
            failedMessages.push(
              guardianResult.reason?.error?.data?.message ||
                "Unknown Guardian Error"
            );
          }
          if (nyTimesResult.status === "rejected") {
            failedAPIs.push("NY Times");
            failedMessages.push(
              nyTimesResult.reason?.error?.data?.message ||
                "Unknown NY Times Error"
            );
          }

          // Show error toast with specific API failure messages
          if (failedAPIs.length > 0) {
            toast({
              title: "Some sources failed",
              description: `Failed to fetch from: ${failedAPIs.join(
                ", "
              )}. ${failedMessages.join(" ")}`,
              variant: "destructive",
            });
          }

          // If all sources failed, return error
          if (combinedArticles.length === 0) {
            return {
              error: {
                status: "NO_DATA",
                data: { message: "No articles available. Try again later." },
              } as unknown as FetchBaseQueryError,
            };
          }

          // Total results from successful sources
          const totalResults =
            (newsResult.status === "fulfilled"
              ? newsResult.value.data?.totalResults || 0
              : 0) +
            (guardianResult.status === "fulfilled"
              ? guardianResult.value.data?.response.total || 0
              : 0) +
            (nyTimesResult.status === "fulfilled"
              ? nyTimesResult.value.data?.response.meta.hits || 0
              : 0);

          return {
            data: {
              articles: combinedArticles,
              totalResults,
              pageSize: combinedArticles.length,
            },
          };
        } catch (e) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: e,
            } as FetchBaseQueryError,
          };
        }
      },
    }),
  }),
});

export const { useFetchArticlesQuery } = articlesApi;
