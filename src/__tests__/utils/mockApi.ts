import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { beforeEach, vi } from "vitest";
import { mockArticles } from "./mockData";

const useFetchArticlesQueryMock = vi.fn();

vi.mock("@/features/articles/articlesApi", async () => {
  const actual = await vi.importActual("@/features/articles/articlesApi");
  return {
    ...actual,
    useFetchArticlesQuery: useFetchArticlesQueryMock,
  };
});

export const mockApiResponse = (
  mockData = mockArticles,
  isError = false,
  errorMessage = "Error fetching articles",
  customTotalResults?: number,
  customCombinedPageSize?: number
) => {
  useFetchArticlesQueryMock.mockReturnValue(
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
            totalResults: customTotalResults ?? mockData.length,
            combinedPageSize: customCombinedPageSize ?? mockData.length,
          },
          isLoading: false,
          isFetching: false,
          error: null,
          refetch: vi.fn(),
        }
  );
};

beforeEach(() => {
  useFetchArticlesQueryMock.mockReset();
});
