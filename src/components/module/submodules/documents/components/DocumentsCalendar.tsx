
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { fr } from 'date-fns/locale';
import { format, isSameDay, parseISO } from 'date-fns';
import { HrDocument } from '@/hooks/useDocumentsData';

interface DocumentsCalendarProps {
  documents: HrDocument[];
  onSelectDate: (date: Date) => void;
}

export const DocumentsCalendar: React.FC<DocumentsCalendarProps> = ({ documents, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Convert and validate document dates
  const documentDates = documents
    .map(doc => {
      try {
        if (!doc.uploadDate) return null;
        // Try to parse the date safely
        const timestamp = Date.parse(doc.uploadDate);
        if (isNaN(timestamp)) return null;
        return new Date(timestamp);
      } catch (e) {
        console.warn('Invalid date in document:', doc.uploadDate);
        return null;
      }
    })
    .filter((date): date is Date => date !== null);

  // Create a map of dates to document counts
  const dateToDocCount = documentDates.reduce<Record<string, number>>((acc, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

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
    const dateStr = format(day, 'yyyy-MM-dd');
    const count = dateToDocCount[dateStr];
    
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
          Day: ({ date, displayMonth }) => {
            if (!date) return null;
            return renderDay(date);
          }
        }}
        className="p-3 pointer-events-auto"
      />
    </div>
  );
};
