
import React, { useEffect } from 'react';
import { ChevronsUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/patched-select';

/**
 * SelectPatch ensures that required components are available for the Select component
 * This is particularly important for situations where ChevronsUpDown icon is needed
 * and when using patched Select components which have better empty string handling
 */
const SelectPatch: React.FC = () => {
  useEffect(() => {
    // Make sure ChevronsUpDown is available globally
    if (typeof window !== 'undefined' && !window.ChevronsUpDown) {
      // @ts-ignore - Adding to window object
      window.ChevronsUpDown = ChevronsUpDown;
    }
    
    // Make patched Select components available
    if (typeof window !== 'undefined' && !window.PatchedSelectComponents) {
      // @ts-ignore - Adding to window object
      window.PatchedSelectComponents = {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue
      };
    }
    
    console.log('SelectPatch: Patched components are now available');
  }, []);
  
  return null;
};

export default SelectPatch;
