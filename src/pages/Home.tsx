import FilterPanel from "@/components/FilterPanel";
import NewsFeed from "@/components/NewsFeed";
import PaginationControls from "@/components/PaginationControls";
import SearchBar from "@/components/SearchBar";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import { useCallback, useState } from "react";

const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  const { data, isLoading, isFetching, error } = useFetchArticlesQuery({
    searchTerm,
    fromDate,
    toDate,
    category: filterCategory,
    source: filterSource,
    page,
  });

  const isValidPage = !error && (data?.articles?.length ?? 0) > 0;

  let totalPages = 1;
  if (data?.totalResults && data?.pageSize) {
    totalPages = Math.min(Math.ceil(data.totalResults / data.pageSize), 100);
  }

  const handleDateChange = useCallback((from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setFilterCategory(category);
    setPage(1);
  }, []);

  const handleSourceChange = useCallback((source: string) => {
    setFilterSource(source);
    setPage(1);
  }, []);

  return (
    <div className="container mx-auto min-h-screen bg-background p-4">
      <header className="py-28">
        <h1 className="flex flex-col justify-center items-center text-6xl font-bold mb-4 text-foreground uppercase">
          <span>Get Informed</span>
          <span className="border-b-[12px] border-b-[#f52828] w-max">
            Get Inspired
          </span>
        </h1>
        <h2 className="text-2xl font-light text-center text-foreground">
          Stories Curated For You
        </h2>
      </header>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <FilterPanel
        fromDate={fromDate}
        toDate={toDate}
        category={filterCategory}
        source={filterSource}
        onDateChange={handleDateChange}
        onCategoryChange={handleCategoryChange}
        onSourceChange={handleSourceChange}
      />

      <NewsFeed
        articles={data?.articles ?? []}
        isLoading={isLoading || isFetching}
      />

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
