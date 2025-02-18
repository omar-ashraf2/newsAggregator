/**
 * ArticleDetail.tsx
 *
 * Displays a single article in detail:
 *  - Fetches "related articles" from the aggregator (RTK Query).
 *  - Shows an image, details, "You Might Also Like" suggestions.
 */

import placeholderImage from "@/assets/news-placeholder.webp";
import ArticleHeader from "@/components/ArticleHeader";
import { EmptyScreen } from "@/components/common";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  article?: {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    publishedAt: string;
    source: string;
    publisher?: string;
  };
}

const ArticleDetail = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state?.article) {
    return <EmptyScreen message="Article details not found." />;
  }

  const { article } = state;

  return (
    <div className="bg-background min-h-screen px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center space-x-2 hover:text-primary/85 transition"
        aria-label="Go back"
      >
        <ArrowLeftIcon />
        <span>Back</span>
      </button>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 order-2 md:order-1">
          <div className="relative group overflow-hidden rounded-lg shadow-lg">
            <img
              src={article.imageUrl || placeholderImage}
              alt={article.title}
              loading="lazy"
              className="w-full h-[340px] object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                Full Article
                <ArrowRightIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <ArticleHeader article={article} />
      </div>

      {/* Related Articles Section */}
      <RelatedArticles currentArticleId={article.id} source={article.source} />
    </div>
  );
});

ArticleDetail.displayName = "ArticleDetail";
export default ArticleDetail;
