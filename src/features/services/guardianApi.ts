import type { GuardianResponse } from "@/types/Guardian";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const MAX_PAGE = 100;

const GUARDIAN_BASE_URL = import.meta.env.VITE_GUARDIAN_BASE_URL;
const GUARDIAN_KEY = import.meta.env.VITE_GUARDIAN_KEY;

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
  page: number,
  pageSize: number
): Promise<{ data?: GuardianResponse; error?: FetchBaseQueryError }> {
  const clampedPage = Math.min(page, MAX_PAGE);

  const url =
    `${GUARDIAN_BASE_URL}/search?` +
    (searchTerm ? `q=${encodeURIComponent(searchTerm)}` : "") +
    (category !== "all" ? `&section=${encodeURIComponent(category)}` : "") +
    (fromDate ? `&from-date=${fromDate}` : "") +
    (toDate ? `&to-date=${toDate}` : "") +
    `&page=${clampedPage}` +
    `&page-size=${pageSize}` +
    `&api-key=${GUARDIAN_KEY}` +
    `&order-by=newest` +
    `&show-fields=thumbnail,trailText,byline`;

  const result = await baseQuery({ url, method: "GET" }, api, extraOptions);

  if (result.error) return { error: result.error };
  return { data: result.data as GuardianResponse };
}
