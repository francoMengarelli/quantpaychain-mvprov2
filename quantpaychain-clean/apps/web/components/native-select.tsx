"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NativeSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  options: Array<{ value: string; label: string }>;
  id?: string;
}

export function NativeSelect({
  value,
  onChange,
  placeholder,
  className,
  options,
  id
}: NativeSelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-10 px-3 py-2 pr-10 rounded-md border appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950",
          "transition-all duration-200",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
