
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import DepartmentHeader from './DepartmentHeader';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import ManageEmployeesDialog from './ManageEmployeesDialog';
import { useDepartments } from './useDepartments';

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

      <Card>
        <CardContent className="p-6">
          <DepartmentTable 
            departments={departments}
            loading={loading}
            onEditDepartment={(id) => handleEditDepartment(departments.find(dept => dept.id === id)!)}
            onDeleteDepartment={(id) => handleDeleteDepartment(id, departments.find(dept => dept.id === id)?.name || 'Département')}
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
          onColorChange={handleColorChange}
          onEmployeeSelection={(employeeId) => handleEmployeeSelection(employeeId, !selectedEmployees.includes(employeeId))}
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
          onEmployeeSelection={(employeeId) => handleEmployeeSelection(employeeId, !selectedEmployees.includes(employeeId))}
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
            onEmployeeSelection={(employeeId) => handleEmployeeSelection(employeeId, !selectedEmployees.includes(employeeId))}
            getDepartmentEmployees={(departmentId) => getDepartmentEmployees(departmentId)}
            onClose={() => setIsManageEmployeesDialogOpen(false)}
            onSave={handleSaveEmployeeAssignments}
          />
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesDepartments;
