import { ChangeEvent } from "react";

interface FilterPanelProps {
  date: string;
  category: string;
  source: string;
  onDateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  date,
  category,
  source,
  onDateChange,
  onCategoryChange,
  onSourceChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 my-4">
      <input
        type="date"
        value={date}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onDateChange(e.target.value)
        }
        className="p-2 border border-border rounded bg-background"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="p-2 border border-border rounded bg-background"
      >
        <option value="">All Categories</option>
        <option value="technology">Technology</option>
        <option value="business">Business</option>
        <option value="sports">Sports</option>
      </select>
      <select
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        className="p-2 border border-border rounded bg-background"
      >
        <option value="">All Sources</option>
        <option value="NewsAPI">NewsAPI</option>
        <option value="TheGuardian">The Guardian</option>
        <option value="NYTimes">New York Times</option>
      </select>
    </div>
  );
};

export default FilterPanel;
