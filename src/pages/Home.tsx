import { RootState } from "@/app/store";
import FilterPanel from "@/components/FilterPanel";
import NewsFeed from "@/components/NewsFeed";
import PaginationControls from "@/components/PaginationControls";
import SearchBar from "@/components/SearchBar";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import {
  setDateRange,
  setFilterCategory,
  setFilterSource,
  setPage,
  setSearchTerm,
} from "@/features/filters/filterSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { searchTerm, fromDate, toDate, filterCategory, filterSource, page } =
    useSelector((state: RootState) => state.filters);

  const effectiveFromDate = fromDate && toDate ? fromDate : "";
  const effectiveToDate = fromDate && toDate ? toDate : "";
  const skipQuery = Boolean((fromDate && !toDate) || (!fromDate && toDate));

  const { data, isLoading, isFetching, error } = useFetchArticlesQuery(
    {
      searchTerm,
      fromDate: effectiveFromDate,
      toDate: effectiveToDate,
      category: filterCategory,
      source: filterSource,
      page,
    },
    { refetchOnMountOrArgChange: true, skip: skipQuery }
  );

  const isValidPage = !error && (data?.articles?.length ?? 0) > 0;

  let totalPages = 1;
  if (data?.totalResults && data?.pageSize) {
    totalPages = Math.min(Math.ceil(data.totalResults / data.pageSize), 100);
  }

  const handleDateChange = useCallback(
    (from: string, to: string) => {
      dispatch(setDateRange({ from, to }));
    },
    [dispatch]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      dispatch(setFilterCategory(category));
    },
    [dispatch]
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      dispatch(setFilterSource(source));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

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

      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

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
          onPageChange={(p) => dispatch(setPage(p))}
          isValidPage={isValidPage}
        />
      </div>
    </div>
  );
};

export default Home;
