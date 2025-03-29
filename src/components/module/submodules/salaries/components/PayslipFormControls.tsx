
import React from 'react';
import { Button } from '@/components/ui/button';

interface PayslipFormControlsProps {
  handleViewSample: () => void;
  handleGeneratePaySlip: () => void;
}

const PayslipFormControls: React.FC<PayslipFormControlsProps> = ({
  handleViewSample,
  handleGeneratePaySlip
}) => {
  return (
    <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
      <Button 
        variant="outline" 
        onClick={handleViewSample}
        className="w-full sm:w-auto"
      >
        Voir un exemple
      </Button>
      <Button 
        onClick={handleGeneratePaySlip}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
      >
        Générer le bulletin
      </Button>
    </div>
  );
};

export default PayslipFormControls;
