
import React from 'react';
import TransportSettings from '../TransportSettings';
import SelectPatch from '../patches/select-patch';
import ChevronsUpDown from '@/components/icons/ChevronsUpDown';

// This component wraps the original TransportSettings component and adds the necessary patches
const TransportSettingsWrapper: React.FC = () => {
  // Make ChevronsUpDown globally available to the Transport module
  React.useEffect(() => {
    // @ts-ignore - we're doing this hack to provide the ChevronsUpDown icon
    window.ChevronsUpDown = ChevronsUpDown;
  }, []);
  
  return (
    <>
      <SelectPatch />
      <TransportSettings />
    </>
  );
};

export default TransportSettingsWrapper;
