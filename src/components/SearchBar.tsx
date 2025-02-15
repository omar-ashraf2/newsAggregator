import { Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearchChange(inputValue);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, onSearchChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove all special characters, allow only letters, numbers, and spaces.
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
    setInputValue(sanitizedValue);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for articles..."
        value={inputValue}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background text-foreground border border-border shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-lg"
      />

      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all"
        size={20}
      />
    </div>
  );
};

export default SearchBar;
