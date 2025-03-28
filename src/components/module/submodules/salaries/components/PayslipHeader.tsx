
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PayslipHeaderProps {
  onPrint: () => void;
}

const PayslipHeader: React.FC<PayslipHeaderProps> = ({ onPrint }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
      <CardTitle className="text-xl font-bold">Bulletin de Paie</CardTitle>
      <div className="flex items-center space-x-2 print:hidden">
        <Button variant="outline" size="sm" onClick={onPrint} className="flex items-center">
          <Printer className="mr-1 h-4 w-4" /> Imprimer
        </Button>
      </div>
    </CardHeader>
  );
};

export default PayslipHeader;
