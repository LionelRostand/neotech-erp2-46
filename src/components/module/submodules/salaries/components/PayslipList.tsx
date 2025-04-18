
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, FileDown, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { formatDate } from '@/lib/utils';
import { PaySlip } from '@/types/payslip';
import { getAllPayslips } from '../services/payslipService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PayslipDetails from './PayslipDetails';
import DownloadPayslipButton from './DownloadPayslipButton';
import NewPayslipDialog from './NewPayslipDialog';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const PayslipList: React.FC = () => {
  const [payslips, setPayslips] = useState<PaySlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState<PaySlip | null>(null);
  const [showNewPayslipDialog, setShowNewPayslipDialog] = useState(false);
  const { employees } = useEmployeeData();
  
  useEffect(() => {
    fetchPayslips();
  }, []);
  
  const fetchPayslips = async () => {
    setIsLoading(true);
    try {
      const fetchedPayslips = await getAllPayslips();
      setPayslips(fetchedPayslips);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewPayslip = (payslip: PaySlip) => {
    setSelectedPayslip(payslip);
  };
  
  const handleCloseDialog = () => {
    setSelectedPayslip(null);
  };
  
  const handleNewPayslip = () => {
    setShowNewPayslipDialog(true);
  };
  
  const handleNewPayslipClose = () => {
    setShowNewPayslipDialog(false);
  };
  
  const handlePayslipGenerated = () => {
    fetchPayslips();
    setShowNewPayslipDialog(false);
  };

  // Find employee department
  const getEmployeeDepartment = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.department || 'Non spécifié';
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historique des fiches de paie</CardTitle>
        <Button size="sm" onClick={handleNewPayslip}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle fiche de paie
        </Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="animate-pulse text-muted-foreground">Chargement des fiches de paie...</div>
          </div>
        ) : payslips.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Brut</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {payslips.map((payslip) => (
                <TableRow key={payslip.id}>
                  <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                  <TableCell>{getEmployeeDepartment(payslip.employeeId)}</TableCell>
                  <TableCell>{payslip.period}</TableCell>
                  <TableCell>{formatDate(payslip.date)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(payslip.grossSalary)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(payslip.netSalary)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewPayslip(payslip)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                      
                      <DownloadPayslipButton payslip={payslip} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-24 text-center">
            <p className="text-xl font-medium mb-2">Aucune fiche de paie</p>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore généré de fiche de paie.
            </p>
            <Button onClick={handleNewPayslip}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une fiche de paie
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Payslip Details Dialog */}
      <Dialog open={!!selectedPayslip} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl">
          {selectedPayslip && <PayslipDetails payslip={selectedPayslip} />}
        </DialogContent>
      </Dialog>
      
      {/* New Payslip Dialog */}
      <NewPayslipDialog 
        open={showNewPayslipDialog} 
        onClose={handleNewPayslipClose}
        onGenerate={handlePayslipGenerated}
      />
    </Card>
  );
};

export default PayslipList;
