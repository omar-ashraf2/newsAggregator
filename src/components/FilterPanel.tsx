import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterPanelProps {
  fromDate: string;
  toDate: string;
  category: string;
  source: string;
  onDateChange: (from: string, to: string) => void;
  onCategoryChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  fromDate,
  toDate,
  category,
  source,
  onDateChange,
  onCategoryChange,
  onSourceChange,
}) => {
  const [date, setDate] = useState<DateRange | undefined>(
    fromDate && toDate
      ? { from: new Date(fromDate), to: new Date(toDate) }
      : undefined
  );

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onDateChange(
      newDate?.from ? format(newDate.from, "yyyy-MM-dd") : "",
      newDate?.to ? format(newDate.to, "yyyy-MM-dd") : ""
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 my-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] flex items-center justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from
              ? `${format(date.from, "LLL dd, yyyy")} ${
                  date.to ? ` - ${format(date.to, "LLL dd, yyyy")}` : ""
                }`
              : "Pick a date range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

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
