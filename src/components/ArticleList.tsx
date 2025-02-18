/**
 * ArticleList.tsx
 *
 * Renders a grid of ArticleCards.
 */

import { ArticleCard } from "@/components";
import type { Article } from "@/types/Article";
import { memo } from "react";

interface ArticleListProps {
  articles: Article[];
}

const ArticleList = memo<ArticleListProps>(({ articles }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
});

ArticleList.displayName = "ArticleList";
export default ArticleList;
