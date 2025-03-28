
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => {
  return (
    <Button 
      variant="default" 
      size="sm" 
      onClick={onClick} 
      className="flex items-center bg-green-600 hover:bg-green-700"
    >
      <Download className="mr-1 h-4 w-4" /> Télécharger bulletin de paie
    </Button>
  );
};

export default DownloadButton;
