
import { useEmployeeActions as useGlobalEmployeeActions } from '@/hooks/useEmployeeActions';

/**
 * Re-export the global employee actions hook
 * This file serves as a bridge between the global hook and the component
 */
const useEmployeeActions = () => {
  return useGlobalEmployeeActions();
};

export default useEmployeeActions;
