
import React from 'react';
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

const EmployeesSalaries = () => {
  const {
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
  } = useSalaries();

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
