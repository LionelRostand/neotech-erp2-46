
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface TrainingsFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

const TrainingsFilter: React.FC<TrainingsFilterProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
}) => {
  const { departments } = useHrModuleData();
  const [filters, setFilters] = useState({
    employee: '',
    title: '',
    type: '',
    department: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    provider: '',
    certificate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setFilters({
      employee: '',
      title: '',
      type: '',
      department: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      provider: '',
      certificate: '',
    });
    onApplyFilters({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrer les formations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="employee">Nom de l'employé</Label>
            <Input
              id="employee"
              name="employee"
              placeholder="Rechercher un employé"
              value={filters.employee}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de la formation</Label>
            <Input
              id="title"
              name="title"
              placeholder="Rechercher par titre"
              value={filters.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de formation</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  <SelectItem value="Formation professionnelle">Formation professionnelle</SelectItem>
                  <SelectItem value="Formation réglementaire">Formation réglementaire</SelectItem>
                  <SelectItem value="Formation en ligne">Formation en ligne</SelectItem>
                  <SelectItem value="Séminaire">Séminaire</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Conférence">Conférence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select
                value={filters.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date de début</Label>
              <Input
                id="dateFrom"
                name="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date de fin</Label>
              <Input
                id="dateTo"
                name="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="Planifiée">Planifiée</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminée">Terminée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">Prestataire</Label>
              <Input
                id="provider"
                name="provider"
                placeholder="Nom du prestataire"
                value={filters.provider}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate">Certification</Label>
            <Select
              value={filters.certificate}
              onValueChange={(value) => handleSelectChange('certificate', value)}
            >
              <SelectTrigger id="certificate">
                <SelectValue placeholder="Certification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="true">Avec certification</SelectItem>
                <SelectItem value="false">Sans certification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleResetFilters}>
            Réinitialiser
          </Button>
          <Button type="button" onClick={handleApplyFilters}>
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingsFilter;
