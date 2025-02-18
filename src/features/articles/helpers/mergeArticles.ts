/**
 * transformAndMerge.ts
 *
 * Functions for transforming source-specific data into a unified Article format,
 * plus a helper to merge & sort all articles by a user-specified criterion.
 */

import type { Article } from "@/types/Article";
import type { GuardianResponse } from "@/types/Guardian";
import type { NewsAPIResponse } from "@/types/NewsAPI";
import type { NYTimesResponseWrapper } from "@/types/NYTimes";
import { SortOrder } from "@/types/SortOrder";

/**
 * Convert NewsAPI articles to our unified Article format.
 * @param newsData NewsAPI response (optional).
 * @returns Array of Articles in a standardized shape.
 */
export function transformNewsAPIData(
  newsData: NewsAPIResponse | undefined
): Article[] {
  return (newsData?.articles || []).map((item) => ({
    id: item.url,
    title: item.title,
    description: item.description,
    url: item.url,
    imageUrl: item.urlToImage || null,
    publishedAt: item.publishedAt,
    source: "NewsApi",
    publisher: item.author || "Unknown",
  }));
}

/**
 * Convert The Guardian articles to our unified Article format.
 * @param guardianData Guardian response (optional).
 * @returns Array of standardized Articles.
 */
export function transformGuardianData(
  guardianData: GuardianResponse | undefined
): Article[] {
  return (guardianData?.response?.results || []).map((item) => ({
    id: item.id,
    title: item.webTitle,
    description: item.fields?.trailText || "",
    url: item.webUrl,
    imageUrl: item.fields?.thumbnail || null,
    publishedAt: item.webPublicationDate,
    source: "The Guardian",
    publisher: item.fields?.byline || "Unknown",
  }));
}

/**
 * Convert New York Times articles to our unified Article format.
 * @param nyData NYTimes response (optional).
 * @returns Array of standardized Articles.
 */
export function transformNYTimesData(
  nyData: NYTimesResponseWrapper | undefined
): Article[] {
  return (nyData?.response.docs || []).map((item) => {
    // Attempt to find a high-resolution image
    let imageUrl: string | null = null;
    if (item.multimedia && item.multimedia.length > 0) {
      const highResMedia =
        item.multimedia.find((media) =>
          ["superJumbo", "xlarge"].includes(media.subtype)
        ) || item.multimedia[0];
      if (highResMedia?.url) {
        imageUrl = "https://www.nytimes.com/" + highResMedia.url;
      }
    }

    // Derive a "publisher" from byline data
    let publisher = "Unknown";
    if (item.byline?.person?.length) {
      const person = item.byline.person[0];
      publisher =
        `${person.firstname || ""} ${person.lastname || ""}`.trim() ||
        "Unknown";
    } else if (item.byline?.original) {
      // Remove leading "By " if present
      publisher = item.byline.original.replace(/^By\s+/i, "");
    }

    return {
      id: item.web_url,
      title: item.headline.main,
      description: item.abstract,
      url: item.web_url,
      imageUrl,
      publishedAt: item.pub_date,
      source: "New York Times",
      publisher,
    };
  });
}

/**
 * Merge arrays of Articles & sort them based on the sort order.
 * @param articles Raw list of articles from multiple sources.
 * @param sortOrder How we want to sort the final list.
 * @returns Filtered & sorted array of valid Articles.
 */
export function mergeAndSortArticles(
  articles: Article[],
  sortOrder: SortOrder
): Article[] {
  // Filter out articles missing or invalid `publishedAt`
  const validArticles = articles.filter(
    (article) =>
      article.publishedAt && !isNaN(new Date(article.publishedAt).getTime())
  );

  switch (sortOrder) {
    case "newest":
      return validArticles.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

    case "oldest":
      return validArticles.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );

    case "relevance":
    default:
      // For "relevance" or any fallback, we sort newest-first.
      return validArticles.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }
}
