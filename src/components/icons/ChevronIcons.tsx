
import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown as LucideChevronsUpDown } from 'lucide-react';

// This component provides the missing ChevronsUpDown icon
export const ChevronsUpDown: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <ChevronUp className="h-4 w-4" />
      <ChevronDown className="h-4 w-4 -mt-1" />
    </div>
  );
};

// Expose the ChevronsUpDown component globally for use in protected files
if (typeof window !== 'undefined') {
  // @ts-ignore - Adding to window object
  window.ChevronsUpDown = LucideChevronsUpDown || ChevronsUpDown;
}
