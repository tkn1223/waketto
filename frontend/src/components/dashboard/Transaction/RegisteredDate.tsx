"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils";

interface RegisteredDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function RegisteredDate({
  date,
  onDateChange,
  className,
}: RegisteredDateProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground justify-between w-full",
            className
          )}
        >
          <CalendarIcon />
          {date ? format(date, "yyyy/M/d") : null}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          startMonth={new Date(new Date().getFullYear(), -1)}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onDateChange(selectedDate);
              setCalendarOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
