import { useState } from "react";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import ArticleList from "@/components/ArticleList";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import FilterPanel from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";

interface NewsFeedProps {
  page: number;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ page }) => {
  const [searchTerm, setSearchTerm] = useState("technology");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterCategory, setFilterCategory] = useState("technology");
  const [filterSource, setFilterSource] = useState("");

  const {
    data: articles,
    error,
    isLoading,
  } = useFetchArticlesQuery({
    searchTerm,
    date: filterDate,
    category: filterCategory,
    source: filterSource,
    page,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        News Aggregator
      </h1>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <FilterPanel
        date={filterDate}
        category={filterCategory}
        source={filterSource}
        onDateChange={setFilterDate}
        onCategoryChange={setFilterCategory}
        onSourceChange={setFilterSource}
      />
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ArticleSkeleton key={idx} />
          ))}
        </div>
      )}
      {error && (
        <div className="text-destructive-foreground">
          Error fetching articles.
        </div>
      )}
      {articles && <ArticleList articles={articles} />}
    </div>
  );
};

export default NewsFeed;
