
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from "lucide-react";

interface StylistsStatusProps {
  availableStylists: number;
  busyStylists: number;
  offStylists: number;
  totalStylists: number;
}

const StylistsStatus: React.FC<StylistsStatusProps> = ({ 
  availableStylists, 
  busyStylists, 
  offStylists, 
  totalStylists 
}) => {
  const availablePercentage = Math.round(100 * availableStylists / totalStylists);
  const busyPercentage = Math.round(100 * busyStylists / totalStylists);
  const offPercentage = Math.round(100 * offStylists / totalStylists);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            <span>Statut des Coiffeurs</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{availableStylists}</p>
              <p className="text-xs text-gray-500">{availablePercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupés</p>
              <p className="text-2xl font-bold text-blue-600">{busyStylists}</p>
              <p className="text-xs text-gray-500">{busyPercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Absents</p>
              <p className="text-2xl font-bold text-orange-600">{offStylists}</p>
              <p className="text-xs text-gray-500">{offPercentage}%</p>
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-green-500 float-left rounded-l-full" 
              style={{ width: `${availablePercentage}%` }} 
            />
            <div 
              className="h-full bg-blue-500 float-left" 
              style={{ width: `${busyPercentage}%` }} 
            />
            <div 
              className="h-full bg-orange-500 float-left rounded-r-full" 
              style={{ width: `${offPercentage}%` }} 
            />
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <div className="font-medium">Prochaines disponibilités:</div>
            <p className="mt-2">• Lucie Blanc - <span className="font-medium">14:30</span></p>
            <p>• Marc Lefebvre - <span className="font-medium">15:45</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StylistsStatus;
