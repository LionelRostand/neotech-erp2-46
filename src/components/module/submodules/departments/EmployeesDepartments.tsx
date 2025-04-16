
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentHeader from './DepartmentHeader';
import DepartmentTable from './DepartmentTable';
import DepartmentsDashboard from './DepartmentsDashboard';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import ManageEmployeesDialog from './ManageEmployeesDialog';
import { useDepartments } from './useDepartments';

const EmployeesDepartments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  const {
    departments,
    loading,
    isAddDialogOpen,
    isEditDialogOpen,
    isManageEmployeesDialogOpen,
    formData,
    currentDepartment,
    activeTab: formActiveTab,
    selectedEmployees,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsManageEmployeesDialogOpen,
    setActiveTab: setFormActiveTab,
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
            <TabsTrigger value="departments">Liste des Départements</TabsTrigger>
          </TabsList>
          <DepartmentHeader onAddDepartment={handleAddDepartment} />
        </div>

        <TabsContent value="dashboard">
          <DepartmentsDashboard />
        </TabsContent>
        
        <TabsContent value="departments">
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
        </TabsContent>
      </Tabs>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AddDepartmentDialog 
          formData={formData}
          selectedEmployees={selectedEmployees}
          activeTab={formActiveTab}
          onTabChange={setFormActiveTab}
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
          activeTab={formActiveTab}
          onTabChange={setFormActiveTab}
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
