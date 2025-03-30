
import React, { useEffect } from 'react';
import { ChevronsUpDown } from '@/components/icons/ChevronsUpDown';

const SelectPatch: React.FC = () => {
  useEffect(() => {
    // Make sure ChevronsUpDown is available globally
    if (typeof window !== 'undefined' && !window.ChevronsUpDown) {
      // @ts-ignore - Adding to window object
      window.ChevronsUpDown = ChevronsUpDown;
    }
  }, []);
  
  return null;
};

export default SelectPatch;
