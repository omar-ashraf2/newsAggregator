import { ChangeEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search for articles..."
      value={searchTerm}
      onChange={handleChange}
      className="w-full p-2 border border-border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
};

export default SearchBar;
