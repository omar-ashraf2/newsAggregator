/**
 * FilterPanel.tsx
 *
 * Renders various filter controls:
 *  - Date range picker
 *  - Category dropdown
 *  - Source dropdown
 *  - Sort order dropdown
 *
 * Single Responsibility: manage user filter inputs & dispatch them to Redux.
 */

import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORIES, SORT_OPTIONS, SOURCES } from "@/constants";
import {
  setDateRange,
  setFilterCategory,
  setFilterSource,
  setSortOrder,
} from "@/features/filters/filterSlice";
import { cn } from "@/lib/utils";
import { SortOrder } from "@/types/SortOrder";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useDispatch, useSelector } from "react-redux";
import { DropdownSelect } from "./common";

const FilterPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { fromDate, toDate, category, source, sortOrder } = useSelector(
    (state: RootState) => state.filters
  );

  const [date, setDate] = useState<DateRange | undefined>(
    fromDate && toDate
      ? { from: new Date(fromDate), to: new Date(toDate) }
      : undefined
  );

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
            onSelect={(newDate) => {
              setDate(newDate);
              dispatch(
                setDateRange({
                  from: newDate?.from ? format(newDate.from, "yyyy-MM-dd") : "",
                  to: newDate?.to ? format(newDate.to, "yyyy-MM-dd") : "",
                })
              );
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Category */}
      <DropdownSelect
        value={category}
        options={CATEGORIES}
        onChange={(value) => dispatch(setFilterCategory(value))}
        placeholder="Select category"
      />
      {/* Source */}
      <DropdownSelect
        value={source}
        options={SOURCES}
        onChange={(value) => dispatch(setFilterSource(value))}
        placeholder="Select source"
      />
      {/* Sort Order */}
      <DropdownSelect
        value={sortOrder}
        options={SORT_OPTIONS}
        onChange={(value) => dispatch(setSortOrder(value as SortOrder))}
        placeholder="Select sort order"
      />
    </div>
  );
};

export default FilterPanel;
