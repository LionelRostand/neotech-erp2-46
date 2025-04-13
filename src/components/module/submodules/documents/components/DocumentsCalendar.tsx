
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
      if (dateString === 'Invalid Date' || dateString === 'NaN' || dateString === 'undefined' || dateString.trim() === '') {
        return null;
      }
      
      // Try to parse the date safely
      if (typeof dateString !== 'string') {
        console.warn('Non-string date value:', dateString);
        return null;
      }
      
      // Skip already formatted dates showing "Date non valide"
      if (dateString === 'Date non valide') {
        return null;
      }
      
      // Try multiple parsing strategies
      
      // 1. Handle numeric timestamps
      if (/^\d+$/.test(dateString)) {
        const timestamp = parseInt(dateString, 10);
        const date = new Date(timestamp);
        if (isValid(date) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100) {
          return date;
        }
        return null;
      }
      
      // 2. Try to parse as ISO date first (most reliable)
      try {
        const isoDate = parseISO(dateString);
        if (isValid(isoDate) && isoDate.getFullYear() >= 1900 && isoDate.getFullYear() <= 2100) {
          return isoDate;
        }
      } catch (e) {
        // Ignore and try the next method
      }
      
      // 3. Try DD/MM/YYYY format (common in French locale)
      if (/\d{1,2}[/.-]\d{1,2}[/.-]\d{4}/.test(dateString)) {
        const parts = dateString.split(/[/.-]/);
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // months are 0-based
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month, day);
          if (isValid(date)) {
            return date;
          }
        }
      }
      
      // 4. Try standard Date parsing as last resort
      const date = new Date(dateString);
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

  // Convert and validate document dates - using useMemo for performance
  const documentDates = useMemo(() => {
    return documents
      .map(doc => {
        // Try all possible date fields
        const dateStr = doc.uploadDate || doc.createdAt || doc.date;
        if (!dateStr || typeof dateStr === 'string' && (dateStr === 'Date non valide' || dateStr.includes('non valide'))) {
          // Skip invalid dates that were marked as such by the formatter
          return null;
        }
        return safeParseDate(dateStr);
      })
      .filter((date): date is Date => date !== null);
  }, [documents]);

  // Create a map of dates to document counts - also using useMemo
  const dateToDocCount = useMemo(() => {
    return documentDates.reduce<Record<string, number>>((acc, date) => {
      try {
        if (!date || !isValid(date)) return acc;
        
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
    if (month && isValid(month)) {
      setCurrentMonth(month);
    }
  };

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setSelectedDate(date);
      onSelectDate(date);
    }
  };

  // Return a custom content for each day that has documents
  const renderDay = (day: Date) => {
    try {
      if (!day || !isValid(day)) {
        return <div>{day?.getDate?.() ?? '?'}</div>;
      }
      
      let dateStr: string;
      try {
        dateStr = format(day, 'yyyy-MM-dd');
      } catch (e) {
        console.error('Error formatting day in renderDay:', e);
        return <div>{day?.getDate?.() ?? '?'}</div>;
      }
      
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
