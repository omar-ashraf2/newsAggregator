import type { NYTimesResponseWrapper } from "@/types/NYTimes";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const MAX_PAGE = 100;
const NYTIMES_BASE_URL = import.meta.env.VITE_NYTIMES_BASE_URL;
const NYTIMES_KEY = import.meta.env.VITE_NYTIMES_KEY;

const NYT_CATEGORY_MAP: Record<string, string> = {
  business: "Business",
  technology: "Technology",
  science: "Science",
  sports: "Sports",
  health: "Health",
  entertainment: "Arts",
  world: "World",
};

export async function nyTimesApi(
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
  page: number
): Promise<{ data?: NYTimesResponseWrapper; error?: FetchBaseQueryError }> {
  // Convert 1-based page to 0-based
  const clampedPage = Math.min(Math.max(page, 1), MAX_PAGE) - 1;
  const zeroBasedPage = clampedPage < 0 ? 0 : clampedPage;

  const query = encodeURIComponent(searchTerm.trim() || "");

  const params: string[] = [];

  params.push(`q=${query}`);

  if (fromDate) {
    params.push(`begin_date=${fromDate.replace(/-/g, "")}`);
  }
  if (toDate) {
    params.push(`end_date=${toDate.replace(/-/g, "")}`);
  }

  // If category != 'all', map it to news_desk
  if (category !== "all") {
    const newsDesk = NYT_CATEGORY_MAP[category];
    if (newsDesk) {
      params.push(`fq=news_desk:(${encodeURIComponent(`"${newsDesk}"`)})`);
    }
  }

  let sortParam = "newest";
  if (sortOrder === "oldest") sortParam = "oldest";
  if (sortOrder === "relevance") sortParam = "best";

  // Sort, pagination, API key
  params.push(`sort=${sortParam}`);
  params.push(`page=${zeroBasedPage}`);
  params.push(`api-key=${NYTIMES_KEY}`);

  const url = `${NYTIMES_BASE_URL}/articlesearch.json?${params.join("&")}`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);
  if (result.error) return { error: result.error };

  return { data: result.data as NYTimesResponseWrapper };
}
