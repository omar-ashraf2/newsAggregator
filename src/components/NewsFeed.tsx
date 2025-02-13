import ArticleList from "@/components/ArticleList";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import { Article } from "@/types/Article";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface NewsFeedProps {
  articles: Article[];
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, isLoading, error }) => {
  return (
    <div>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ArticleSkeleton key={idx} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-destructive-foreground">
          Error fetching articles: {String(error)}
        </div>
      )}

      {!isLoading && !error && articles && <ArticleList articles={articles} />}
    </div>
  );
};

export default NewsFeed;
