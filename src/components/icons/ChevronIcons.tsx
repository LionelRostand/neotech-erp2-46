
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const ChevronsUpDown: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <ChevronUp className="h-4 w-4" />
      <ChevronDown className="h-4 w-4 -mt-1" />
    </div>
  );
};

// Export as default so it can be imported both ways
export default ChevronsUpDown;
