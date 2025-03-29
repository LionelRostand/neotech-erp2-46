
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface PayslipFormControlsProps {
  handleViewSample: () => void;
  handleGeneratePaySlip: () => void;
  handleSavePaySlip?: () => void;
  canSave?: boolean;
}

const PayslipFormControls: React.FC<PayslipFormControlsProps> = ({
  handleViewSample,
  handleGeneratePaySlip,
  handleSavePaySlip,
  canSave = false
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
      <div className="flex flex-col sm:flex-row gap-2">
        {handleSavePaySlip && (
          <Button 
            onClick={handleSavePaySlip}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            disabled={!canSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        )}
        <Button 
          onClick={handleGeneratePaySlip}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
          Générer le bulletin
        </Button>
      </div>
    </div>
  );
};

export default PayslipFormControls;
