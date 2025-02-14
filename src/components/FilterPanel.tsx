import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col md:flex-row gap-4 my-4">
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

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={source} onValueChange={onSourceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sources</SelectLabel>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="NewsAPI">NewsAPI</SelectItem>
            <SelectItem value="TheGuardian">The Guardian</SelectItem>
            <SelectItem value="NYTimes">New York Times</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterPanel;
