
import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ScheduleSelectorProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ date, onDateChange }) => {
  const [selectedHour, setSelectedHour] = useState<number>(
    date ? date.getHours() : new Date().getHours() + 1
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    date ? date.getMinutes() : 0
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Conserver l'heure et les minutes précédemment sélectionnées
      selectedDate.setHours(selectedHour, selectedMinute);
      onDateChange(selectedDate);
    } else {
      onDateChange(undefined);
    }
  };

  const handleTimeChange = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hour, minute);
      onDateChange(newDate);
    }
  };

  // Générer les options d'heures (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Générer les options de minutes (0, 15, 30, 45)
  const minutes = [0, 15, 30, 45];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Sélecteur de date */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Date</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP', { locale: fr }) : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date < new Date()} // Désactiver les dates passées
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Sélecteur d'heure */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Heure</span>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[130px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
                disabled={!date}
              >
                <ClockIcon className="mr-2 h-4 w-4" />
                {date ? `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}` : "Heure"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Heures</p>
                    <div className="h-60 overflow-y-auto pr-2">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className={`cursor-pointer p-2 rounded ${
                            selectedHour === hour ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleTimeChange(hour, selectedMinute)}
                        >
                          {hour.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Minutes</p>
                    <div>
                      {minutes.map((minute) => (
                        <div
                          key={minute}
                          className={`cursor-pointer p-2 rounded ${
                            selectedMinute === minute ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleTimeChange(selectedHour, minute)}
                        >
                          {minute.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSelector;
