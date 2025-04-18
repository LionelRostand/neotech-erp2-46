
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

  // Improved safe date parser with better validation
  const safeParseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    
    try {
      // Skip empty or explicitly invalid strings
      if (!dateString.trim() || dateString === 'Date non valide') {
        return null;
      }
      
      // Handle French date format (DD/MM/YYYY)
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        return isValid(parsedDate) ? parsedDate : null;
      }
      
      // Try ISO parsing first (most reliable)
      try {
        const isoDate = parseISO(dateString);
        if (isValid(isoDate)) {
          return isoDate;
        }
      } catch (e) {
        // Continue to standard parsing if ISO parsing fails
      }
      
      // Standard date parsing
      const date = new Date(dateString);
      return isValid(date) ? date : null;
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
        if (!dateStr) return null;
        return safeParseDate(dateStr);
      })
      .filter((date): date is Date => date !== null);
  }, [documents]);

  // Create a map of dates to document counts
  const dateToDocCount = useMemo(() => {
    try {
      return documentDates.reduce<Record<string, number>>((acc, date) => {
        if (!date || !isValid(date)) return acc;
        
        try {
          const dateStr = format(date, 'yyyy-MM-dd');
          acc[dateStr] = (acc[dateStr] || 0) + 1;
        } catch (error) {
          console.error('Error formatting date in reduce:', error);
        }
        
        return acc;
      }, {});
    } catch (error) {
      console.error('Error creating date map:', error);
      return {};
    }
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

  // Safer day rendering with better error handling
  const renderDay = (day: Date) => {
    try {
      if (!day || !isValid(day)) {
        return <div>{day?.getDate?.() ?? '?'}</div>;
      }
      
      let dateStr: string;
      try {
        dateStr = format(day, 'yyyy-MM-dd');
      } catch (e) {
        console.error('Error formatting day in renderDay:', e, day);
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
      return <div>?</div>;
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
