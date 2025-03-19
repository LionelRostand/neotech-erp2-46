
import React from 'react';
import { useDepartments } from './useDepartments';
import DepartmentHeader from './DepartmentHeader';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import ManageEmployeesDialog from './ManageEmployeesDialog';

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
      
      {/* Add new department dialog */}
      <AddDepartmentDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        activeTab={activeTab}
        selectedEmployees={selectedEmployees}
        onInputChange={handleInputChange}
        onManagerChange={handleManagerChange}
        onColorChange={handleColorChange}
        onTabChange={setActiveTab}
        onEmployeeSelection={handleEmployeeSelection}
        onSave={handleSaveDepartment}
      />
      
      {/* Edit department dialog */}
      {currentDepartment && (
        <EditDepartmentDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          formData={formData}
          activeTab={activeTab}
          selectedEmployees={selectedEmployees}
          onInputChange={handleInputChange}
          onManagerChange={handleManagerChange}
          onColorChange={handleColorChange}
          onTabChange={setActiveTab}
          onEmployeeSelection={handleEmployeeSelection}
          onSave={handleUpdateDepartment}
        />
      )}
      
      {/* Manage employees dialog */}
      {currentDepartment && (
        <ManageEmployeesDialog 
          open={isManageEmployeesDialogOpen}
          onOpenChange={setIsManageEmployeesDialogOpen}
          department={currentDepartment}
          selectedEmployees={selectedEmployees}
          onEmployeeSelection={handleEmployeeSelection}
          onSave={handleSaveEmployeeAssignments}
        />
      )}
    </div>
  );
};

export default EmployeesDepartments;
