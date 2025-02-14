import FilterPanel from "@/components/FilterPanel";
import NewsFeed from "@/components/NewsFeed";
import PaginationControls from "@/components/PaginationControls";
import SearchBar from "@/components/SearchBar";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import { useState } from "react";

const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("technology");
  const [filterDate, setFilterDate] = useState("");
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
