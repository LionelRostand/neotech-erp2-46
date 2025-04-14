
import React from 'react';
import { Card } from "@/components/ui/card";
import { SalaryForm } from './components/SalaryForm';

const SalariesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des Fiches de Paie</h2>
      <Card className="p-6 bg-white shadow-sm">
        <SalaryForm />
      </Card>
    </div>
  );
};

export default SalariesTab;
