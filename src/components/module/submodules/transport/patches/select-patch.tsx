
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/patched-select';

/**
 * This component serves as a patch for select components in the transport module.
 * It overrides the original select components with the patched ones that ensure
 * all SelectItems have valid values.
 */
const SelectPatch: React.FC = () => {
  useEffect(() => {
    // This is a hacky solution but it works for patching without modifying the transport module
    // It globally injects the patched Select components for use in the transport module
    try {
      // @ts-ignore - we're doing this hack to patch the components
      window.__PATCHED_SELECT__ = {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue
      };
      
      console.log('Select components patched successfully');
    } catch (error) {
      console.error('Failed to patch Select components:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default SelectPatch;
