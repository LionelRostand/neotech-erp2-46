
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
      // @ts-ignore - nous faisons ce hack pour patcher les composantes
      window.__PATCHED_SELECT__ = {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue
      };
      
      console.log('Les composants Select ont été patchés avec succès');
      
      // Monkey patch de la composante Select.Item originale pour s'assurer qu'elle a toujours une valeur valide
      const originalSelectItem = require('@radix-ui/react-select').Item;
      if (originalSelectItem && !originalSelectItem.__patched) {
        const OriginalComponent = originalSelectItem;
        
        // @ts-ignore - Extension de la composante React
        require('@radix-ui/react-select').Item = React.forwardRef((props: any, ref) => {
          // S'assurer que la valeur n'est jamais vide
          const safeProps = {...props};
          if (!safeProps.value || safeProps.value === '') {
            safeProps.value = `item-${Math.random().toString(36).substring(2, 9)}`;
            console.log('Valeur vide de Select.Item patchée avec:', safeProps.value);
          }
          
          return <OriginalComponent {...safeProps} ref={ref} />;
        });
        
        // Marquer comme patché pour éviter un double patching
        // @ts-ignore - Ajout d'une propriété personnalisée
        require('@radix-ui/react-select').Item.__patched = true;
        
        console.log('Radix UI Select.Item monkey patché avec succès');
      }

      // Patch additionnel pour s'assurer que le SelectItem des composants UI est aussi patché
      try {
        const SelectUIModule = require('@/components/ui/select');
        if (SelectUIModule && SelectUIModule.SelectItem && !SelectUIModule.SelectItem.__patched) {
          const OriginalUISelectItem = SelectUIModule.SelectItem;
          
          // @ts-ignore - Remplacer le composant
          SelectUIModule.SelectItem = React.forwardRef((props: any, ref) => {
            // S'assurer que la valeur n'est jamais vide
            const safeProps = {...props};
            if (!safeProps.value || safeProps.value === '') {
              safeProps.value = `ui-item-${Math.random().toString(36).substring(2, 9)}`;
              console.log('Valeur vide de UI SelectItem patchée avec:', safeProps.value);
            }
            
            return <OriginalUISelectItem {...safeProps} ref={ref} />;
          });
          
          // Marquer comme patché
          // @ts-ignore
          SelectUIModule.SelectItem.__patched = true;
          
          console.log('UI SelectItem patché avec succès');
        }
      } catch (error) {
        console.error('Échec du patch de UI SelectItem:', error);
      }

      // Patch supplémentaire pour s'assurer que les instances préexistantes de react-select sont également patchées
      // Ce patch s'applique globalement aux composants React Select montés
      const originalCreateElement = React.createElement;
      if (!React.createElement.__patched) {
        // @ts-ignore
        React.createElement = function patchedCreateElement(type: any, props: any, ...children: any[]) {
          // Si c'est un SelectItem ou quelque chose qui pourrait en être un
          if (
            props && 
            (type?.displayName === 'SelectItem' || 
             type?.name === 'SelectItem' || 
             (typeof type === 'string' && type.toLowerCase().includes('selectitem')))
          ) {
            // S'assurer que value existe et n'est pas vide
            if (!props.value || props.value === '') {
              const newProps = { ...props, value: `patched-item-${Math.random().toString(36).substring(2, 9)}` };
              return originalCreateElement(type, newProps, ...children);
            }
          }
          return originalCreateElement(type, props, ...children);
        };
        
        // @ts-ignore
        React.createElement.__patched = true;
        console.log('React.createElement patché pour les SelectItems');
      }
    } catch (error) {
      console.error('Échec du patch des composants Select:', error);
      toast.error("Échec du patch des composants Select", {
        description: "Certains composants peuvent ne pas fonctionner correctement"
      });
    }
  }, []);

  // Ce composant ne rend rien visuellement
  return null;
};

export default SelectPatch;
