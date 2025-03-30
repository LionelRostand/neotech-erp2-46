
import React from 'react';
import { ChevronDown, ChevronUp, LucideProps } from 'lucide-react';

// Define the component to be compatible with Lucide's type expectations
export const ChevronsUpDown: React.FC<Omit<LucideProps, 'ref'>> = ({ className, size, color, strokeWidth, ...props }) => {
  // Create a clean props object for the div by excluding Lucide-specific props
  const divProps: React.HTMLAttributes<HTMLDivElement> = {};
  
  // Only copy over safe props that both can use
  if (className) divProps.className = `flex flex-col ${className}`;
  else divProps.className = 'flex flex-col';
  
  // Explicitly don't pass any Lucide-specific props to the div
  return (
    <div {...divProps}>
      <ChevronUp className="h-4 w-4" size={size} color={color} strokeWidth={strokeWidth} {...props} />
      <ChevronDown className="h-4 w-4 -mt-1" size={size} color={color} strokeWidth={strokeWidth} {...props} />
    </div>
  );
};

// Export as default so it can be imported both ways
export default ChevronsUpDown;
