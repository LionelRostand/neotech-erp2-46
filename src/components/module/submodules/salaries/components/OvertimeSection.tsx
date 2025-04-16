
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface OvertimeSectionProps {
  overtimeHours: string;
  setOvertimeHours: (hours: string) => void;
  overtimeRate: string;
  setOvertimeRate: (rate: string) => void;
}

const OvertimeSection: React.FC<OvertimeSectionProps> = ({
  overtimeHours,
  setOvertimeHours,
  overtimeRate,
  setOvertimeRate
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="overtimeSection">Heures supplémentaires</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
        <div className="space-y-2">
          <Label htmlFor="overtimeHours">Nombre d'heures supplémentaires</Label>
          <Input 
            id="overtimeHours" 
            placeholder="0" 
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overtimeRate">Majoration (%)</Label>
          <Input 
            id="overtimeRate" 
            placeholder="25" 
            type="number"
            value={overtimeRate}
            onChange={(e) => setOvertimeRate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default OvertimeSection;
