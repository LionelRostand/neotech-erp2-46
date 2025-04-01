
import React from 'react';
import { ChevronsUpDown as LucideChevronsUpDown } from 'lucide-react';

// Export the ChevronsUpDown component that is used in TransportPayments.tsx
export function ChevronsUpDown(props: React.SVGProps<SVGSVGElement>) {
  return <LucideChevronsUpDown {...props} />;
}

// Global export to make the component available
if (typeof window !== 'undefined') {
  // @ts-ignore - Adding to window object
  window.ChevronsUpDown = LucideChevronsUpDown;
}
