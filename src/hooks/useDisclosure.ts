
import { useState } from 'react';

/**
 * Custom hook for managing disclosure state (open/close) of components like modals, dialogs, etc.
 * 
 * @param initialState - Optional initial state for the disclosure
 * @returns Object with isOpen state, onOpen, onClose, and onToggle functions
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
}
