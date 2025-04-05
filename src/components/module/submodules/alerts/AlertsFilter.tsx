
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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
  onClose?: () => void;
}

const AlertsFilter: React.FC<AlertsFilterProps> = ({ filterCriteria, setFilterCriteria, onClose }) => {
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

  const handleApply = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Filtrer les alertes</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="filter-type">Type d'alerte</Label>
            <Select
              value={filterCriteria.type || "all"}
              onValueChange={(value) => setFilterCriteria({...filterCriteria, type: value === "all" ? null : value})}
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {alertTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="filter-severity">Priorité</Label>
            <Select
              value={filterCriteria.severity || "all"}
              onValueChange={(value) => setFilterCriteria({...filterCriteria, severity: value === "all" ? null : value})}
            >
              <SelectTrigger id="filter-severity">
                <SelectValue placeholder="Toutes les priorités" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                {severityLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="filter-status">Statut</Label>
            <Select
              value={filterCriteria.status || "all"}
              onValueChange={(value) => setFilterCriteria({...filterCriteria, status: value === "all" ? null : value})}
            >
              <SelectTrigger id="filter-status">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="filter-employee">Employé</Label>
            <Select
              value={filterCriteria.employee || "all"}
              onValueChange={(value) => setFilterCriteria({...filterCriteria, employee: value === "all" ? null : value})}
            >
              <SelectTrigger id="filter-employee">
                <SelectValue placeholder="Tous les employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les employés</SelectItem>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button onClick={handleApply}>
          Appliquer
        </Button>
      </DialogFooter>
    </>
  );
};

export default AlertsFilter;
