"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addDays,
  formatDisplayDate,
  fromIsoDate,
  todayIso,
  toIsoDate,
} from "@/utils/date";

interface DateSelectorProps {
  /** Selected date as a local-time ISO string (YYYY-MM-DD). */
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

/**
 * Reusable, fully controlled date picker: calendar popover plus
 * previous/next-day and "Today" shortcuts. Knows nothing about tasks,
 * stores, or where the date is used.
 */
export function DateSelector({ value, onChange, className }: DateSelectorProps) {
  const [open, setOpen] = useState(false);
  const isToday = value === todayIso();

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(toIsoDate(date));
      setOpen(false);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous day"
        onClick={() => onChange(addDays(value, -1))}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" className="min-w-48 justify-start gap-2" />
          }
        >
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
          <span>{formatDisplayDate(value)}</span>
          {isToday && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Today
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={fromIsoDate(value)}
            defaultMonth={fromIsoDate(value)}
            onSelect={handleSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        aria-label="Next day"
        onClick={() => onChange(addDays(value, 1))}
      >
        <ChevronRight className="size-4" aria-hidden />
      </Button>

      {!isToday && (
        <Button variant="ghost" onClick={() => onChange(todayIso())}>
          Today
        </Button>
      )}
    </div>
  );
}
