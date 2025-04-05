
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface AlertsFilterProps {
  filterCriteria: {
    type: string | null;
    severity: string | null;
    status: string | null;
    employee: string | null;
  };
  setFilterCriteria: React.Dispatch<React.SetStateAction<{
    type: string | null;
    severity: string | null;
    status: string | null;
    employee: string | null;
  }>>;
}

const AlertsFilter: React.FC<AlertsFilterProps> = ({ filterCriteria, setFilterCriteria }) => {
  const { employees } = useHrModuleData();

  const alertTypes = ['Contrat', 'Absence', 'Document', 'Congé', 'Évaluation', 'Autre'];
  const severityLevels = ['Haute', 'Moyenne', 'Basse'];
  const statusOptions = ['Active', 'En attente', 'Résolue'];

  const handleReset = () => {
    setFilterCriteria({
      type: null,
      severity: null,
      status: null,
      employee: null,
    });
  };

  return (
    <div className="space-y-4 py-1">
      <h3 className="font-medium mb-3">Filtrer les alertes</h3>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="filter-type">Type d'alerte</Label>
          <Select
            value={filterCriteria.type || ""}
            onValueChange={(value) => setFilterCriteria({...filterCriteria, type: value || null})}
          >
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              {alertTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-severity">Priorité</Label>
          <Select
            value={filterCriteria.severity || ""}
            onValueChange={(value) => setFilterCriteria({...filterCriteria, severity: value || null})}
          >
            <SelectTrigger id="filter-severity">
              <SelectValue placeholder="Toutes les priorités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les priorités</SelectItem>
              {severityLevels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-status">Statut</Label>
          <Select
            value={filterCriteria.status || ""}
            onValueChange={(value) => setFilterCriteria({...filterCriteria, status: value || null})}
          >
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-employee">Employé</Label>
          <Select
            value={filterCriteria.employee || ""}
            onValueChange={(value) => setFilterCriteria({...filterCriteria, employee: value || null})}
          >
            <SelectTrigger id="filter-employee">
              <SelectValue placeholder="Tous les employés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les employés</SelectItem>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={handleReset}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default AlertsFilter;
