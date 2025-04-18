
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import DepartmentHeader from './departments/DepartmentHeader';
import DepartmentTable from './departments/DepartmentTable';
import AddDepartmentDialog from './departments/AddDepartmentDialog';
import EditDepartmentDialog from './departments/EditDepartmentDialog';
import ManageEmployeesDialog from './departments/ManageEmployeesDialog';
import { useDepartments } from './departments/useDepartments';

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
    handleCompanyChange,
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

      <Card>
        <CardContent className="p-6">
          <DepartmentTable 
            departments={departments}
            loading={loading}
            onEditDepartment={(id) => handleEditDepartment(departments.find(dept => dept.id === id)!)}
            onDeleteDepartment={handleDeleteDepartment}
            onManageEmployees={(id) => handleManageEmployees(departments.find(dept => dept.id === id)!)}
          />
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AddDepartmentDialog 
          formData={formData}
          selectedEmployees={selectedEmployees}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onInputChange={handleInputChange}
          onManagerChange={handleManagerChange}
          onCompanyChange={handleCompanyChange}
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
          onCompanyChange={handleCompanyChange}
          onColorChange={handleColorChange}
          onEmployeeSelection={handleEmployeeSelection}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={handleUpdateDepartment}
        />
      </Dialog>

      {/* Manage Employees Dialog */}
      {currentDepartment && (
        <Dialog 
          open={isManageEmployeesDialogOpen} 
          onOpenChange={setIsManageEmployeesDialogOpen}
        >
          <ManageEmployeesDialog 
            department={currentDepartment}
            selectedEmployees={selectedEmployees}
            onEmployeeSelection={handleEmployeeSelection}
            getDepartmentEmployees={(departmentId: string) => getDepartmentEmployees(departmentId)}
            onClose={() => setIsManageEmployeesDialogOpen(false)}
            onSave={handleSaveEmployeeAssignments}
          />
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesDepartments;
