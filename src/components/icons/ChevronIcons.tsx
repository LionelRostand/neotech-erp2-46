
import React from 'react';
import { ChevronDown, ChevronUp, LucideProps } from 'lucide-react';

// Define the component to be compatible with Lucide's type expectations
export const ChevronsUpDown: React.FC<LucideProps> = ({ className, ...props }) => {
  return (
    <div className={`flex flex-col ${className}`} {...props}>
      <ChevronUp className="h-4 w-4" />
      <ChevronDown className="h-4 w-4 -mt-1" />
    </div>
  );
};

// Export as default so it can be imported both ways
export default ChevronsUpDown;
