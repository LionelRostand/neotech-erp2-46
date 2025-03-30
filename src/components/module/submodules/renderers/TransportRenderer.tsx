
import React from 'react';
import { DefaultSubmoduleContent } from '../DefaultSubmoduleContent';
import TransportCustomerService from '../transport/TransportCustomerService';
// Import and re-export ChevronsUpDown so it's globally available
import ChevronsUpDown from "@/components/icons/ChevronIcons";

// Make ChevronsUpDown available globally
window.ChevronsUpDown = ChevronsUpDown;

// Transport module renderers
export const renderTransportContent = ({ submoduleId, submodule }: { submoduleId: string, submodule: any }) => {
  switch (submoduleId) {
    case 'transport-customer-service':
      return <TransportCustomerService />;
    default:
      return <DefaultSubmoduleContent title={submodule.name} />;
  }
};
