"use client";

import { useState } from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface RegisteredDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function RegisteredDate({ date, onDateChange }: RegisteredDateProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground justify-between w-full"
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
