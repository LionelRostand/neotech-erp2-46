
import React from 'react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Card } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import DownloadPayslipButton from './DownloadPayslipButton';

const PayslipList = () => {
  const { payslips, isLoading } = useHrModuleData();

  if (isLoading) {
    return <div>Chargement des fiches de paie...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Liste des fiches de paie</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Montant Net</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payslips.map((payslip, index) => (
            <TableRow key={payslip.id || `payslip-${index}`}>
              <TableCell>{new Date(payslip.date).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{payslip.employeeName}</TableCell>
              <TableCell>{payslip.month} {payslip.year}</TableCell>
              <TableCell>{payslip.netSalary?.toFixed(2)} €</TableCell>
              <TableCell>
                <Badge variant={payslip.status === 'Généré' ? 'default' : 'secondary'}>
                  {payslip.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DownloadPayslipButton payslip={payslip} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PayslipList;
