
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { fr } from 'date-fns/locale';
import { format, isSameDay, isValid } from 'date-fns';
import { HrDocument } from '@/hooks/useDocumentsData';

interface DocumentsCalendarProps {
  documents: HrDocument[];
  onSelectDate: (date: Date) => void;
}

export const DocumentsCalendar: React.FC<DocumentsCalendarProps> = ({ documents, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Safely parse date strings to avoid invalid date errors
  const safeParseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    
    try {
      // Check if the string is empty or invalid
      if (!dateString.trim() || dateString === 'Date non valide') {
        return null;
      }
      
      // Handle French date format (DD/MM/YYYY)
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
      
      // Standard date parsing with validation
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
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
        return safeParseDate(dateStr);
      })
      .filter((date): date is Date => date !== null && isValid(date));
  }, [documents]);

  // Create a map of dates to document counts
  const dateToDocCount = useMemo(() => {
    const counts: Record<string, number> = {};
    
    try {
      documentDates.forEach(date => {
        if (date && isValid(date)) {
          const dateStr = format(date, 'yyyy-MM-dd');
          counts[dateStr] = (counts[dateStr] || 0) + 1;
        }
      });
    } catch (error) {
      console.error('Error creating date map:', error);
    }
    
    return counts;
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
          Day: ({ date }) => {
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
