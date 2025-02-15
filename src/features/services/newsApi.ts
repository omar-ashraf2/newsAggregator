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
  fromDate: string,
  toDate: string,
  category: string,
  page: number,
  pageSize: number
): Promise<{ data?: NewsAPIResponse; error?: FetchBaseQueryError }> {
  const clampedPage = Math.min(page, MAX_PAGE);

  let query = "";
  let endpoint = "everything";

  if (searchTerm.trim()) {
    query = `q=${encodeURIComponent(searchTerm)}`;
  } else if (category !== "all") {
    query = `category=${encodeURIComponent(category)}`;
    endpoint = "top-headlines";
  } else {
    query = "q=breaking news";
  }

  const url =
    `${NEWSAPI_BASE_URL}/${endpoint}?${query}` +
    (fromDate ? `&from=${fromDate}` : "") +
    (toDate ? `&to=${toDate}` : "") +
    `&sortBy=publishedAt` +
    `&page=${clampedPage}` +
    `&pageSize=${pageSize}` +
    `&apiKey=${NEWSAPI_KEY}`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);

  if (result.error) return { error: result.error };
  return { data: result.data as NewsAPIResponse };
}
