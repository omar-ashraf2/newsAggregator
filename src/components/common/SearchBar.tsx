/**
 * SearchBar.tsx
 *
 * A debounced search input that updates Redux after 1s.
 */

import { RootState } from "@/app/store";
import { setSearchTerm } from "@/features/filters/filterSlice";
import { Search } from "lucide-react";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SearchBar = memo(() => {
  const dispatch = useDispatch();
  const reduxSearchTerm = useSelector(
    (state: RootState) => state.filters.searchTerm
  );
  const [inputValue, setInputValue] = useState(reduxSearchTerm);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(setSearchTerm(inputValue));
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove all special chars & limit length to 70
    let sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
    if (sanitizedValue.length > 70) {
      sanitizedValue = sanitizedValue.substring(0, 70);
    }
    setInputValue(sanitizedValue);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search articles, keywords, authors, and more..."
        value={inputValue}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background text-foreground border border-border shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-lg max-md:placeholder:text-xs"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all"
        size={20}
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";
export default SearchBar;
