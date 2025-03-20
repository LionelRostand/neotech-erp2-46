
import React from 'react';
import { useDepartments } from './useDepartments';
import DepartmentHeader from './DepartmentHeader';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import ManageEmployeesDialog from './ManageEmployeesDialog';
import { Dialog } from '@/components/ui/dialog';

const EmployeesDepartments: React.FC = () => {
  const {
    departments,
    loading,
    isAddDialogOpen,
    isEditDialogOpen,
    isManageEmployeesDialogOpen,
    formData,
    currentDepartment,
    activeTab,
    selectedEmployees,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsManageEmployeesDialogOpen,
    setActiveTab,
    handleInputChange,
    handleManagerChange,
    handleColorChange,
    handleAddDepartment,
    handleEditDepartment,
    handleManageEmployees,
    handleEmployeeSelection,
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments,
    getDepartmentEmployees
  } = useDepartments();
  
  return (
    <div className="space-y-6">
      <DepartmentHeader onAddDepartment={handleAddDepartment} />
      
      <DepartmentTable 
        departments={departments}
        loading={loading}
        onEditDepartment={handleEditDepartment}
        onDeleteDepartment={handleDeleteDepartment}
        onManageEmployees={handleManageEmployees}
      />
      
      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AddDepartmentDialog 
          formData={formData}
          selectedEmployees={selectedEmployees}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onInputChange={handleInputChange}
          onManagerChange={handleManagerChange}
          onColorChange={handleColorChange}
          onEmployeeSelection={handleEmployeeSelection}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleSaveDepartment}
        />
      </Dialog>
      
      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <EditDepartmentDialog 
          formData={formData}
          selectedEmployees={selectedEmployees}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onInputChange={handleInputChange}
          onManagerChange={handleManagerChange}
          onColorChange={handleColorChange}
          onEmployeeSelection={handleEmployeeSelection}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={handleUpdateDepartment}
        />
      </Dialog>
      
      {/* Manage Employees Dialog */}
      {currentDepartment && (
        <Dialog open={isManageEmployeesDialogOpen} onOpenChange={setIsManageEmployeesDialogOpen}>
          <ManageEmployeesDialog 
            department={currentDepartment}
            selectedEmployees={selectedEmployees}
            onEmployeeSelection={handleEmployeeSelection}
            getDepartmentEmployees={getDepartmentEmployees}
            onClose={() => setIsManageEmployeesDialogOpen(false)}
            onSave={handleSaveEmployeeAssignments}
          />
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesDepartments;
