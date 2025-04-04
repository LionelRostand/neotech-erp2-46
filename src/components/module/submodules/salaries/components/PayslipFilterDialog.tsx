
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';

interface PayslipFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  employees: Employee[];
  currentFilters: any;
}

const PayslipFilterDialog: React.FC<PayslipFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  employees,
  currentFilters
}) => {
  const [status, setStatus] = useState(currentFilters.status || 'all');
  const [employee, setEmployee] = useState(currentFilters.employee || 'all');
  const [startDate, setStartDate] = useState(currentFilters.startDate || '');
  const [endDate, setEndDate] = useState(currentFilters.endDate || '');

  const handleApplyFilters = () => {
    onApplyFilters({
      status: status === 'all' ? null : status,
      employee: employee === 'all' ? null : employee,
      startDate: startDate || null,
      endDate: endDate || null
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Filtrer les fiches de paie</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Statut</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Généré">Généré</SelectItem>
            <SelectItem value="Envoyé">Envoyé</SelectItem>
            <SelectItem value="Validé">Validé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Employé</label>
        <Select value={employee} onValueChange={setEmployee}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un employé" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les employés</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Période de début</label>
        <Input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Période de fin</label>
        <Input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleApplyFilters}>
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};

export default PayslipFilterDialog;
