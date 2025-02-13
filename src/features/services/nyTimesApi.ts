import type { NYTimesResponseWrapper } from "@/types/NYTimes";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const MAX_PAGE = 100;

const NYTIMES_BASE_URL = import.meta.env.VITE_NYTIMES_BASE_URL;
const NYTIMES_KEY = import.meta.env.VITE_NYTIMES_KEY;

export async function nyTimesApi(
  baseQuery: BaseQueryFn<
    string | { url: string; method?: string },
    unknown,
    FetchBaseQueryError
  >,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>,
  searchTerm: string,
  page: number
): Promise<{ data?: NYTimesResponseWrapper; error?: FetchBaseQueryError }> {
  const zeroBasedPage = Math.min(page - 1, MAX_PAGE - 1);
  const clampedPage = zeroBasedPage < 0 ? 0 : zeroBasedPage;

  const url =
    `${NYTIMES_BASE_URL}/articlesearch.json?` +
    `q=${encodeURIComponent(searchTerm)}` +
    `&page=${clampedPage}` +
    `&api-key=${NYTIMES_KEY}`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);

  if (result.error) {
    return { error: result.error };
  }
  return { data: result.data as NYTimesResponseWrapper };
}
