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
  // Get today's date for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

  // Function to disable past dates
  const disablePastDates = (date: Date) => {
    const dateToCheck = new Date(date)
    dateToCheck.setHours(0, 0, 0, 0)
    return dateToCheck < today
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Past dates - Grey and disabled */
          .rdp .rdp-button_reset.rdp-button.rdp-day:disabled,
          .rdp .rdp-day_disabled,
          .rdp button[disabled].rdp-day {
            background-color: #374151 !important;
            color: #9CA3AF !important;
            opacity: 0.6 !important;
            cursor: not-allowed !important;
            pointer-events: none !important;
            border-radius: 6px !important;
          }

          /* Today's date - RED TEXT ONLY, no background */
          .rdp .rdp-day_today,
          .rdp button.rdp-day_today,
          .rdp .rdp-button.rdp-day_today,
          .rdp .rdp-button_reset.rdp-button.rdp-day_today,
          .calendar-custom .rdp-day_today,
          .calendar-custom button.rdp-day_today {
            background-color: transparent !important;
            color: #fc0b20 !important;
            font-weight: bold !important;
            border-radius: 6px !important;
          }

          /* Selected date - RED TEXT ONLY, no background */
          .rdp .rdp-day_selected,
          .rdp button.rdp-day_selected,
          .rdp .rdp-button.rdp-day_selected,
          .rdp .rdp-button_reset.rdp-button.rdp-day_selected,
          .rdp .rdp-day[aria-selected="true"],
          .rdp button[aria-selected="true"],
          .calendar-custom .rdp-day_selected,
          .calendar-custom button.rdp-day_selected {
            background-color: transparent !important;
            color: #fc0b20 !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
          }

          /* Remove ALL hover effects */
          .rdp .rdp-day_today:hover,
          .rdp button.rdp-day_today:hover,
          .rdp .rdp-day_selected:hover,
          .rdp button.rdp-day_selected:hover,
          .rdp .rdp-button_reset.rdp-button.rdp-day:hover {
            background-color: transparent !important;
          }

          /* Override any conflicting styles - TEXT COLOR ONLY */
          .rdp button[class*="day_today"] {
            background-color: transparent !important;
            color: #fc0b20 !important;
          }

          .rdp button[class*="day_selected"] {
            background-color: transparent !important;
            color: #fc0b20 !important;
          }

          /* Regular available dates - remove hover effects */
          .rdp .rdp-button_reset.rdp-button.rdp-day:not(:disabled):not(.rdp-day_selected):not(.rdp-day_today) {
            background-color: transparent !important;
            color: white !important;
          }

          .rdp .rdp-button_reset.rdp-button.rdp-day:not(:disabled):not(.rdp-day_selected):not(.rdp-day_today):hover {
            background-color: transparent !important;
            color: white !important;
          }
        `
      }} />
      
    <DayPicker
      showOutsideDays={showOutsideDays}
        disabled={disablePastDates}
        className={cn("p-4 bg-black text-white rounded-lg calendar-custom", className)}
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
            "h-9 w-9 p-0 font-normal text-white rounded-md transition-colors border-none bg-transparent calendar-day"
        ),
        day_range_end: "day-range-end",
          // Remove conflicting Tailwind classes - let CSS handle it
          day_selected: "",
          day_today: "",
          day_outside: "day-outside text-gray-500 opacity-50",
          day_disabled: "calendar-disabled text-gray-400 bg-gray-700 opacity-60 cursor-not-allowed hover:bg-gray-700 hover:text-gray-400 rounded-md pointer-events-none",
          day_range_middle: "aria-selected:bg-gray-800 aria-selected:text-white",
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
    </>
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 