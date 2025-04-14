import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalarySlipsData } from '@/hooks/useSalarySlipsData';
import { Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PaySlip } from '@/types/payslip';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PayslipDetails from './PayslipDetails';
import DownloadPayslipButton from './DownloadPayslipButton';
import { addEmployeeDocument } from '../../employees/services/documentService';
import { generatePayslipPDF } from '../utils/payslipPdfUtils';

const PayslipHistory: React.FC = () => {
  const { salarySlips, isLoading, error } = useSalarySlipsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<PaySlip | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredPayslips = salarySlips.filter(slip => 
    slip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.year.toString().includes(searchTerm)
  );

  const handleViewPayslip = (payslip: typeof salarySlips[0]) => {
    // Convert SalarySlip to PaySlip
    const convertedPayslip: PaySlip = {
      id: payslip.id,
      employeeId: payslip.employeeId,
      employeeName: payslip.employeeName,
      date: payslip.date,
      period: payslip.month + ' ' + payslip.year,
      month: payslip.month,
      year: payslip.year,
      netSalary: payslip.netAmount,
      grossSalary: payslip.grossAmount,
      totalDeductions: payslip.grossAmount - payslip.netAmount,
      status: payslip.status,
      // Default values or empty placeholder for required properties
      employee: {
        firstName: payslip.employeeName?.split(' ')[0] || '',
        lastName: payslip.employeeName?.split(' ').slice(1).join(' ') || '',
        employeeId: payslip.employeeId,
        role: 'Employé',
        socialSecurityNumber: '',
        startDate: new Date().toISOString()
      },
      hoursWorked: 151.67, // Durée légale mensuelle en France
      paymentDate: payslip.date,
      employerName: 'Entreprise',
      employerAddress: '',
      employerSiret: '',
      details: [
        {
          label: "Salaire brut",
          amount: payslip.grossAmount,
          type: "earning"
        },
        {
          label: "Cotisations sociales",
          amount: payslip.grossAmount - payslip.netAmount,
          type: "deduction"
        }
      ],
      paymentMethod: 'Virement bancaire',
      notes: ''
    };
    
    setSelectedPayslip(convertedPayslip);
    setViewDialogOpen(true);
  };

  const handleDownloadPayslip = async (payslip: typeof salarySlips[0]) => {
    try {
      // Convert SalarySlip to PaySlip format for PDF generation
      const convertedPayslip: PaySlip = {
        id: payslip.id,
        employeeId: payslip.employeeId,
        employeeName: payslip.employeeName,
        date: payslip.date,
        period: payslip.month + ' ' + payslip.year,
        month: payslip.month,
        year: payslip.year,
        netSalary: payslip.netAmount,
        grossSalary: payslip.grossAmount,
        totalDeductions: payslip.grossAmount - payslip.netAmount,
        status: payslip.status,
        employee: {
          firstName: payslip.employeeName?.split(' ')[0] || '',
          lastName: payslip.employeeName?.split(' ').slice(1).join(' ') || '',
          employeeId: payslip.employeeId,
          role: 'Employé',
          socialSecurityNumber: '',
          startDate: new Date().toISOString()
        },
        hoursWorked: 151.67,
        paymentDate: payslip.date,
        employerName: 'Entreprise',
        employerAddress: '',
        employerSiret: '',
        details: [{
          label: "Salaire brut",
          amount: payslip.grossAmount,
          type: "earning"
        }],
        paymentMethod: 'Virement bancaire',
        notes: ''
      };

      // Generate PDF
      const doc = generatePayslipPDF(convertedPayslip);
      const pdfBase64 = doc.output('datauristring');

      // Add document to employee's profile
      const documentData = {
        id: `payslip_${payslip.id}`,
        name: `Bulletin de paie - ${payslip.month} ${payslip.year}`,
        type: 'Fiche de paie',
        date: new Date().toISOString(),
        fileType: 'application/pdf',
        fileData: pdfBase64,
        employeeId: payslip.employeeId
      };

      await addEmployeeDocument(payslip.employeeId, documentData);
      
      // Save PDF
      doc.save(`bulletin_de_paie_${payslip.employeeName.toLowerCase()}_${payslip.month.toLowerCase()}_${payslip.year}.pdf`);
      
      toast.success('Fiche de paie téléchargée et ajoutée aux documents');
    } catch (error) {
      console.error('Error downloading payslip:', error);
      toast.error('Erreur lors du téléchargement de la fiche de paie');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Généré':
        return 'bg-blue-500';
      case 'Envoyé':
        return 'bg-orange-500';
      case 'Validé':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des fiches de paie...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Erreur lors du chargement des fiches de paie.</div>;
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle>Historique des fiches de paie</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher un employé, mois, année..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {filteredPayslips.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune fiche de paie trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-right">Montant net</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                    <TableCell>{payslip.month} {payslip.year}</TableCell>
                    <TableCell className="text-right">{payslip.netAmount.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payslip.status)}>
                        {payslip.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewPayslip(payslip)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Voir
                      </Button>
                      <DownloadPayslipButton payslip={convertPaySlipFormat(payslip)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {selectedPayslip && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Fiche de paie - {selectedPayslip.employeeName}</DialogTitle>
            </DialogHeader>
            <PayslipDetails payslip={selectedPayslip} />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

// Helper function to convert SalarySlip to PaySlip format
const convertPaySlipFormat = (payslip: any): PaySlip => {
  return {
    id: payslip.id,
    employeeId: payslip.employeeId,
    employeeName: payslip.employeeName,
    date: payslip.date,
    period: `${payslip.month} ${payslip.year}`,
    month: payslip.month,
    year: payslip.year,
    netSalary: payslip.netAmount,
    grossSalary: payslip.grossAmount,
    totalDeductions: payslip.grossAmount - payslip.netAmount,
    status: payslip.status,
    employee: {
      firstName: payslip.employeeName?.split(' ')[0] || '',
      lastName: payslip.employeeName?.split(' ').slice(1).join(' ') || '',
      employeeId: payslip.employeeId,
      role: 'Employé',
      socialSecurityNumber: '',
      startDate: payslip.date
    },
    hoursWorked: 151.67,
    paymentDate: payslip.date,
    employerName: 'Entreprise',
    employerAddress: '',
    employerSiret: '',
    details: [{
      label: "Salaire brut",
      amount: payslip.grossAmount,
      type: "earning"
    }],
    paymentMethod: 'Virement bancaire',
    notes: ''
  };
};

export default PayslipHistory;
