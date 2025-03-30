
import ChevronsUpDown from '@/components/icons/ChevronIcons';

/**
 * Ensures the ChevronsUpDown component is available globally
 * This is needed because TransportPayments.tsx and other components
 * expect ChevronsUpDown to be available on the window object
 */
export const initializeGlobalIcons = () => {
  if (typeof window !== 'undefined') {
    console.log('Initializing global ChevronsUpDown icon');
    // @ts-ignore - We're explicitly adding this to the window object
    window.ChevronsUpDown = ChevronsUpDown;
  }
};

// Immediately invoke the function to ensure early initialization
if (typeof window !== 'undefined') {
  initializeGlobalIcons();
}
