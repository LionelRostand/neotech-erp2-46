
import React from 'react';
import { Card } from "@/components/ui/card";
import SalariesTab from './SalariesTab';

const SalarySlips: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestion des Fiches de Paie</h1>
      <p className="text-gray-600 mb-6">
        Création et gestion des fiches de paie conformes au Code du travail français
      </p>
      <SalariesTab />
    </div>
  );
};

export default SalarySlips;
