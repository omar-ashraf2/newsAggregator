import type { Article } from "@/types/Article";
import type { FetchArticlesParams } from "@/types/FetchArticlesParams";
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  baseQuery: fetchBaseQuery({ baseUrl: "" }), // No base URL since we fetch from 3 different sources
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

          // Parallel fetch from each service
          const [newsResult, guardianResult, nyTimesResult] = await Promise.all(
            [
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
            ]
          );

          // If any fetch returned an error, bubble up
          if (newsResult.error) {
            return { error: newsResult.error };
          }
          if (guardianResult.error) {
            return { error: guardianResult.error };
          }
          if (nyTimesResult.error) {
            return { error: nyTimesResult.error };
          }

          // Transform each response into the shared Article shape
          const newsData = transformNewsAPIData(newsResult.data!);
          const guardianData = transformGuardianData(guardianResult.data!);
          const nyTimesData = transformNYTimesData(nyTimesResult.data!);

          // Merge & sort
          const combinedArticles = mergeAndSortArticles(
            newsData,
            guardianData,
            nyTimesData
          );

          const totalResults =
            (newsResult.data?.totalResults || 0) +
            (guardianResult.data?.response.total || 0) +
            (nyTimesResult.data?.response.meta.hits || 0);

          const pageSize = combinedArticles.length;

          return {
            data: {
              articles: combinedArticles,
              totalResults,
              pageSize,
            },
          };
        } catch (e: unknown) {
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
