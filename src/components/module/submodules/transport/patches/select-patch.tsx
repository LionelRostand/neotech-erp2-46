
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/patched-select';
import { toast } from "sonner";

/**
 * Cette composante sert de patch pour les composants select dans le module transport.
 * Elle remplace les composantes select originales avec des versions patchées qui s'assurent
 * que tous les SelectItems ont des valeurs valides.
 */
const SelectPatch: React.FC = () => {
  useEffect(() => {
    // Solution provisoire qui fonctionne pour patcher sans modifier le module transport
    // Elle injecte globalement les composantes Select patchées pour une utilisation dans le module transport
    try {
      // Patch 1: Make patched components globally available
      // @ts-ignore - nous faisons ce hack pour patcher les composantes
      window.__PATCHED_SELECT__ = {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue
      };
      
      console.log('Les composants Select ont été patchés avec succès');
      
      // Patch 2: Directly patch React.createElement to catch all SelectItem instances
      const originalCreateElement = React.createElement;
      // @ts-ignore - custom property
      if (!originalCreateElement.hasOwnProperty('__patched')) {
        // @ts-ignore - custom property
        React.createElement = function patchedCreateElement(type, props, ...children) {
          // Check if this is a SelectItem component or something that could be one
          if (
            props && 
            (
              (typeof type === 'object' && (
                type?.displayName === 'SelectItem' || 
                type?.name === 'SelectItem' || 
                (type?.render && (
                  type.render.displayName === 'SelectItem' || 
                  type.render.name === 'SelectItem'
                ))
              )) ||
              (typeof type === 'function' && (
                type.displayName === 'SelectItem' || 
                type.name === 'SelectItem'
              )) ||
              (typeof type === 'string' && type.toLowerCase().includes('selectitem'))
            )
          ) {
            // Check if value exists and is not empty
            const safeProps = { ...props };
            if (!safeProps.value || safeProps.value === '') {
              safeProps.value = `patched-item-${Math.random().toString(36).substring(2, 9)}`;
              console.log('React.createElement - SelectItem value patched:', safeProps.value);
              return originalCreateElement(type, safeProps, ...children);
            }
          }
          
          // Default behavior for all other elements
          return originalCreateElement(type, props, ...children);
        };
        
        // @ts-ignore - custom property
        Object.defineProperty(React.createElement, '__patched', { value: true });
        console.log('React.createElement patched for SelectItems');
      }

      // Patch 3: Direct patch selectItems in state updates
      const originalSetState = React.Component.prototype.setState;
      // @ts-ignore - custom property
      if (!originalSetState.hasOwnProperty('__patched')) {
        React.Component.prototype.setState = function patchedSetState(state, callback) {
          // Process the state if it's a function
          if (typeof state === 'function') {
            const originalStateFunction = state;
            state = function(prevState, props) {
              const newState = originalStateFunction(prevState, props);
              return patchSelectItemValues(newState);
            };
          } else if (state && typeof state === 'object') {
            // Process the state object directly
            state = patchSelectItemValues(state);
          }
          
          return originalSetState.call(this, state, callback);
        };
        
        // Helper to recursively patch SelectItem values in state objects
        function patchSelectItemValues(obj) {
          if (!obj || typeof obj !== 'object') return obj;
          
          // Clone to avoid mutating original
          const patched = Array.isArray(obj) ? [...obj] : {...obj};
          
          // Process all properties
          for (let key in patched) {
            if (patched.hasOwnProperty(key)) {
              const value = patched[key];
              
              // Check if this is a SelectItem-like object
              if (value && typeof value === 'object') {
                // If it looks like a SelectItem and has an empty value
                if (
                  (value.type === 'SelectItem' || 
                   (value.type && (value.type.displayName === 'SelectItem' || value.type.name === 'SelectItem'))) &&
                  (!value.props?.value || value.props?.value === '')
                ) {
                  const newValue = `state-item-${Math.random().toString(36).substring(2, 9)}`;
                  patched[key] = {
                    ...value,
                    props: {
                      ...value.props,
                      value: newValue
                    }
                  };
                  console.log('State update - SelectItem value patched:', newValue);
                } else {
                  // Recursively patch deeper objects
                  patched[key] = patchSelectItemValues(value);
                }
              }
            }
          }
          
          return patched;
        }
        
        // @ts-ignore - custom property
        Object.defineProperty(originalSetState, '__patched', { value: true });
        console.log('React.Component.prototype.setState patched for SelectItems');
      }

    } catch (error) {
      console.error('Failed to patch Select components:', error);
      toast.error("Failed to patch Select components", {
        description: "Some components may not work correctly"
      });
    }
  }, []);

  // This component renders nothing visually
  return null;
};

export default SelectPatch;
