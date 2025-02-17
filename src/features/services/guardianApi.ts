import type { GuardianResponse } from "@/types/Guardian";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const MAX_PAGE = 100;
const GUARDIAN_BASE_URL = import.meta.env.VITE_GUARDIAN_BASE_URL;
const GUARDIAN_KEY = import.meta.env.VITE_GUARDIAN_KEY;

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
  category: string,
  fromDate: string,
  toDate: string,
  sortOrder: "newest" | "oldest" | "relevance" = "newest",
  page: number,
  pageSize: number
): Promise<{ data?: GuardianResponse; error?: FetchBaseQueryError }> {
  // Clamp page
  const clampedPage = Math.min(Math.max(page, 1), MAX_PAGE);

  const q = searchTerm.trim() || "";
  const params: string[] = [];

  params.push(`q=${encodeURIComponent(q)}`);

  // If category != "all", map it
  if (category !== "all") {
    const guardianSection = GUARDIAN_CATEGORY_MAP[category];
    if (guardianSection) {
      params.push(`section=${encodeURIComponent(guardianSection)}`);
    }
  }

  // Date filters
  if (fromDate) params.push(`from-date=${fromDate}`);
  if (toDate) params.push(`to-date=${toDate}`);

  let orderBy = "newest";
  if (sortOrder === "oldest") orderBy = "oldest";
  if (sortOrder === "relevance") orderBy = "relevance";

  // Page, page-size, etc.
  params.push(`page=${clampedPage}`);
  params.push(`page-size=${pageSize}`);
  params.push(`order-by=${orderBy}`);
  params.push("show-fields=thumbnail,trailText,byline");
  params.push(`api-key=${GUARDIAN_KEY}`);

  const url = `${GUARDIAN_BASE_URL}/search?${params.join("&")}`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);
  if (result.error) return { error: result.error };

  return { data: result.data as GuardianResponse };
}
