import { articlesApi } from "@/features/articles/articlesApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { vi } from "vitest";
import { mockArticles } from "./mockData";

export const mockApiResponse = (
  mockData = mockArticles,
  isError = false,
  errorMessage = "Error fetching articles"
) => {
  vi.spyOn(articlesApi.endpoints.fetchArticles, "useQuery").mockReturnValue(
    isError
      ? {
          data: null,
          isLoading: false,
          isFetching: false,
          error: {
            status: "CUSTOM_ERROR",
            data: { message: errorMessage },
          } as FetchBaseQueryError,
          refetch: vi.fn(),
        }
      : {
          data: {
            articles: mockData,
            totalResults: mockData.length,
            combinedPageSize: mockData.length,
          },
          isLoading: false,
          isFetching: false,
          error: null,
          refetch: vi.fn(),
        }
  );
};
