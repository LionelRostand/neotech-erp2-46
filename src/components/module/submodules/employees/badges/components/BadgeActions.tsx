
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { BadgeData } from '../BadgeTypes';

interface BadgeActionsProps {
  onDownload: () => void;
  onPrint: () => void;
  onDelete?: (badge: BadgeData) => void;
  badge: BadgeData | null;
}

const BadgeActions: React.FC<BadgeActionsProps> = ({
  onDownload,
  onPrint,
  onDelete,
  badge
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onDownload} 
        className="flex-1" 
        variant="outline"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger le badge
      </Button>
      
      <Button
        onClick={onPrint}
        className="flex-1"
        variant="default"
      >
        <Printer className="h-4 w-4 mr-2" />
        Imprimer le badge
      </Button>
      
      {onDelete && badge && (
        <Button 
          onClick={() => onDelete(badge)}
          variant="destructive"
          className="flex-shrink-0"
        >
          Supprimer
        </Button>
      )}
    </div>
  );
};

export default BadgeActions;
