"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ date, onChange, label = "Select date" }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
            type="button"
          >
            {date ? (() => {
              const [day, month, year] = date.split("-");
              return `${day}-${month}-${year}`;
            })() : "Select date"}

            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            captionLayout="dropdown"
            onSelect={(selected) => {
              if (selected) {
                const day = String(selected.getDate()).padStart(2, "0");
                const month = String(selected.getMonth() + 1).padStart(2, "0");
                const year = selected.getFullYear();
                const formatted = `${day}-${month}-${year}`;
                onChange(formatted);
              }
              setOpen(false);
            }}

          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
