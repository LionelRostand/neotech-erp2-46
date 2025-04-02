
import React from 'react';
import { Card } from '@/components/ui/card';
import TransportBookingTemplate from '../../website/templates/TransportBookingTemplate';

interface WebBookingPreviewProps {
  isEditing: boolean;
}

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ isEditing }) => {
  return (
    <div className={isEditing ? "border rounded-lg" : "bg-background"}>
      <div className={isEditing ? "px-4 py-2 border-b flex items-center justify-between bg-muted/50" : "hidden"}>
        <span className="text-sm font-medium">Aperçu du site</span>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className={isEditing ? "p-4 bg-background overflow-auto" : ""}>
        <TransportBookingTemplate isEditable={isEditing} />
      </div>
    </div>
  );
};

export default WebBookingPreview;
