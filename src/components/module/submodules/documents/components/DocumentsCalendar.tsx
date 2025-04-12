
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { fr } from 'date-fns/locale';
import { format, isSameDay, isValid, parseISO } from 'date-fns';
import { HrDocument } from '@/hooks/useDocumentsData';

interface DocumentsCalendarProps {
  documents: HrDocument[];
  onSelectDate: (date: Date) => void;
}

export const DocumentsCalendar: React.FC<DocumentsCalendarProps> = ({ documents, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Safely convert strings to dates and validate them
  const safeParseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    
    try {
      // Check for problematic values
      if (dateString === 'Invalid Date' || dateString === 'NaN' || dateString === 'undefined') {
        return null;
      }
      
      // Try to parse the date safely
      if (typeof dateString !== 'string') {
        console.warn('Non-string date value:', dateString);
        return null;
      }
      
      // Handle numeric timestamps
      if (/^\d+$/.test(dateString)) {
        const timestamp = parseInt(dateString, 10);
        const date = new Date(timestamp);
        if (isValid(date) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100) {
          return date;
        }
        return null;
      }
      
      // Try to parse as ISO date first
      try {
        const isoDate = parseISO(dateString);
        if (isValid(isoDate) && isoDate.getFullYear() >= 1900 && isoDate.getFullYear() <= 2100) {
          return isoDate;
        }
      } catch (e) {
        // Ignore and try the next method
      }
      
      // Try standard Date parsing
      const timestamp = Date.parse(dateString);
      if (isNaN(timestamp)) {
        console.warn('Invalid date:', dateString);
        return null;
      }
      
      const date = new Date(timestamp);
      if (!isValid(date) || date.getFullYear() < 1900 || date.getFullYear() > 2100) {
        console.warn('Date is not valid after parsing:', dateString);
        return null;
      }
      
      return date;
    } catch (e) {
      console.warn('Error parsing date:', dateString, e);
      return null;
    }
  };

  // Convert and validate document dates - moved to useMemo for performance
  const documentDates = useMemo(() => {
    return documents
      .map(doc => {
        // Try all possible date fields
        const dateStr = doc.uploadDate || doc.createdAt || doc.date;
        return safeParseDate(dateStr);
      })
      .filter((date): date is Date => date !== null);
  }, [documents]);

  // Create a map of dates to document counts - also moved to useMemo
  const dateToDocCount = useMemo(() => {
    return documentDates.reduce<Record<string, number>>((acc, date) => {
      try {
        if (!isValid(date)) return acc;
        
        const dateStr = format(date, 'yyyy-MM-dd');
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
      } catch (e) {
        console.error('Error formatting date in reduce:', e);
        return acc;
      }
    }, {});
  }, [documentDates]);

  // Handle month change
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onSelectDate(date);
    }
  };

  // Return a custom content for each day that has documents
  const renderDay = (day: Date) => {
    try {
      if (!day || !isValid(day)) {
        return <div>{day?.getDate?.() ?? '?'}</div>;
      }
      
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = dateToDocCount[dateStr] || 0;
      
      return (
        <div className="relative">
          <div>{day.getDate()}</div>
          {count > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-[10px] p-0"
            >
              {count}
            </Badge>
          )}
        </div>
      );
    } catch (e) {
      console.error('Error rendering day:', e);
      return <div>{day?.getDate?.() ?? '?'}</div>;
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        onMonthChange={handleMonthChange}
        locale={fr}
        month={currentMonth}
        components={{
          Day: ({ date, displayMonth }) => {
            if (!date) return null;
            try {
              return renderDay(date);
            } catch (e) {
              console.error('Error in Day component:', e);
              return <div>{date?.getDate?.() ?? '?'}</div>;
            }
          }
        }}
        className="p-3 pointer-events-auto"
      />
    </div>
  );
};
