
import React from 'react';
import { ChevronsUpDown } from "lucide-react";

export const TransportChevronsUpDown = () => {
  return <ChevronsUpDown className="h-4 w-4" />;
};

// Expose the ChevronsUpDown component globally for use in protected files
if (typeof window !== 'undefined') {
  // @ts-ignore - Adding to window object
  window.ChevronsUpDown = ChevronsUpDown;
}

export default ChevronsUpDown;
