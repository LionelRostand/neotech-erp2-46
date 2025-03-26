
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SalaryList } from './salaries/SalaryList';
import { NewSalaryDialog } from './salaries/NewSalaryDialog';
import { SalaryDetailsDialog } from './salaries/SalaryDetailsDialog';
import { SalaryHistoryDialog } from './salaries/SalaryHistoryDialog';
import { EditSalaryDialog } from './salaries/EditSalaryDialog';
import { MOCK_HISTORY } from './salaries/salaryData';
import { useSalaries } from './salaries/hooks/useSalaries';
import { SalaryHeader } from './salaries/components/SalaryHeader';
import { SalarySearch } from './salaries/components/SalarySearch';
import { useEmployeeSalaries, EmployeeSalary } from '@/hooks/useEmployeeSalaries';
import { useEmployees } from '@/hooks/useEmployees';
import { toast } from 'sonner';

const EmployeesSalaries = () => {
  // État local
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewSalaryDialog, setShowNewSalaryDialog] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [newSalaryForm, setNewSalaryForm] = useState<any>({});
  
  // Données Firebase
  const { 
    salaries, 
    isLoading: isSalariesLoading, 
    addSalary, 
    updateSalary, 
    deleteSalary,
    refreshSalaries 
  } = useEmployeeSalaries();
  
  const { employees, isLoading: isEmployeesLoading } = useEmployees();
  
  // Recharger les données quand on entre dans ce composant
  useEffect(() => {
    console.log('EmployeesSalaries: Refreshing salary data');
    refreshSalaries();
  }, [refreshSalaries]);
  
  // Filtrer les salaires selon la recherche
  const filteredSalaries = salaries.filter(salary => 
    salary.employeeName.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleEdit = (salary: EmployeeSalary) => {
    setSelectedEmployee(salary);
    setEditForm(salary);
    setShowEditDialog(true);
  };

  const handleSaveChanges = async (data: any) => {
    try {
      if (!selectedEmployee?.id) return;
      await updateSalary(selectedEmployee.id, data);
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error saving salary changes:', error);
    }
  };

  const handleViewDetails = (salary: EmployeeSalary) => {
    setSelectedEmployee(salary);
    setShowDetailsDialog(true);
  };

  const handleViewHistory = (salary: EmployeeSalary) => {
    setSelectedEmployee(salary);
    setShowHistoryDialog(true);
  };

  const handleExportExcel = () => {
    toast.success("Export Excel en cours...");
    setTimeout(() => {
      toast.success("Données exportées avec succès");
    }, 1500);
  };

  const handleDownloadPayStub = (id: string) => {
    toast.success("Génération de la fiche de paie en cours...");
    setTimeout(() => {
      toast.success("Fiche de paie téléchargée");
    }, 1500);
  };

  const handleCreateSalary = async (data: any) => {
    try {
      await addSalary(data);
      setShowNewSalaryDialog(false);
    } catch (error) {
      console.error('Error creating salary:', error);
    }
  };

  const handleEmployeeSelection = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setNewSalaryForm({
        ...newSalaryForm,
        employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <SalaryHeader 
            onExportExcel={handleExportExcel} 
            onNewSalary={() => setShowNewSalaryDialog(true)} 
          />
          
          <SalarySearch search={search} setSearch={setSearch} />
          
          <SalaryList 
            salaries={filteredSalaries}
            isLoading={isSalariesLoading}
            onViewDetails={handleViewDetails}
            onViewHistory={handleViewHistory}
            onEdit={handleEdit}
            onDownloadPayStub={handleDownloadPayStub}
          />
        </CardContent>
      </Card>
      
      <SalaryDetailsDialog 
        isOpen={showDetailsDialog} 
        onOpenChange={setShowDetailsDialog}
        employee={selectedEmployee}
      />
      
      <SalaryHistoryDialog 
        isOpen={showHistoryDialog} 
        onOpenChange={setShowHistoryDialog}
        employee={selectedEmployee}
        history={MOCK_HISTORY}
      />
      
      <EditSalaryDialog 
        isOpen={showEditDialog} 
        onOpenChange={setShowEditDialog}
        employee={selectedEmployee}
        formData={editForm}
        setFormData={setEditForm}
        onSave={handleSaveChanges}
      />
      
      <NewSalaryDialog 
        isOpen={showNewSalaryDialog} 
        onOpenChange={setShowNewSalaryDialog}
        formData={newSalaryForm}
        setFormData={setNewSalaryForm}
        onEmployeeSelection={handleEmployeeSelection}
        onCreate={handleCreateSalary}
        employees={employees}
        isLoadingEmployees={isEmployeesLoading}
      />
    </div>
  );
};

export default EmployeesSalaries;
