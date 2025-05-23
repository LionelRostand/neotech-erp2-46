
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { fr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  fromMonth?: Date
  toMonth?: Date
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Sélectionner une date",
  className,
  fromMonth,
  toMonth
}: DatePickerProps) {
  // Safely format the date, handling potential undefined or invalid dates
  const getFormattedDate = () => {
    try {
      return date && date instanceof Date && !isNaN(date.getTime()) 
        ? format(date, "dd/MM/yyyy", { locale: fr }) 
        : null;
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };
  
  const formattedDate = getFormattedDate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate ? formattedDate : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={fr}
          fromMonth={fromMonth}
          toMonth={toMonth}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  )
}
