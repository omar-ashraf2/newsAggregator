import FilterPanel from "@/components/FilterPanel";
import NewsFeed from "@/components/NewsFeed";
import PaginationControls from "@/components/PaginationControls";
import SearchBar from "@/components/SearchBar";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import { useState } from "react";

const Home: React.FC = () => {
  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("technology");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterCategory, setFilterCategory] = useState("technology");
  const [filterSource, setFilterSource] = useState("");

  const { data, error, isLoading, isFetching } = useFetchArticlesQuery({
    searchTerm,
    date: filterDate,
    category: filterCategory,
    source: filterSource,
    page,
  });

  const showSkeleton = isLoading || isFetching;

  const rawTotalPages =
    data && data.totalResults && data.pageSize
      ? Math.ceil(data.totalResults / data.pageSize)
      : 1;

  const totalPages = Math.min(rawTotalPages, 100);

  return (
    <div className="container mx-auto min-h-screen bg-background p-4">
      <h1 className="text-3xl text-center font-bold mb-4 text-foreground">
        News Feed
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

      <NewsFeed
        articles={data ? data.articles : []}
        isLoading={showSkeleton}
        error={error}
      />

      <div className="mt-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(Math.min(p, 100))}
        />
      </div>
    </div>
  );
};

export default Home;
