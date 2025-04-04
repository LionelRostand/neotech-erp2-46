
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Filter, Plus, FileCheck } from 'lucide-react';
import { useSalarySlipsData } from '@/hooks/useSalarySlipsData';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { SalarySlip } from '@/hooks/useSalarySlipsData';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import NewPayslipDialog from './components/NewPayslipDialog';
import PayslipFilterDialog from './components/PayslipFilterDialog';
import PayslipViewer from './components/PayslipViewer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getDocumentById } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SalarySlips = () => {
  const { salarySlips, stats, isLoading, employees, companies } = useSalarySlipsData();
  const [selectedTab, setSelectedTab] = useState('all');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isNewPayslipDialogOpen, setIsNewPayslipDialogOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<SalarySlip | null>(null);
  const [filteredSlips, setFilteredSlips] = useState<SalarySlip[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    setFilteredSlips(salarySlips);
  }, [salarySlips]);

  const formattedEmployees = employees?.map(employee => ({
    id: employee.id,
    name: `${employee.firstName} ${employee.lastName}`
  })) || [];

  const columns: ColumnDef<SalarySlip>[] = [
    {
      accessorKey: 'employeeName',
      header: 'Employé',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-2">
            {employee.employeePhoto ? (
              <img 
                src={employee.employeePhoto} 
                alt={employee.employeeName} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs">{employee.employeeName?.charAt(0)}</span>
              </div>
            )}
            <span>{employee.employeeName}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'month',
      header: 'Période',
      cell: ({ row }) => `${row.original.month} ${row.original.year}`
    },
    {
      accessorKey: 'department',
      header: 'Département',
      cell: ({ row }) => row.original.department || 'Non spécifié'
    },
    {
      accessorKey: 'netAmount',
      header: 'Montant net',
      cell: ({ row }) => `${row.original.netAmount.toLocaleString('fr-FR')} ${row.original.currency}`
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        let color = '';
        
        switch(status) {
          case 'Généré':
            color = 'bg-blue-100 text-blue-800';
            break;
          case 'Envoyé':
            color = 'bg-yellow-100 text-yellow-800';
            break;
          case 'Validé':
            color = 'bg-green-100 text-green-800';
            break;
          default:
            color = 'bg-gray-100 text-gray-800';
        }
        
        return <Badge className={`${color}`}>{status}</Badge>;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const payslip = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleViewPayslip(payslip)}
              title="Visualiser"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDownloadPayslip(payslip)}
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const handleViewPayslip = (payslip: SalarySlip) => {
    setSelectedPayslip(payslip);
    setIsViewerOpen(true);
  };

  const handleDownloadPayslip = async (payslip: SalarySlip) => {
    try {
      if (payslip.pdfUrl) {
        window.open(payslip.pdfUrl, '_blank');
      } else {
        toast.info("Génération du PDF en cours...");
        
        // Get employee details
        const employeeData = employees?.find(emp => emp.id === payslip.employeeId);
        
        if (!employeeData) {
          toast.error("Impossible de trouver les détails de l'employé");
          return;
        }
        
        // Convert to necessary format for the PaySlip type
        const payslipData = {
          id: payslip.id,
          employee: {
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            employeeId: employeeData.id,
            role: employeeData.position,
            socialSecurityNumber: employeeData.socialSecurityNumber || "1 99 99 99 999 999 99",
            startDate: employeeData.hireDate
          },
          period: `${payslip.month} ${payslip.year}`,
          details: [
            { 
              label: 'Salaire de base', 
              base: '151.67 H', 
              amount: payslip.grossAmount * 0.85, 
              type: 'earning' as 'earning'
            },
            { 
              label: 'CSG déductible', 
              base: `${payslip.grossAmount.toFixed(2)} €`, 
              rate: '6,75 %', 
              amount: payslip.grossAmount * 0.0675, 
              type: 'deduction' as 'deduction'
            },
            { 
              label: 'Sécurité sociale - Maladie', 
              base: `${payslip.grossAmount.toFixed(2)} €`, 
              rate: '0,75 %', 
              amount: payslip.grossAmount * 0.0075, 
              type: 'deduction' as 'deduction'
            }
          ],
          grossSalary: payslip.grossAmount,
          totalDeductions: payslip.grossAmount - payslip.netAmount,
          netSalary: payslip.netAmount,
          hoursWorked: 151.67,
          paymentDate: new Date().toLocaleDateString('fr-FR'),
          employerName: "ACME France SAS",
          employerAddress: "15 rue de la Paix, 75001 Paris",
          employerSiret: "123 456 789 00012",
          conges: {
            acquired: 2.5,
            taken: 0,
            balance: 25
          },
          rtt: {
            acquired: 1,
            taken: 0,
            balance: 9
          },
          annualCumulative: {
            grossSalary: payslip.grossAmount * 9,
            netSalary: payslip.netAmount * 9,
            taxableIncome: payslip.netAmount * 0.98 * 9
          }
        };
        
        // Download PDF
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("BULLETIN DE PAIE", 105, 15, { align: 'center' });
        doc.text(payslipData.employerName, 15, 25);
        doc.text(payslipData.employerAddress, 15, 30);
        doc.text(`SIRET: ${payslipData.employerSiret}`, 15, 35);
        doc.text(`Employé: ${payslipData.employee.firstName} ${payslipData.employee.lastName}`, 15, 45);
        doc.text(`Période: ${payslipData.period}`, 15, 50);
        
        // Save PDF
        doc.save(`Bulletin_de_paie_${payslipData.employee.lastName}_${payslipData.period.replace(/\s/g, '_')}.pdf`);
        toast.success("Bulletin de paie téléchargé");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du bulletin");
    }
  };

  const handleApplyFilters = (filters: any) => {
    let filtered = [...salarySlips];
    
    if (filters.employeeId && filters.employeeId !== 'all') {
      filtered = filtered.filter(slip => slip.employeeId === filters.employeeId);
    }
    
    if (filters.month && filters.month !== 'all') {
      filtered = filtered.filter(slip => slip.month === filters.month);
    }
    
    if (filters.year && filters.year !== 'all') {
      filtered = filtered.filter(slip => slip.year.toString() === filters.year);
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(slip => slip.status === filters.status);
    }
    
    if (filters.minAmount) {
      filtered = filtered.filter(slip => slip.netAmount >= filters.minAmount);
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(slip => slip.netAmount <= filters.maxAmount);
    }
    
    setFilteredSlips(filtered);
    setCurrentFilters(filters);
    toast.success("Filtres appliqués");
  };

  const handleExportAll = () => {
    try {
      toast.info("Export des bulletins en cours...");
      
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Liste des bulletins de paie", 105, 15, { align: 'center' });
      
      const tableData = filteredSlips.map((slip, index) => [
        index + 1,
        slip.employeeName || 'N/A',
        `${slip.month} ${slip.year}`,
        slip.department || 'N/A',
        `${slip.netAmount} ${slip.currency}`,
        slip.status
      ]);
      
      // @ts-ignore - jspdf-autotable types
      doc.autoTable({
        startY: 25,
        head: [['#', 'Employé', 'Période', 'Département', 'Montant Net', 'Statut']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      doc.save(`Bulletins_de_paie_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("Export réalisé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error("Erreur lors de l'export des bulletins");
    }
  };

  const getFilteredSlipsByStatus = (status: string) => {
    if (status === 'all') return filteredSlips;
    return filteredSlips.filter(slip => slip.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Fiches de paie</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportAll}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsNewPayslipDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle fiche
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Générés</p>
                <p className="text-2xl font-bold">{stats.generated}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Envoyés</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Validés</p>
                <p className="text-2xl font-bold">{stats.validated}</p>
              </div>
              <FileCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">Tous ({filteredSlips.length})</TabsTrigger>
          <TabsTrigger value="Généré">Générés ({getFilteredSlipsByStatus('Généré').length})</TabsTrigger>
          <TabsTrigger value="Envoyé">Envoyés ({getFilteredSlipsByStatus('Envoyé').length})</TabsTrigger>
          <TabsTrigger value="Validé">Validés ({getFilteredSlipsByStatus('Validé').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <DataTable 
            columns={columns} 
            data={filteredSlips} 
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="Généré" className="mt-6">
          <DataTable 
            columns={columns} 
            data={getFilteredSlipsByStatus('Généré')} 
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="Envoyé" className="mt-6">
          <DataTable 
            columns={columns} 
            data={getFilteredSlipsByStatus('Envoyé')} 
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="Validé" className="mt-6">
          <DataTable 
            columns={columns} 
            data={getFilteredSlipsByStatus('Validé')} 
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <PayslipFilterDialog 
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
        employees={formattedEmployees}
        currentFilters={currentFilters}
      />

      <NewPayslipDialog 
        isOpen={isNewPayslipDialogOpen}
        onClose={() => setIsNewPayslipDialogOpen(false)}
        employees={employees || []}
        companies={companies as Company[]}
      />

      {isViewerOpen && selectedPayslip && (
        <Dialog open={isViewerOpen} onOpenChange={(open) => !open && setIsViewerOpen(false)}>
          <DialogContent className="max-w-6xl">
            {/* TODO: Create a PaySlip viewer component */}
            <Button onClick={() => setIsViewerOpen(false)}>Fermer</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SalarySlips;
