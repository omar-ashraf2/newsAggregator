import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article } from "@/types/Article";
import { FetchArticlesParams } from "@/types/FetchArticlesParams";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    fetchArticles: builder.query<Article[], FetchArticlesParams>({
      async queryFn(params, _queryApi, _extraOptions, baseQuery) {
        const { searchTerm, date, category, page } = params;

        // Get API keys from environment variables
        const newsAPIKey = import.meta.env.VITE_NEWSAPI_KEY;
        const guardianAPIKey = import.meta.env.VITE_GUARDIAN_KEY;
        const nytimesAPIKey = import.meta.env.VITE_NYTIMES_KEY;

        // Construct URLs for the different APIs
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          searchTerm
        )}&from=${date}&page=${page}&apiKey=${newsAPIKey}`;
        const guardianUrl = `https://content.guardianapis.com/search?q=${encodeURIComponent(
          searchTerm
        )}&section=${category}&page=${page}&api-key=${guardianAPIKey}`;
        const nytimesUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(
          searchTerm
        )}&page=${page}&api-key=${nytimesAPIKey}`;

        const [newsResult, guardianResult, nytimesResult] = await Promise.all([
          baseQuery(newsApiUrl),
          baseQuery(guardianUrl),
          baseQuery(nytimesUrl),
        ]);

        // Check for errors in any of the responses
        if (newsResult.error) return { error: newsResult.error };
        if (guardianResult.error) return { error: guardianResult.error };
        if (nytimesResult.error) return { error: nytimesResult.error };

        // Parse and transform responses to your unified Article type
        const newsData = newsResult.data as {
          articles: {
            url: string;
            title: string;
            description: string;
            urlToImage: string;
            publishedAt: string;
            source: { name: string };
          }[];
        };
        interface GuardianResponse {
          response: {
            results: {
              id: string;
              webTitle: string;
              webUrl: string;
              webPublicationDate: string;
            }[];
          };
        }
        const guardianData = guardianResult.data as GuardianResponse;
        interface NYTimesResponse {
          response: {
            docs: {
              web_url: string;
              headline: { main: string };
              abstract: string;
              pub_date: string;
            }[];
          };
        }
        const nytimesData = nytimesResult.data as NYTimesResponse;

        const articlesNewsAPI: Article[] = (newsData.articles || []).map(
          (item: {
            url: string;
            title: string;
            description: string;
            urlToImage: string;
            publishedAt: string;
            source: { name: string };
          }) => ({
            id: item.url,
            title: item.title,
            description: item.description,
            url: item.url,
            imageUrl: item.urlToImage,
            publishedAt: item.publishedAt,
            source: item.source?.name || "NewsAPI",
          })
        );

        const articlesGuardian: Article[] = (
          guardianData.response?.results || []
        ).map(
          (item: {
            id: string;
            webTitle: string;
            webUrl: string;
            webPublicationDate: string;
          }) => ({
            id: item.id,
            title: item.webTitle,
            description: "",
            url: item.webUrl,
            publishedAt: item.webPublicationDate,
            source: "The Guardian",
          })
        );

        const articlesNYTimes: Article[] = (
          nytimesData.response?.docs || []
        ).map(
          (item: {
            web_url: string;
            headline: { main: string };
            abstract: string;
            pub_date: string;
          }) => ({
            id: item.web_url,
            title: item.headline.main,
            description: item.abstract,
            url: item.web_url,
            publishedAt: item.pub_date,
            source: "New York Times",
          })
        );

        const combinedArticles = [
          ...articlesNewsAPI,
          ...articlesGuardian,
          ...articlesNYTimes,
        ].sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );

        return { data: combinedArticles };
      },
    }),
  }),
});

export const { useFetchArticlesQuery } = articlesApi;
