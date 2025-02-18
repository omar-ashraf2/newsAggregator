/**
 * DropdownSelect.tsx
 *
 * A reusable dropdown component built on top of the 'Select' component.
 */

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memo } from "react";

interface DropdownSelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder: string;
}

const DropdownSelect = memo<DropdownSelectProps>(
  ({ value, options, onChange, placeholder }) => {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

DropdownSelect.displayName = "DropdownSelect";
export default DropdownSelect;
