
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import TransportCustomerService from '../transport/TransportCustomerService';
import { ChevronsUpDown } from "@/components/icons/ChevronIcons";

// Make ChevronsUpDown available globally
// TypeScript-safe approach using declaration merging
declare global {
  interface Window {
    ChevronsUpDown: typeof ChevronsUpDown;
  }
}

// Assign to window object
if (typeof window !== 'undefined') {
  window.ChevronsUpDown = ChevronsUpDown;
}

// Transport module renderers
export const renderTransportContent = ({ submoduleId, submodule }: { submoduleId: string, submodule: any }) => {
  switch (submoduleId) {
    case 'transport-customer-service':
      return <TransportCustomerService />;
    default:
      return <DefaultSubmoduleContent title={submodule.name} />;
  }
};
