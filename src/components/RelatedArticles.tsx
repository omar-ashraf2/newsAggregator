import { ArticleCard, ArticleSkeleton } from "@/components";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";

interface RelatedArticlesProps {
  currentArticleId: string;
  source: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentArticleId,
  source,
}) => {
  const { data, isLoading: relatedLoading } = useFetchArticlesQuery(
    {
      searchTerm: "",
      fromDate: "",
      toDate: "",
      category: "all",
      source,
      page: 1,
      sortOrder: "newest",
    },
    { refetchOnMountOrArgChange: true }
  );

  // filter out the same article from the results, just show 4
  const relatedArticles =
    data?.articles.filter((a) => a.id !== currentArticleId).slice(0, 4) || [];

  return (
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
      ) : relatedArticles.length > 2 ? (
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
  );
};

export default RelatedArticles;
