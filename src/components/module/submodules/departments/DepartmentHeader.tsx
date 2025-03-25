
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Plus, BarChart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DepartmentHeaderProps {
  onAddDepartment: () => void;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({ onAddDepartment }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Gestion des départements
          </h2>
          <p className="text-muted-foreground">
            Créez et gérez les départements de votre entreprise
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={onAddDepartment}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Nouveau département
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total départements
                </p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total employés
                </p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 flex items-center justify-center rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taux de croissance
                </p>
                <h3 className="text-2xl font-bold">+12.5%</h3>
              </div>
              <div className="h-12 w-12 bg-green-500/10 flex items-center justify-center rounded-full">
                <BarChart className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentHeader;
