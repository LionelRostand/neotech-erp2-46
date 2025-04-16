
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAllPayslips, deletePayslip, Payslip } from '../services/salaryService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Create a service stub if it doesn't exist
const mockPayslipService = {
  getAllPayslips: async () => {
    console.log('Mock getAllPayslips called');
    return [];
  },
  deletePayslip: async (id: string) => {
    console.log('Mock deletePayslip called with id:', id);
    return true;
  }
};

// Use the actual service if it exists, otherwise use the mock
const payslipService = {
  getAllPayslips: typeof getAllPayslips === 'function' ? getAllPayslips : mockPayslipService.getAllPayslips,
  deletePayslip: typeof deletePayslip === 'function' ? deletePayslip : mockPayslipService.deletePayslip
};

// Fallback interface if imported Payslip isn't available
interface FallbackPayslip {
  id: string;
  employeeName: string;
  monthName: string;
  year: number;
  grossSalary: number;
  netSalary: number;
  date: string;
}

const PayslipList = () => {
  const [payslips, setPayslips] = useState<Payslip[] | FallbackPayslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | FallbackPayslip | null>(null);
  
  useEffect(() => {
    loadPayslips();
  }, []);
  
  const loadPayslips = async () => {
    try {
      setLoading(true);
      const data = await payslipService.getAllPayslips();
      setPayslips(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fiches de paie:', error);
      toast.error('Erreur lors du chargement des fiches de paie');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = (payslip: Payslip | FallbackPayslip) => {
    setSelectedPayslip(payslip);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedPayslip) return;
    
    try {
      await payslipService.deletePayslip(selectedPayslip.id);
      setPayslips(payslips.filter(p => p.id !== selectedPayslip.id));
      toast.success('Fiche de paie supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la fiche de paie');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPayslip(null);
    }
  };
  
  const handleDownload = (payslip: Payslip | FallbackPayslip) => {
    // Create a simple text representation of the payslip
    const content = `
FICHE DE PAIE
-------------
Employé: ${payslip.employeeName}
Mois: ${payslip.monthName} ${payslip.year}
Salaire brut: ${payslip.grossSalary} €
Salaire net: ${payslip.netSalary} €
Date d'émission: ${new Date(payslip.date).toLocaleDateString('fr-FR')}
    `;
    
    // Create a Blob from the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Fiche_de_paie_${payslip.employeeName.replace(/\s+/g, '_')}_${payslip.monthName}_${payslip.year}.txt`;
    
    // Append to the document and click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Chargement des fiches de paie...</div>;
  }
  
  if (payslips.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">Aucune fiche de paie</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucune fiche de paie n'a été créée pour le moment.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Période</TableHead>
              <TableHead className="text-right">Salaire brut</TableHead>
              <TableHead className="text-right">Salaire net</TableHead>
              <TableHead className="text-right">Date d'émission</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payslips.map((payslip) => (
              <TableRow key={payslip.id}>
                <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                <TableCell>{payslip.monthName} {payslip.year}</TableCell>
                <TableCell className="text-right">{payslip.grossSalary} €</TableCell>
                <TableCell className="text-right">{payslip.netSalary} €</TableCell>
                <TableCell className="text-right">
                  {new Date(payslip.date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDownload(payslip)}
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDelete(payslip)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette fiche de paie sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PayslipList;
