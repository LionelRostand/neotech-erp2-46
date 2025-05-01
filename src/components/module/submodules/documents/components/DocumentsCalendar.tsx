
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

  // Create a function to check if a date has documents
  const hasDocumentsForDate = (date: Date) => {
    return documentDates.some((docDate) => 
      docDate && isValid(docDate) && isSameDay(docDate, date)
    );
  };

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onSelectDate(date);
    }
  };

  // Handle month change
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Render calendar day with potential badges
  const renderCalendarDay = (day: Date) => {
    const hasDocuments = hasDocumentsForDate(day);
    
    return (
      <div className="relative">
        <div>{format(day, 'd')}</div>
        {hasDocuments && (
          <Badge className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 p-0">
            <span className="sr-only">Documents disponibles</span>
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      locale={fr}
      className="rounded-md border"
      onMonthChange={handleMonthChange}
    />
  );
};
