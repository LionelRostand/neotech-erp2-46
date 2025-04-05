
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface RecruitmentFilterDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  filterCriteria: {
    department: string | null;
    contractType: string | null;
    status: string | null;
    priority: string | null;
    location: string | null;
  };
  setFilterCriteria: React.Dispatch<React.SetStateAction<{
    department: string | null;
    contractType: string | null;
    status: string | null;
    priority: string | null;
    location: string | null;
  }>>;
  onClose?: () => void;
}

const RecruitmentFilterDialog: React.FC<RecruitmentFilterDialogProps> = ({ 
  open,
  onOpenChange,
  filterCriteria, 
  setFilterCriteria, 
  onClose 
}) => {
  const departments = ["IT", "RH", "Finance", "Marketing", "Commercial", "Logistique"];
  const contractTypes = ["CDI", "CDD", "Alternance", "Stage", "Freelance"];
  const statusOptions = ["Ouvert", "En cours", "Clôturé"];
  const priorities = ["Basse", "Moyenne", "Haute"];
  const locations = ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Lille"];

  const handleReset = () => {
    setFilterCriteria({
      department: null,
      contractType: null,
      status: null,
      priority: null,
      location: null,
    });
  };

  const handleApply = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrer les offres d'emploi</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="filter-department">Département</Label>
              <Select
                value={filterCriteria.department || "all"}
                onValueChange={(value) => setFilterCriteria({...filterCriteria, department: value === "all" ? null : value})}
              >
                <SelectTrigger id="filter-department">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map(department => (
                    <SelectItem key={department} value={department}>{department}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="filter-contractType">Type de contrat</Label>
              <Select
                value={filterCriteria.contractType || "all"}
                onValueChange={(value) => setFilterCriteria({...filterCriteria, contractType: value === "all" ? null : value})}
              >
                <SelectTrigger id="filter-contractType">
                  <SelectValue placeholder="Tous les types de contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types de contrat</SelectItem>
                  {contractTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
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
              <Label htmlFor="filter-priority">Priorité</Label>
              <Select
                value={filterCriteria.priority || "all"}
                onValueChange={(value) => setFilterCriteria({...filterCriteria, priority: value === "all" ? null : value})}
              >
                <SelectTrigger id="filter-priority">
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="filter-location">Localisation</Label>
              <Select
                value={filterCriteria.location || "all"}
                onValueChange={(value) => setFilterCriteria({...filterCriteria, location: value === "all" ? null : value})}
              >
                <SelectTrigger id="filter-location">
                  <SelectValue placeholder="Toutes les localisations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les localisations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
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
      </DialogContent>
    </Dialog>
  );
};

export default RecruitmentFilterDialog;
