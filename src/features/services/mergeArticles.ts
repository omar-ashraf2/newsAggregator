import type { Article } from "@/types/Article";
import type { GuardianResponse } from "@/types/Guardian";
import type { NewsAPIResponse } from "@/types/NewsAPI";
import type { NYTimesResponseWrapper } from "@/types/NYTimes";

export function transformNewsAPIData(newsData: NewsAPIResponse | undefined): Article[] {
  return (newsData?.articles || []).map((item) => ({
    id: item.url,
    title: item.title,
    description: item.description,
    url: item.url,
    imageUrl: item.urlToImage || null,
    publishedAt: item.publishedAt,
    source: item.source.name,
  }));
}

export function transformGuardianData(
  guardianData: GuardianResponse | undefined
): Article[] {
  return (guardianData?.response?.results || []).map((item) => ({
    id: item.id,
    title: item.webTitle,
    description: "",
    url: item.webUrl,
    imageUrl: item.fields?.thumbnail || null,
    publishedAt: item.webPublicationDate,
    source: "The Guardian",
  }));
}

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
    return {
      id: item.web_url,
      title: item.headline.main,
      description: item.abstract,
      url: item.web_url,
      imageUrl,
      publishedAt: item.pub_date,
      source: "New York Times",
    };
  });
}

/** Merge arrays & sort newest first. */
export function mergeAndSortArticles(
  articlesNewsAPI: Article[],
  articlesGuardian: Article[],
  articlesNYTimes: Article[]
): Article[] {
  const combined = [
    ...articlesNewsAPI,
    ...articlesGuardian,
    ...articlesNYTimes,
  ];
  return combined.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
