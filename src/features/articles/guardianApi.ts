/**
 * guardianApi.ts
 *
 * Fetches data from The Guardian `search` endpoint.
 */

import { getEnv } from "@/config";
import type { GuardianResponse } from "@/types/Guardian";
import { SortOrder } from "@/types/SortOrder";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const MAX_PAGE = 50;

/* For Dev (Uncomment to use in dev environment and comment out prod) */
// const GUARDIAN_BASE_URL = import.meta.env.VITE_GUARDIAN_BASE_URL;
// const GUARDIAN_KEY = import.meta.env.VITE_GUARDIAN_KEY;

/* For Prod */
const GUARDIAN_BASE_URL = getEnv("VITE_GUARDIAN_BASE_URL");
const GUARDIAN_KEY = getEnv("VITE_GUARDIAN_KEY");

const GUARDIAN_CATEGORY_MAP: Record<string, string> = {
  business: "business",
  technology: "technology",
  science: "science",
  sports: "sport",
  health: "society",
  entertainment: "culture",
  world: "world",
};

export async function guardianApi(
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
  sortOrder: SortOrder = "newest",
  page: number,
  pageSize?: number
): Promise<{ data?: GuardianResponse; error?: FetchBaseQueryError }> {
  const clampedPage = Math.min(Math.max(page, 1), MAX_PAGE);

  // Build query
  const q = searchTerm.trim() || "";
  const params: string[] = [];
  params.push(`q=${encodeURIComponent(q)}`);

  // Map category => Guardian section
  if (category !== "all") {
    const guardianSection = GUARDIAN_CATEGORY_MAP[category];
    if (guardianSection) {
      params.push(`section=${encodeURIComponent(guardianSection)}`);
    }
  }

  // date filters
  if (fromDate) params.push(`from-date=${fromDate}`);
  if (toDate) params.push(`to-date=${toDate}`);

  // orderBy => "newest", "oldest", or "relevance"
  let orderBy = "newest";
  if (sortOrder === "oldest") orderBy = "oldest";
  if (sortOrder === "relevance") orderBy = "relevance";

  params.push(`page=${clampedPage}`);
  params.push(`page-size=${pageSize}`);
  params.push(`order-by=${orderBy}`);
  params.push("show-fields=thumbnail,trailText,byline");
  params.push(`api-key=${GUARDIAN_KEY}`);

  const url = `${GUARDIAN_BASE_URL}/search?${params.join("&")}`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);
  if (result.error) {
    return { error: result.error };
  }
  return { data: result.data as GuardianResponse };
}
