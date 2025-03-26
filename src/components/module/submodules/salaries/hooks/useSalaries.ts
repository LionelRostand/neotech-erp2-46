
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { MOCK_SALARIES } from '../salaryData';
import { employees } from '@/data/employees';
import { generatePayStubPDF } from '../payStubGenerator';

export interface SalaryEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  paymentDate: string;
  status: 'pending' | 'paid';
  leaves: { paid: number; taken: number; remaining: number };
  rtt: { allocated: number; taken: number; remaining: number };
  employeeId?: string;
}

export interface EditFormData {
  salary: string;
  position: string;
  department: string;
}

export interface NewSalaryFormData {
  name: string;
  position: string;
  department: string;
  salary: string;
  paymentDate: string;
  status: 'pending' | 'paid';
  employeeId: string;
}

export const useSalaries = () => {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<SalaryEmployee | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewSalaryDialog, setShowNewSalaryDialog] = useState(false);
  const [filteredSalaries, setFilteredSalaries] = useState<SalaryEmployee[]>(MOCK_SALARIES as SalaryEmployee[]);
  const [editForm, setEditForm] = useState<EditFormData>({
    salary: '',
    position: '',
    department: '',
  });
  const [newSalaryForm, setNewSalaryForm] = useState<NewSalaryFormData>({
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
    setFilteredSalaries(results as SalaryEmployee[]);
  }, [search]);
  
  const handleEdit = (employee: SalaryEmployee) => {
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
  
  const handleViewDetails = (employee: SalaryEmployee) => {
    setSelectedEmployee(employee);
    setShowDetailsDialog(true);
  };
  
  const handleViewHistory = (employee: SalaryEmployee) => {
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
  
  const handleDownloadPayStub = (employee: SalaryEmployee) => {
    generatePayStubPDF(employee);
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
    
    const newSalary: SalaryEmployee = {
      id: filteredSalaries.length + 1,
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

  return {
    search,
    setSearch,
    selectedEmployee,
    showDetailsDialog,
    setShowDetailsDialog,
    showHistoryDialog,
    setShowHistoryDialog,
    showEditDialog,
    setShowEditDialog,
    showNewSalaryDialog,
    setShowNewSalaryDialog,
    filteredSalaries,
    editForm,
    setEditForm,
    newSalaryForm,
    setNewSalaryForm,
    handleEdit,
    handleSaveChanges,
    handleViewDetails,
    handleViewHistory,
    handleExportExcel,
    handleDownloadPayStub,
    handleCreateSalary,
    handleEmployeeSelection
  };
};
