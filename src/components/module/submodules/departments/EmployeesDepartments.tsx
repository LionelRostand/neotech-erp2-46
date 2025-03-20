
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
        formData={formData}
        activeTab={activeTab}
        selectedEmployees={selectedEmployees}
        onInputChange={handleInputChange}
        onManagerChange={handleManagerChange}
        onColorChange={handleColorChange}
        onTabChange={setActiveTab}
        onEmployeeSelection={handleEmployeeSelection}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleSaveDepartment}
      />
      
      {/* Edit department dialog */}
      {currentDepartment && (
        <EditDepartmentDialog 
          formData={formData}
          activeTab={activeTab}
          selectedEmployees={selectedEmployees}
          onInputChange={handleInputChange}
          onManagerChange={handleManagerChange}
          onColorChange={handleColorChange}
          onTabChange={setActiveTab}
          onEmployeeSelection={handleEmployeeSelection}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={handleUpdateDepartment}
        />
      )}
      
      {/* Manage employees dialog */}
      {currentDepartment && (
        <ManageEmployeesDialog 
          department={currentDepartment}
          selectedEmployees={selectedEmployees}
          onEmployeeSelection={handleEmployeeSelection}
          onClose={() => setIsManageEmployeesDialogOpen(false)}
          onSave={handleSaveEmployeeAssignments}
          getDepartmentEmployees={getDepartmentEmployees}
        />
      )}
    </div>
  );
};

export default EmployeesDepartments;
