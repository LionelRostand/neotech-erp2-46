
import React from 'react';
import TransportSettings from '../TransportSettings';
import SelectPatch from '../patches/select-patch';
import { ChevronsUpDown } from "lucide-react";

// This component wraps the original TransportSettings component and adds the necessary patches
const TransportSettingsWrapper: React.FC = () => {
  // Make ChevronsUpDown globally available to the Transport module
  React.useEffect(() => {
    try {
      // @ts-ignore - we're doing this hack to provide the ChevronsUpDown icon
      window.ChevronsUpDown = ChevronsUpDown;
      console.log('ChevronsUpDown icon registered globally');
    } catch (error) {
      console.error('Failed to register ChevronsUpDown icon:', error);
    }
  }, []);
  
  return (
    <>
      <SelectPatch />
      <TransportSettings />
    </>
  );
};

export default TransportSettingsWrapper;
