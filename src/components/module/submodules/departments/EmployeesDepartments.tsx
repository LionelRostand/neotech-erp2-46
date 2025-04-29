
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import DepartmentHeader from './DepartmentHeader';
import DepartmentTable from './DepartmentTable';
import DepartmentStats from './DepartmentStats';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import ManageEmployeesDialog from './ManageEmployeesDialog';
import { useDepartments } from './useDepartments';

interface EmployeesDepartmentsProps {
  departments?: any[];
  employees?: any[];
}

const EmployeesDepartments: React.FC<EmployeesDepartmentsProps> = ({ departments: propDepartments, employees: propEmployees }) => {
  // Ensure we have valid arrays for departments and employees
  const safeDepartments = Array.isArray(propDepartments) ? propDepartments : [];
  const safeEmployees = Array.isArray(propEmployees) ? propEmployees : [];
  
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
    employees,
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
  } = useDepartments(safeDepartments, safeEmployees);

  console.log("Rendering EmployeesDepartments with", departments?.length, "departments");

  return (
    <div className="space-y-6">
      <DepartmentHeader onAddDepartment={handleAddDepartment} />
      
      <DepartmentStats 
        departments={departments || []} 
        employees={employees || []}
        loading={loading}
      />

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Liste des départements</h2>
          <DepartmentTable 
            departments={departments || []}
            loading={loading}
            onEditDepartment={(id) => {
              const dept = departments?.find(d => d.id === id);
              if (dept) handleEditDepartment(dept);
            }}
            onDeleteDepartment={handleDeleteDepartment}
            onManageEmployees={(id) => {
              const dept = departments?.find(d => d.id === id);
              if (dept) handleManageEmployees(dept);
            }}
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
