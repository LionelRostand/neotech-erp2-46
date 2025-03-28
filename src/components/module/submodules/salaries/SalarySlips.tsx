
import React from 'react';
import { Card } from '@/components/ui/card';
import PaySlipGenerator from './PaySlipGenerator';

const SalarySlips: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bulletins de Paie</h1>
        <p className="text-gray-500">Générez et téléchargez les bulletins de paie</p>
      </div>
      
      <PaySlipGenerator />
    </div>
  );
};

export default SalarySlips;
