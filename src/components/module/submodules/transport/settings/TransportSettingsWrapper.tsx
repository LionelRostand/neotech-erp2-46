
import React from 'react';
import TransportSettings from '../TransportSettings';
import SelectPatch from '../patches/select-patch';
import { ChevronsUpDown } from "lucide-react";

// Ce composant enveloppe le composant TransportSettings original et ajoute les patches nécessaires
const TransportSettingsWrapper: React.FC = () => {
  // Rendre ChevronsUpDown globalement disponible pour le module Transport
  React.useEffect(() => {
    try {
      // @ts-ignore - nous faisons ce hack pour fournir l'icône ChevronsUpDown
      window.ChevronsUpDown = ChevronsUpDown;
      console.log('Icône ChevronsUpDown enregistrée globalement');
    } catch (error) {
      console.error('Échec de l\'enregistrement de l\'icône ChevronsUpDown:', error);
    }
  }, []);
  
  return (
    <>
      <SelectPatch />
      <TransportSettings />
    </>
  );
};

export default TransportSettingsWrapper;
