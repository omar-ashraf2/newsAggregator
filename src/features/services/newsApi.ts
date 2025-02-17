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
  sortOrder: "newest" | "oldest" | "relevance" = "newest",
  page: number,
  pageSize: number
): Promise<{ data?: NewsAPIResponse; error?: FetchBaseQueryError }> {
  const clampedPage = Math.min(Math.max(page, 1), MAX_PAGE);

  const queryParts: string[] = [];
  const trimmedSearch = searchTerm.trim();

  if (trimmedSearch) {
    queryParts.push(trimmedSearch);
  }
  if (category !== "all") {
    queryParts.push(category);
  }

  if (queryParts.length === 0) {
    queryParts.push("breaking news");
  }

  const finalQuery = queryParts.join(" ");

  const params: string[] = [];
  params.push(`q=${encodeURIComponent(finalQuery)}`);

  if (fromDate) params.push(`from=${fromDate}`);
  if (toDate) params.push(`to=${toDate}`);

  let sortParam = "publishedAt";
  if (sortOrder === "relevance") {
    sortParam = "relevancy";
  }

  params.push(`sortBy=${sortParam}`);
  params.push(`page=${clampedPage}`);
  params.push(`pageSize=${pageSize}`);
  params.push(`apiKey=${NEWSAPI_KEY}`);

  const url = `${NEWSAPI_BASE_URL}/everything?${params.join("&")}`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);

  if (result.error) return { error: result.error };
  return { data: result.data as NewsAPIResponse };
}
