/**
 * ArticleCard.tsx
 *
 * Displays a single article card:
 *  - Fetches "related articles" from the aggregator (RTK Query).
 */

import guardianLogo from "@/assets/guardianLogo.png";
import placeholderImage from "@/assets/news-placeholder.webp";
import newsApiLogo from "@/assets/newsLogo.png";
import nytLogo from "@/assets/nytLogo.png";
import { getTimeAgo } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import { Article } from "@/types/Article";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const sourceLogos: Record<string, string> = {
  "New York Times": nytLogo,
  "The Guardian": guardianLogo,
  NewsApi: newsApiLogo,
};

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = memo<ArticleCardProps>(({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${encodeURIComponent(article.id)}`, {
      state: { article },
    });
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer backdrop-blur-md border border-border rounded-xl shadow-lg p-4 transition-all",
        "hover:shadow-2xl hover:-translate-y-1 active:scale-95"
      )}
    >
      <div className="relative w-full h-64">
        <img
          src={article.imageUrl || placeholderImage}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl transition-opacity duration-300 hover:opacity-90"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
        />
      </div>

      <div className="mt-4">
        <h2 className="text-base md:text-xl font-heading font-bold text-foreground leading-snug line-clamp-2">
          {article.title}
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-3">
          {article.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          {article.source ? (
            <img
              src={sourceLogos[article.source]}
              alt={article.source}
              title={article.source}
              className="h-6 md:h-8 object-contain dark:invert"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-muted-foreground">
              {article.source}
            </span>
          )}

          <span className="text-xs text-muted-foreground">
            {getTimeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
});

ArticleCard.displayName = "ArticleCard";
export default ArticleCard;
