
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ListFilter, 
  Plus,
  Download,
  Mail,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useSalarySlipsData } from '@/hooks/useSalarySlipsData';
import NewPayslipDialog from './components/NewPayslipDialog';
import PayslipFilterDialog, { PayslipFilters } from './components/PayslipFilterDialog';
import PayslipViewer from './components/PayslipViewer';
import { exportToPdf } from '@/utils/pdfUtils';
import { PaySlip } from '@/types/payslip';

const SalarySlips: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fiches');
  const { salarySlips, stats, isLoading, error, employees, companies } = useSalarySlipsData();
  const [isNewPayslipDialogOpen, setIsNewPayslipDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<PayslipFilters>({});
  const [selectedPayslip, setSelectedPayslip] = useState<PaySlip | null>(null);
  const [isPayslipViewerOpen, setIsPayslipViewerOpen] = useState(false);

  const handleExportData = () => {
    const data = filteredSlips.map(slip => ({
      Employé: slip.employeeName,
      Période: `${slip.month} ${slip.year}`,
      Date: slip.date,
      'Montant Net': `${slip.netAmount.toLocaleString('fr-FR')} ${slip.currency}`,
      'Montant Brut': `${slip.grossAmount.toLocaleString('fr-FR')} ${slip.currency}`,
      Statut: slip.status
    }));

    if (exportToPdf(data, 'Fiches de paie', 'fiches_de_paie')) {
      toast.success("Export des fiches de paie réussi");
    } else {
      toast.error("Échec de l'export des fiches de paie");
    }
  };

  const handleSendEmail = (id: string, employeeName: string) => {
    toast.success(`Email envoyé à ${employeeName}`);
  };

  const handleViewPayslip = (slip: any) => {
    const foundEmployee = employees.find(emp => emp.id === slip.employeeId);
    if (foundEmployee) {
      // Convertir au format nécessaire pour PayslipViewer
      const viewPayslip: PaySlip = {
        id: slip.id,
        employee: {
          firstName: foundEmployee.firstName,
          lastName: foundEmployee.lastName,
          employeeId: foundEmployee.id,
          role: foundEmployee.position || 'Employé',
          socialSecurityNumber: foundEmployee.socialSecurityNumber || '1 99 99 99 999 999 99',
          startDate: foundEmployee.hireDate || '01/01/2023'
        },
        period: `${slip.month} ${slip.year}`,
        details: [
          { 
            label: 'Salaire de base',
            base: '151.67 H', 
            rate: `${(slip.grossAmount / 151.67).toFixed(2)} €/H`,
            amount: slip.grossAmount,
            type: 'earning'
          },
          { 
            label: 'CSG déductible',
            base: `${slip.grossAmount.toFixed(2)} €`,
            rate: '6,75 %',
            amount: slip.grossAmount * 0.0675,
            type: 'deduction'
          },
          { 
            label: 'CSG/CRDS non déductible',
            base: `${slip.grossAmount.toFixed(2)} €`,
            rate: '2,90 %',
            amount: slip.grossAmount * 0.029,
            type: 'deduction'
          },
          { 
            label: 'Sécurité sociale - Maladie',
            base: `${slip.grossAmount.toFixed(2)} €`,
            rate: '0,75 %',
            amount: slip.grossAmount * 0.0075,
            type: 'deduction'
          },
          { 
            label: 'Assurance vieillesse',
            base: `${slip.grossAmount.toFixed(2)} €`,
            rate: '4,10 %',
            amount: slip.grossAmount * 0.0410,
            type: 'deduction'
          },
          { 
            label: 'Assurance chômage',
            base: `${slip.grossAmount.toFixed(2)} €`,
            rate: '2,40 %',
            amount: slip.grossAmount * 0.024,
            type: 'deduction'
          }
        ],
        grossSalary: slip.grossAmount,
        totalDeductions: slip.grossAmount - slip.netAmount,
        netSalary: slip.netAmount,
        hoursWorked: 151.67,
        paymentDate: slip.date,
        employerName: "Entreprise ACME",
        employerAddress: "15 rue des Lilas, 75001 Paris",
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
          grossSalary: slip.grossAmount * 9,
          netSalary: slip.netAmount * 9,
          taxableIncome: slip.grossAmount * 0.98 - (slip.grossAmount * 0.0725),
        }
      };

      setSelectedPayslip(viewPayslip);
      setIsPayslipViewerOpen(true);
    }
  };

  const handleApplyFilters = (newFilters: PayslipFilters) => {
    const processedFilters = { ...newFilters };
    
    // Convertir les valeurs "all" en undefined pour les ignorer lors du filtrage
    Object.keys(processedFilters).forEach(key => {
      const typedKey = key as keyof PayslipFilters;
      if (processedFilters[typedKey] === 'all') {
        processedFilters[typedKey] = undefined;
      }
    });
    
    setFilters(processedFilters);
    toast.success("Filtres appliqués");
  };

  // Appliquer les filtres aux fiches de paie
  const filteredSlips = salarySlips.filter(slip => {
    if (filters.employeeId && filters.employeeId !== slip.employeeId) return false;
    if (filters.month && filters.month !== slip.month) return false;
    if (filters.year && filters.year.toString() !== slip.year.toString()) return false;
    if (filters.minAmount && slip.netAmount < filters.minAmount) return false;
    if (filters.maxAmount && slip.netAmount > filters.maxAmount) return false;
    if (filters.status && filters.status !== slip.status) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des fiches de paie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des fiches de paie.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Fiches de paie</h2>
          <p className="text-gray-500">Gestion des salaires et fiches de paie</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsNewPayslipDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle fiche
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Générées</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.generated}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">Envoyées</h3>
              <p className="text-2xl font-bold text-amber-700">{stats.sent}</p>
            </div>
            <Mail className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Validées</h3>
              <p className="text-2xl font-bold text-green-700">{stats.validated}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-3">
          <TabsTrigger value="fiches" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Fiches de paie
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="parametres" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fiches">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                {filters.employeeId || filters.month || filters.year || filters.minAmount || filters.maxAmount || filters.status ? (
                  <div className="mb-4 p-2 bg-blue-50 rounded-md flex justify-between items-center">
                    <p className="text-sm text-blue-700">
                      Filtres actifs: {Object.entries(filters).filter(([_, v]) => v !== undefined).length}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFilters({})}
                      className="text-blue-700"
                    >
                      Effacer les filtres
                    </Button>
                  </div>
                ) : null}
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Employé</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant net</TableHead>
                      <TableHead>Montant brut</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSlips.length > 0 ? (
                      filteredSlips.map((slip) => (
                        <TableRow key={slip.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={slip.employeePhoto} alt={slip.employeeName} />
                                <AvatarFallback>{slip.employeeName?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{slip.employeeName}</p>
                                <p className="text-xs text-gray-500">{slip.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {`${slip.month} ${slip.year}`}
                          </TableCell>
                          <TableCell>{slip.date}</TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {slip.netAmount.toLocaleString('fr-FR')} {slip.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-500">
                              {slip.grossAmount.toLocaleString('fr-FR')} {slip.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                slip.status === 'Validé'
                                  ? 'bg-green-100 text-green-800'
                                  : slip.status === 'Envoyé'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {slip.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPayslip(slip)}
                            >
                              Voir
                            </Button>
                            {slip.status === 'Généré' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSendEmail(slip.id, slip.employeeName || '')}
                              >
                                <Mail className="h-4 w-4 mr-1" /> 
                                Envoyer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucune fiche de paie trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Statistiques des salaires (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametres">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Paramètres de paie (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {isNewPayslipDialogOpen && (
        <NewPayslipDialog
          isOpen={isNewPayslipDialogOpen}
          onClose={() => setIsNewPayslipDialogOpen(false)}
          employees={employees || []}
          companies={companies || []}
        />
      )}

      {isFilterDialogOpen && (
        <PayslipFilterDialog
          isOpen={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          onApplyFilters={handleApplyFilters}
          employees={employees?.map(e => ({ id: e.id, name: `${e.firstName} ${e.lastName}` })) || []}
          currentFilters={filters}
        />
      )}

      {isPayslipViewerOpen && selectedPayslip && (
        <Dialog open={isPayslipViewerOpen} onOpenChange={(open) => !open && setIsPayslipViewerOpen(false)}>
          <DialogContent className="max-w-5xl">
            <PayslipViewer 
              payslip={selectedPayslip}
              onClose={() => setIsPayslipViewerOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SalarySlips;
