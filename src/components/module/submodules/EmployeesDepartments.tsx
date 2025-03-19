
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { employees } from '@/data/employees';
import DepartmentHeader from './departments/DepartmentHeader';
import DepartmentCard from './departments/DepartmentCard';
import DepartmentTable from './departments/DepartmentTable';
import AddDepartmentDialog from './departments/AddDepartmentDialog';
import EditDepartmentDialog from './departments/EditDepartmentDialog';
import ManageEmployeesDialog from './departments/ManageEmployeesDialog';
import { useDepartments } from './departments/useDepartments';

const EmployeesDepartments: React.FC = () => {
  const {
    departments,
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

      <DepartmentCard title="Liste des départements">
        <DepartmentTable 
          departments={departments}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onManageEmployees={handleManageEmployees}
        />
      </DepartmentCard>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AddDepartmentDialog 
          formData={formData}
          employees={employees}
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
          employees={employees}
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
            employees={employees}
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
