
import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import ScheduleSelector from '../ScheduleSelector';

interface ScheduleTabProps {
  isScheduled: boolean;
  scheduledDate: Date | undefined;
  onIsScheduledChange: (value: boolean) => void;
  onDateChange: (date: Date | undefined) => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({
  isScheduled,
  scheduledDate,
  onIsScheduledChange,
  onDateChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="schedule-checkbox"
          className="mt-1"
          checked={isScheduled}
          onChange={(e) => onIsScheduledChange(e.target.checked)}
        />
        <div>
          <Label 
            htmlFor="schedule-checkbox" 
            className="font-medium"
          >
            Programmer l'envoi
          </Label>
          <p className="text-sm text-muted-foreground">
            Le message sera envoyé automatiquement à la date et l'heure spécifiées
          </p>
        </div>
      </div>
      
      {isScheduled && (
        <ScheduleSelector 
          date={scheduledDate}
          onDateChange={onDateChange}
        />
      )}
      
      <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded border border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800">
            Les messages programmés peuvent être modifiés ou annulés avant leur envoi depuis l'onglet "Programmés".
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
