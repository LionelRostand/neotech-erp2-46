
import React from 'react';
import PayslipGeneratorForm from './PayslipGeneratorForm';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import PayslipDetails from './PayslipDetails';

export const SalaryForm = () => {
  const { currentPayslip, showPreview } = usePayslipGenerator();

  return (
    <div className="space-y-6">
      {showPreview && currentPayslip ? (
        <PayslipDetails payslip={currentPayslip} />
      ) : (
        <PayslipGeneratorForm />
      )}
    </div>
  );
};
