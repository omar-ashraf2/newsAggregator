import type { Article } from "@/types/Article";
import type { GuardianResponse } from "@/types/Guardian";
import type { NewsAPIResponse } from "@/types/NewsAPI";
import type { NYTimesResponseWrapper } from "@/types/NYTimes";

/**
 * Convert NewsAPI articles to our unified Article format.
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
 * Convert NYTimes articles to our unified Article format.
 */
export function transformNYTimesData(
  nyData: NYTimesResponseWrapper | undefined
): Article[] {
  return (nyData?.response.docs || []).map((item) => {
    let imageUrl: string | null = null;
    if (item.multimedia && item.multimedia.length > 0) {
      const highResMedia =
        item.multimedia.find(
          (media) =>
            media.subtype === "superJumbo" || media.subtype === "xlarge"
        ) || item.multimedia[0];
      if (highResMedia && highResMedia.url) {
        imageUrl = "https://www.nytimes.com/" + highResMedia.url;
      }
    }

    let publisher = "Unknown";
    if (item.byline && item.byline.person && item.byline.person.length > 0) {
      const person = item.byline.person[0];
      publisher =
        `${person.firstname || ""} ${person.lastname || ""}`.trim() ||
        "Unknown";
    } else if (item.byline && item.byline.original) {
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

/** Merge arrays & sort */
export function mergeAndSortArticles(
  articles: Article[],
  sortOrder: "newest" | "oldest" | "relevance"
): Article[] {
  // Filter out invalid or missing dates
  const validArticles = articles.filter(
    (article) =>
      article.publishedAt && !isNaN(new Date(article.publishedAt).getTime())
  );

  if (sortOrder === "newest") {
    return validArticles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } else if (sortOrder === "oldest") {
    return validArticles.sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
  } else {
    return validArticles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}
