
import React from 'react';
import { Card } from "@/components/ui/card";
import { SalaryForm } from './components/SalaryForm';

const SalariesTab: React.FC = () => {
  return (
    <Card className="p-4">
      <SalaryForm />
    </Card>
  );
};

export default SalariesTab;
