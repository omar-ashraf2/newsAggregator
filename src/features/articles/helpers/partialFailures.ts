/**
 * partialFailures.ts
 *
 * Helper for processing settled fetch promises (Promise.allSettled).
 * Extracts partial failures, transforms data, and accumulates total results.
 *
 * Adheres to SRP: This file does only partial-failure logic.
 */

import type { Article } from "@/types/Article";

import { GuardianResponse } from "@/types/Guardian";
import { NewsAPIResponse } from "@/types/NewsAPI";
import { NYTimesResponseWrapper } from "@/types/NYTimes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  transformGuardianData,
  transformNewsAPIData,
  transformNYTimesData,
} from "./mergeArticles";

// Our type guards can be local or imported from aggregator
function isNewsAPIResponse(data: unknown): data is NewsAPIResponse {
  return (
    !!data && typeof data === "object" && "status" in data && "articles" in data
  );
}

function isGuardianResponse(data: unknown): data is GuardianResponse {
  return !!data && typeof data === "object" && "response" in data;
}

function isNYTimesResponse(data: unknown): data is NYTimesResponseWrapper {
  return (
    !!data && typeof data === "object" && "status" in data && "response" in data
  );
}

export function handleSettledResults(
  settledResults: PromiseSettledResult<
    | {
        source: string;
        data: null;
        error: null;
      }
    | {
        data?: unknown;
        error?: FetchBaseQueryError;
        source: string;
      }
  >[]
) {
  const allArticles: Article[] = [];
  let totalResultsSum = 0;
  const failedSources: string[] = [];
  const failedMessages: string[] = [];

  for (const result of settledResults) {
    if (result.status === "fulfilled") {
      const { source, data, error } = result.value;
      if (error) {
        failedSources.push(source);
        const msg =
          (error.data as { message?: string })?.message ||
          `${source} request failed.`;
        failedMessages.push(msg);
      } else if (data) {
        // Data transformations
        if (source === "NewsApi" && isNewsAPIResponse(data)) {
          const articles = transformNewsAPIData(data);
          allArticles.push(...articles);
          totalResultsSum += data.totalResults || 0;
        } else if (source === "The Guardian" && isGuardianResponse(data)) {
          const articles = transformGuardianData(data);
          allArticles.push(...articles);
          totalResultsSum += data.response.total || 0;
        } else if (source === "New York Times" && isNYTimesResponse(data)) {
          const articles = transformNYTimesData(data);
          allArticles.push(...articles);
          totalResultsSum += data.response.meta.hits || 0;
        }
      }
    } else {
      failedSources.push("Unknown source");
      failedMessages.push("A source request failed unexpectedly.");
    }
  }

  return {
    allArticles,
    totalResultsSum,
    failedSources,
    failedMessages,
  };
}
