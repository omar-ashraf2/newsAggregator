import guardianLogo from "@/assets/guardianLogo.png";
import placeholderImage from "@/assets/news-placeholder.webp";
import newsApiLogo from "@/assets/newsLogo.png";
import nytLogo from "@/assets/nytLogo.png";
import { ArticleCard, ArticleSkeleton } from "@/components";
import { EmptyScreen } from "@/components/common";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  article?: {
    id: string;
    title: string;
    description: string;
    content?: string;
    url: string;
    imageUrl?: string;
    publishedAt: string;
    source: string;
    publisher?: string;
  };
}

const sourceLogos: Record<string, string> = {
  "New York Times": nytLogo,
  "The Guardian": guardianLogo,
  NewsApi: newsApiLogo,
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

const ArticleDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const { data: relatedData, isLoading: relatedLoading } =
    useFetchArticlesQuery(
      {
        searchTerm: "",
        fromDate: "",
        toDate: "",
        category: "all",
        source: state?.article?.source || "all",
        page: 1,
        sortOrder: "newest",
      },
      { refetchOnMountOrArgChange: true }
    );

  if (!state?.article) {
    return <EmptyScreen message="Article details not found." />;
  }

  const { article } = state;

  const relatedArticles =
    relatedData?.articles.filter((a) => a.id !== article?.id).slice(0, 4) || [];

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
          <img
            src={article.imageUrl || placeholderImage}
            alt={article.title}
            className="w-full h-auto object-cover rounded-md shadow-lg"
          />
        </div>
        <div className="flex-1 space-y-3 order-1 md:order-2">
          <h2 className="text-2xl md:text-3xl font-heading font-bold leading-snug text-primary">
            {article.title}
          </h2>

          <div className="flex items-center gap-2 text-sm font-light">
            <img
              src={sourceLogos[article.source] || placeholderImage}
              alt={article.source}
              title={article.source}
              className="h-8 w-8 object-contain dark:invert"
            />
            <span className="text-amber-600 font-semibold font-serif">
              {article.source}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-muted-foreground">
              {getTimeAgo(article.publishedAt)}
            </span>
          </div>

          {article.publisher !== "Unknown" && (
            <p className="text-sm italic text-sky-700">
              By {article.publisher}
            </p>
          )}

          <p className="text-muted-foreground leading-relaxed">
            {article.description}
          </p>
          {article.content && (
            <div className="text-gray-200 leading-relaxed">
              {article.content}
            </div>
          )}

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold mt-4 bg-foreground text-primary-foreground px-6 py-3 rounded-md shadow-lg hover:bg-foreground/80 transition duration-200"
          >
            Read Full Article
          </a>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <h3 className="text-center text-2xl font-heading font-bold mb-6">
          You Might Also Like
        </h3>
        {relatedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, idx) => (
              <ArticleSkeleton key={idx} />
            ))}
          </div>
        ) : relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-xl">
            No related articles found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
