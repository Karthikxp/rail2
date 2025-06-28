"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-black text-white rounded-lg", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-lg font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-8 w-8 bg-transparent p-0 text-white hover:bg-gray-800 rounded-md transition-colors border-none"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell:
          "text-gray-300 rounded-md w-9 font-medium text-sm text-center",
        row: "flex w-full mt-1",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal text-white hover:bg-gray-800 rounded-md transition-colors border-none bg-transparent"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-red text-white hover:bg-red hover:text-white focus:bg-red focus:text-white rounded-md",
        day_today: "bg-gray-800 text-white rounded-md",
        day_outside:
          "day-outside text-gray-500 opacity-50",
        day_disabled: "text-gray-600 opacity-50",
        day_range_middle:
          "aria-selected:bg-gray-800 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 