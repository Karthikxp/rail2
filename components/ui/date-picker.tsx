"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  className?: string;
  children?: (date: Date | undefined, formattedDate: string) => React.ReactNode;
  onDateChange?: (date: Date | undefined) => void;
}

export function DatePicker({ className, children, onDateChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()
  const [isOpen, setIsOpen] = React.useState(false)
  const formattedDate = date ? format(date, "MMM dd, yyyy") : "Pick a date"

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setIsOpen(false) // Close popover when date is selected
    }
    // Call the optional callback
    if (onDateChange) {
      onDateChange(selectedDate)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children ? children(date, formattedDate) : (
          <Button
            variant="outline"
            data-empty={!date}
            className={cn(
              "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
              className
            )}
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black border-none">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  )
} 