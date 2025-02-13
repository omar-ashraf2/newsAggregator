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

  const { data, isLoading, isFetching, error } = useFetchArticlesQuery({
    searchTerm,
    date: filterDate,
    category: filterCategory,
    source: filterSource,
    page,
  });

  const showSkeleton = isLoading || isFetching;
  const isValidPage = !error && (data?.articles?.length ?? 0) > 0;

  let totalPages = 1;
  if (data?.totalResults && data?.pageSize) {
    totalPages = Math.min(Math.ceil(data.totalResults / data.pageSize), 100);
  }

  return (
    <div className="container mx-auto min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-foreground">
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
      <NewsFeed articles={data?.articles ?? []} isLoading={showSkeleton} />
      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isValidPage={isValidPage}
        />
      </div>
    </div>
  );
};

export default Home;
