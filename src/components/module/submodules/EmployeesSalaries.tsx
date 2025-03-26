
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, History, Edit, Plus, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeeSalaries, EmployeeSalary } from '@/hooks/useEmployeeSalaries';
import SalaryForm from '@/components/forms/SalaryForm';
import SalaryDetails from '@/components/details/SalaryDetails';
import SalaryHistoryView from '@/components/details/SalaryHistoryView';

interface SalaryListProps {
  salaries: EmployeeSalary[];
  isLoading: boolean;
  onViewDetails: (salary: EmployeeSalary) => void;
  onViewHistory: (salary: EmployeeSalary) => void;
  onEdit: (salary: EmployeeSalary) => void;
  onDownloadPayStub: (id: string) => void;
}

const SalaryList: React.FC<SalaryListProps> = ({ 
  salaries, 
  isLoading,
  onViewDetails, 
  onViewHistory, 
  onEdit, 
  onDownloadPayStub 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSalaries, setFilteredSalaries] = useState<EmployeeSalary[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSalaries(salaries);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = salaries.filter(salary => 
        salary.employeeName.toLowerCase().includes(term) ||
        salary.status.toLowerCase().includes(term) ||
        salary.amount.toString().includes(term)
      );
      setFilteredSalaries(filtered);
    }
  }, [searchTerm, salaries]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-64 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredSalaries.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Aucun salaire trouvé
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3">Employé</th>
                  <th className="text-left p-3">Montant</th>
                  <th className="text-left p-3">Date effective</th>
                  <th className="text-left p-3">Date de paiement</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map(salary => (
                  <tr key={salary.id} className="border-t hover:bg-muted/50">
                    <td className="p-3">{salary.employeeName}</td>
                    <td className="p-3">{salary.amount} {salary.currency}</td>
                    <td className="p-3">{salary.effectiveDate}</td>
                    <td className="p-3">{salary.paymentDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        salary.status === 'Payé' ? 'bg-green-100 text-green-800' :
                        salary.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {salary.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onViewDetails(salary)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onViewHistory(salary)}>
                          <History className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(salary)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDownloadPayStub(salary.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeesSalaries = () => {
  const { salaries, isLoading, addSalary, updateSalary, deleteSalary } = useEmployeeSalaries();
  const [activeTab, setActiveTab] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<EmployeeSalary | null>(null);
  const { toast } = useToast();

  const handleViewDetails = (salary: EmployeeSalary) => {
    setSelectedSalary(salary);
    setShowDetailsDialog(true);
  };

  const handleViewHistory = (salary: EmployeeSalary) => {
    setSelectedSalary(salary);
    setShowHistoryDialog(true);
  };

  const handleEdit = (salary: EmployeeSalary) => {
    setSelectedSalary(salary);
    setShowEditDialog(true);
  };

  const handleDownloadPayStub = (id: string) => {
    toast({
      title: "Téléchargement commencé",
      description: "La fiche de paie est en cours de téléchargement."
    });
  };

  const handleAddSalary = async (data: any) => {
    try {
      await addSalary(data);
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding salary:", error);
    }
  };

  const handleUpdateSalary = async (data: any) => {
    if (!selectedSalary) return;
    
    try {
      await updateSalary(selectedSalary.id, data);
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  // Filter salaries based on active tab
  const filteredSalaries = salaries.filter(salary => {
    if (activeTab === 'all') return true;
    if (activeTab === 'paid') return salary.status === 'Payé';
    if (activeTab === 'pending') return salary.status === 'En attente';
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des salaires</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un salaire
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des salaires</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="paid">Payés</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <SalaryList
                salaries={filteredSalaries}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onViewHistory={handleViewHistory}
                onEdit={handleEdit}
                onDownloadPayStub={handleDownloadPayStub}
              />
            </TabsContent>
            <TabsContent value="paid" className="mt-4">
              <SalaryList
                salaries={filteredSalaries}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onViewHistory={handleViewHistory}
                onEdit={handleEdit}
                onDownloadPayStub={handleDownloadPayStub}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <SalaryList
                salaries={filteredSalaries}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onViewHistory={handleViewHistory}
                onEdit={handleEdit}
                onDownloadPayStub={handleDownloadPayStub}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Salary Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un salaire</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouveau salaire.
            </DialogDescription>
          </DialogHeader>
          <SalaryForm onSubmit={handleAddSalary} onCancel={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* View Salary Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du salaire</DialogTitle>
          </DialogHeader>
          {selectedSalary && <SalaryDetails salary={selectedSalary} />}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fermer
            </Button>
            <Button onClick={() => handleDownloadPayStub(selectedSalary?.id || '')}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer la fiche de paie
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Salary History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Historique des salaires</DialogTitle>
          </DialogHeader>
          {selectedSalary && <SalaryHistoryView employeeId={selectedSalary.employeeId} />}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Salary Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le salaire</DialogTitle>
          </DialogHeader>
          {selectedSalary && (
            <SalaryForm 
              initialData={selectedSalary} 
              onSubmit={handleUpdateSalary} 
              onCancel={() => setShowEditDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesSalaries;
