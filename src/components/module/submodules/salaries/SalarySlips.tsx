
import React from 'react';
import { Card } from "@/components/ui/card";
import SalariesTab from './SalariesTab';

const SalarySlips: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <SalariesTab />
    </div>
  );
};

export default SalarySlips;
