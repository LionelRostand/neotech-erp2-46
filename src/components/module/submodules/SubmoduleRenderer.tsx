
import React from 'react';
// Import all renderers
import { renderTransportContent } from './renderers/TransportRenderer';

export const renderSubmoduleContent = ({ submoduleId, submodule }: { submoduleId: string, submodule: any }) => {
  // Transport module
  if (submoduleId.startsWith('transport-')) {
    return renderTransportContent({ submoduleId, submodule });
  }
  
  // Default fallback
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Contenu non disponible</h3>
      <p>Le contenu pour ce sous-module n'est pas encore implémenté.</p>
    </div>
  );
};
