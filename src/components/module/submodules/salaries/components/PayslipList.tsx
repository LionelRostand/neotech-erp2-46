
import React from 'react';
import { Card } from '@/components/ui/card';
import { PaySlip } from '@/types/payslip';
import { saveEmployeeDocument } from '../../employees/services/documentService';
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayslipsData } from '@/hooks/usePayslipsData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PayslipList = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const { payslips, isLoading, error } = usePayslipsData();

  const handlePayslipGenerated = async (payslip: PaySlip) => {
    try {
      // Add payslip as a document
      const document = {
        id: `payslip_${payslip.id}`,
        name: `Fiche de paie - ${payslip.period}`,
        type: 'Fiche de paie',
        date: payslip.paymentDate,
        employeeId: payslip.employeeId,
        fileData: payslip.fileData || null // This line is now type-safe
      };

      await saveEmployeeDocument(payslip.employeeId, document);
    } catch (error) {
      console.error("Error adding payslip as document:", error);
    }
  };

  if (isLoading) {
    return <Card>Chargement des fiches de paie...</Card>;
  }

  if (error) {
    return <Card>Erreur: {error}</Card>;
  }

  if (!payslips || payslips.length === 0) {
    return <Card>Aucune fiche de paie disponible.</Card>;
  }

  return (
    <Card>
      <Table>
        <TableCaption>A list of your recent payslips.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Période</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Date de paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payslips.map((payslip) => (
            <TableRow key={payslip.id}>
              <TableCell className="font-medium">{payslip.period}</TableCell>
              <TableCell>{payslip.employeeName}</TableCell>
              <TableCell>{format(new Date(payslip.paymentDate), 'dd MMMM yyyy', { locale: fr })}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => {
                      navigate(`/modules/employees/salaries/${payslip.id}`);
                    }}>
                      Voir le détail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      // Logic to download payslip
                      toast({
                        title: "Non implémenté",
                        description: "Cette fonctionnalité n'est pas encore disponible.",
                      })
                    }}>
                      Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handlePayslipGenerated(payslip)}>
                      Ajouter aux documents
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{(payslips.length)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};

export default PayslipList;
