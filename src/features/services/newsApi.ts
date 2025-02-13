import type { NewsAPIResponse } from "@/types/NewsAPI";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const MAX_PAGE = 100;

const NEWSAPI_BASE_URL = import.meta.env.VITE_NEWSAPI_BASE_URL;
const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;

export async function newsApi(
  baseQuery: BaseQueryFn<
    string | { url: string; method?: string },
    unknown,
    FetchBaseQueryError
  >,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>,
  searchTerm: string,
  date: string,
  page: number,
  pageSize: number
): Promise<{ data?: NewsAPIResponse; error?: FetchBaseQueryError }> {
  const clampedPage = Math.min(page, MAX_PAGE);

  const url =
    `${NEWSAPI_BASE_URL}/everything?` +
    `q=${encodeURIComponent(searchTerm)}` +
    `&from=${date}` +
    `&page=${clampedPage}` +
    `&pageSize=${pageSize}` +
    `&apiKey=${NEWSAPI_KEY}`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);

  if (result.error) {
    return { error: result.error };
  }
  return { data: result.data as NewsAPIResponse };
}
