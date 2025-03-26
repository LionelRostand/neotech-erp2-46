
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { SalaryList } from './salaries/SalaryList';
import { NewSalaryDialog } from './salaries/NewSalaryDialog';
import { SalaryDetailsDialog } from './salaries/SalaryDetailsDialog';
import { SalaryHistoryDialog } from './salaries/SalaryHistoryDialog';
import { EditSalaryDialog } from './salaries/EditSalaryDialog';
import { generatePayStubPDF } from './salaries/payStubGenerator';
import { MOCK_SALARIES, MOCK_HISTORY } from './salaries/salaryData';
import { employees } from '@/data/employees';

const EmployeesSalaries = () => {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewSalaryDialog, setShowNewSalaryDialog] = useState(false);
  const [filteredSalaries, setFilteredSalaries] = useState(MOCK_SALARIES);
  const [editForm, setEditForm] = useState({
    salary: '',
    position: '',
    department: '',
  });
  const [newSalaryForm, setNewSalaryForm] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    employeeId: '',
  });
  
  useEffect(() => {
    const results = MOCK_SALARIES.filter(employee => 
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSalaries(results);
  }, [search]);
  
  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setEditForm({
      salary: employee.salary.toString(),
      position: employee.position,
      department: employee.department,
    });
    setShowEditDialog(true);
  };
  
  const handleSaveChanges = () => {
    toast.success("Informations mises à jour avec succès");
    setShowEditDialog(false);
  };
  
  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setShowDetailsDialog(true);
  };
  
  const handleViewHistory = (employee: any) => {
    setSelectedEmployee(employee);
    setShowHistoryDialog(true);
  };
  
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalaries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salaires");
    XLSX.writeFile(workbook, "salaires.xlsx");
    toast.success("Données exportées en Excel avec succès");
  };
  
  const handleCreateSalary = () => {
    if (!newSalaryForm.employeeId && !newSalaryForm.name) {
      toast.error("Veuillez sélectionner un employé ou saisir un nom");
      return;
    }
    
    if (!newSalaryForm.salary) {
      toast.error("Veuillez saisir un salaire");
      return;
    }
    
    const selectedEmployeeDetails = newSalaryForm.employeeId 
      ? employees.find(emp => emp.id === newSalaryForm.employeeId) 
      : null;
      
    const employeeName = selectedEmployeeDetails 
      ? `${selectedEmployeeDetails.firstName} ${selectedEmployeeDetails.lastName}`
      : newSalaryForm.name;
      
    const employeePosition = selectedEmployeeDetails
      ? selectedEmployeeDetails.position
      : newSalaryForm.position;
      
    const employeeDepartment = selectedEmployeeDetails
      ? selectedEmployeeDetails.department
      : newSalaryForm.department;
    
    const newSalary = {
      id: MOCK_SALARIES.length + 1,
      name: employeeName,
      position: employeePosition,
      department: employeeDepartment,
      salary: parseFloat(newSalaryForm.salary),
      paymentDate: newSalaryForm.paymentDate,
      status: newSalaryForm.status,
      leaves: { paid: 12, taken: 0, remaining: 12 },
      rtt: { allocated: 10, taken: 0, remaining: 10 },
      employeeId: newSalaryForm.employeeId
    };
    
    setFilteredSalaries([newSalary, ...filteredSalaries]);
    toast.success("Nouvelle fiche de paie créée avec succès");
    setShowNewSalaryDialog(false);
    
    setNewSalaryForm({
      name: '',
      position: '',
      department: '',
      salary: '',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      employeeId: '',
    });
  };
  
  const handleEmployeeSelection = (employeeId: string) => {
    setNewSalaryForm({
      ...newSalaryForm,
      employeeId,
      name: '',
    });
  };
  
  const handleDownloadPayStub = (employee: any) => {
    generatePayStubPDF(employee);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Gestion des salaires</h2>
              <p className="text-muted-foreground">Gérez et suivez les salaires des employés</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Exporter Excel
              </Button>
              <Button onClick={() => setShowNewSalaryDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </div>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, poste, département..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <SalaryList 
            salaries={filteredSalaries} 
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
      />
    </div>
  );
};

export default EmployeesSalaries;
