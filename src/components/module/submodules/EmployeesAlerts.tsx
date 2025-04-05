
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ModuleContainer from '@/components/module/ModuleContainer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAlertsData } from '@/hooks/useAlertsData';
import { 
  AlertTriangle, 
  Plus, 
  Filter, 
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import CreateAlertDialog from './alerts/CreateAlertDialog';
import AlertsList from './alerts/AlertsList';
import AlertsFilter from './alerts/AlertsFilter';
import ExportAlertsDialog from './alerts/ExportAlertsDialog';

const EmployeesAlerts: React.FC = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { alerts, isLoading } = useAlertsData();
  
  const [filterCriteria, setFilterCriteria] = useState({
    type: null,
    severity: null,
    status: null,
    employee: null
  });

  const filteredAlerts = alerts.filter(alert => {
    if (filterCriteria.type && alert.type !== filterCriteria.type) return false;
    if (filterCriteria.severity && alert.severity !== filterCriteria.severity) return false;
    if (filterCriteria.status && alert.status !== filterCriteria.status) return false;
    if (filterCriteria.employee && alert.employeeId !== filterCriteria.employee) return false;
    return true;
  });

  return (
    <ModuleContainer>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Gestion des alertes
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les alertes et notifications du système RH
          </p>
        </div>
        <div className="space-x-2 flex">
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <AlertsFilter 
                filterCriteria={filterCriteria}
                setFilterCriteria={setFilterCriteria}
                onClose={() => setFilterDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <ExportAlertsDialog 
                data={filteredAlerts}
                onOpenChange={setExportDialogOpen}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Nouvelle alerte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <CreateAlertDialog onClose={() => setCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <AlertsList 
            alerts={filteredAlerts}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </ModuleContainer>
  );
};

export default EmployeesAlerts;
