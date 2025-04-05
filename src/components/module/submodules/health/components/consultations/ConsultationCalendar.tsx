
import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface ConsultationCalendarProps {
  consultationDates: Date[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const ConsultationCalendar: React.FC<ConsultationCalendarProps> = ({
  consultationDates,
  onDateSelect,
  selectedDate
}) => {
  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className="rounded-md"
      />
    </Card>
  );
};

export default ConsultationCalendar;
