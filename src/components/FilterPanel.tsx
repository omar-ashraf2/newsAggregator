import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import DropdownSelect from "@/components/ui/DropdownSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORIES } from "@/constants/categories";
import { SORT_OPTIONS } from "@/constants/sortOrder";
import { SOURCES } from "@/constants/sources";
import { SortOrder } from "@/features/filters/filterSlice";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  fromDate: string;
  toDate: string;
  category: string;
  source: string;
  sortOrder: SortOrder;
  onDateChange: (from: string, to: string) => void;
  onCategoryChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onSortChange: (value: SortOrder) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  fromDate,
  toDate,
  category,
  source,
  sortOrder,
  onDateChange,
  onCategoryChange,
  onSourceChange,
  onSortChange,
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
    <div className="flex flex-col md:flex-row gap-4 my-4 items-start">
      {/* Date range */}
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

      {/* Category */}
      <DropdownSelect
        value={category}
        options={CATEGORIES}
        onChange={onCategoryChange}
        placeholder="Select category"
      />

      {/* Source */}
      <DropdownSelect
        value={source}
        options={SOURCES}
        onChange={onSourceChange}
        placeholder="Select source"
      />

      {/* Sort Order */}
      <DropdownSelect
        value={sortOrder}
        options={SORT_OPTIONS}
        onChange={(val) => onSortChange(val as SortOrder)}
        placeholder="Select sort order"
      />
    </div>
  );
};

export default FilterPanel;
