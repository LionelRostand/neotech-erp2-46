
import React, { useState } from 'react';
import PayslipGeneratorForm from './PayslipGeneratorForm';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import PayslipDetails from './PayslipDetails';
import { PaySlip } from '@/types/payslip';

export const SalaryForm = () => {
  const { showPreview } = usePayslipGenerator();
  const [generatedPayslip, setGeneratedPayslip] = useState<PaySlip | null>(null);
  
  // Function to handle successful payslip generation
  const handlePayslipGenerated = (payslip: PaySlip) => {
    setGeneratedPayslip(payslip);
  };

  return (
    <div className="space-y-6">
      {showPreview && generatedPayslip ? (
        <PayslipDetails payslip={generatedPayslip} />
      ) : (
        <PayslipGeneratorForm onPayslipGenerated={handlePayslipGenerated} />
      )}
    </div>
  );
};
