
import React from 'react';
import { ChevronDown, ChevronUp, LucideProps } from 'lucide-react';

// Define the component to be compatible with Lucide's type expectations
export const ChevronsUpDown: React.FC<LucideProps> = ({ className, size, color, ...props }) => {
  // Extract Lucide-specific props to avoid passing them to the div
  const divProps = { ...props };
  
  // Remove Lucide-specific props that shouldn't be passed to a div
  delete divProps.absoluteStrokeWidth;
  delete divProps.strokeWidth;
  delete divProps.fill;
  delete divProps.stroke;
  
  return (
    <div className={`flex flex-col ${className || ''}`} {...divProps}>
      <ChevronUp className="h-4 w-4" size={size} color={color} />
      <ChevronDown className="h-4 w-4 -mt-1" size={size} color={color} />
    </div>
  );
};

// Export as default so it can be imported both ways
export default ChevronsUpDown;
