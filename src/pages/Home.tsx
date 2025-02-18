/**
 * Home.tsx
 *
 * The main page:
 *  - Renders header, search, filters
 *  - Fetches articles (RTK Query) => pass to NewsFeed
 *  - Paginates
 */

import { RootState } from "@/app/store";
import { FilterPanel, NewsFeed, PaginationControls } from "@/components";
import { SearchBar } from "@/components/common";
import { useFetchArticlesQuery } from "@/features/articles/articlesApi";
import { setPage } from "@/features/filters/filterSlice";
import { useDispatch, useSelector } from "react-redux";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);

  // RTK Query fetch
  const { data, isLoading, isFetching, error } = useFetchArticlesQuery(
    filters,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  return (
    <div className="container mx-auto min-h-screen bg-background p-4">
      <header className="py-28">
        <h1 className="flex flex-col justify-center items-center text-6xl font-bold mb-4 text-foreground uppercase">
          <span>Get Informed</span>
          <span className="border-b-[12px] border-b-[#811211] w-max">
            Get Inspired
          </span>
        </h1>
        <h2 className="text-2xl font-light text-center text-foreground">
          Stories Curated For You
        </h2>
      </header>

      <SearchBar />
      <FilterPanel />

      <NewsFeed
        articles={data?.articles ?? []}
        isLoading={isLoading || isFetching}
        error={error}
      />

      {!!data?.articles?.length && (
        <div className="mt-6 flex justify-center">
          <PaginationControls
            currentPage={filters.page}
            totalResults={data?.totalResults ?? 0}
            combinedPageSize={data?.combinedPageSize ?? 0}
            onPageChange={(newPage) => dispatch(setPage(newPage))}
            disabled={isLoading || isFetching}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
