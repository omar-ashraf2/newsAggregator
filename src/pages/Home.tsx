import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/app/store";
import FilterPanel from "@/components/FilterPanel";
import NewsFeed from "@/components/NewsFeed";
import PaginationControls from "@/components/PaginationControls";
import SearchBar from "@/components/SearchBar";

import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import type { SortOrder } from "@/features/filters/filterSlice";
import {
  setDateRange,
  setFilterCategory,
  setFilterSource,
  setPage,
  setSearchTerm,
  setSortOrder,
} from "@/features/filters/filterSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const {
    searchTerm,
    fromDate,
    toDate,
    filterCategory,
    filterSource,
    page,
    sortOrder,
  } = useSelector((state: RootState) => state.filters);

  const { data, isLoading, isFetching, error } = useFetchArticlesQuery(
    {
      searchTerm,
      fromDate,
      toDate,
      category: filterCategory,
      source: filterSource,
      page,
      sortOrder,
    },
    { refetchOnMountOrArgChange: false }
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  const handleDateChange = useCallback(
    (from: string, to: string) => {
      dispatch(setDateRange({ from, to }));
    },
    [dispatch]
  );

  const handleCategoryChange = useCallback(
    (cat: string) => {
      dispatch(setFilterCategory(cat));
    },
    [dispatch]
  );

  const handleSourceChange = useCallback(
    (src: string) => {
      dispatch(setFilterSource(src));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (sort: SortOrder) => {
      dispatch(setSortOrder(sort));
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
        sortOrder={sortOrder}
        onDateChange={handleDateChange}
        onCategoryChange={handleCategoryChange}
        onSourceChange={handleSourceChange}
        onSortChange={handleSortChange}
      />

      <NewsFeed
        articles={data?.articles ?? []}
        isLoading={isLoading || isFetching}
        error={error}
      />

      {!!data?.articles?.length && (
        <div className="mt-6 flex justify-center">
          <PaginationControls
            currentPage={page}
            totalResults={data?.totalResults ?? 0}
            combinedPageSize={data?.combinedPageSize ?? 0}
            onPageChange={handlePageChange}
            disabled={isLoading || isFetching}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
