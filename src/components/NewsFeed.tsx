import ArticleList from "@/components/ArticleList";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import EmptyScreen from "@/components/common/EmptyScreen";
import { Article } from "@/types/Article";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface NewsFeedProps {
  articles: Article[];
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, idx) => (
          <ArticleSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return <EmptyScreen message="An error occurred while fetching articles." />;
  }

  if (articles.length === 0) {
    return <EmptyScreen message="No articles found." />;
  }

  return <ArticleList articles={articles} />;
};

export default NewsFeed;
