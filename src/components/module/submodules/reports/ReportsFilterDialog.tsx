
import React from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportsFilterDialogProps {
  filterCriteria: {
    type: string | null;
    format: string | null;
    status: string | null;
    period: string | null;
    createdBy: string | null;
  };
  setFilterCriteria: React.Dispatch<React.SetStateAction<{
    type: string | null;
    format: string | null;
    status: string | null;
    period: string | null;
    createdBy: string | null;
  }>>;
  onClose?: () => void;
}

const ReportsFilterDialog: React.FC<ReportsFilterDialogProps> = ({ 
  filterCriteria, 
  setFilterCriteria, 
  onClose 
}) => {
  const reportTypes = [
    { id: "social", name: "Bilan social" },
    { id: "salaries", name: "Analyse des salaires" },
    { id: "absences", name: "Suivi des absences" },
    { id: "turnover", name: "Turnover" },
    { id: "formations", name: "Formation et compétences" },
    { id: "custom", name: "Rapport personnalisé" }
  ];

  const formats = ["PDF", "Excel", "CSV"];
  const statusOptions = ["Généré", "En traitement", "Erreur"];
  const periods = ["Ce mois-ci", "Ce trimestre", "Cette année"];

  const handleReset = () => {
    setFilterCriteria({
      type: null,
      format: null,
      status: null,
      period: null,
      createdBy: null,
    });
  };

  const handleApply = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Filtrer les rapports</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="filter-type">Type de rapport</Label>
            <Select
              value={filterCriteria.type || "all"}
              onValueChange={(value) => setFilterCriteria({...filterCriteria, type: value === "all" ? null : value})}
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {reportTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="filter-format">Format</Label>
            <Select
              value={filterCriteria.format || "all"}
              onValueChange={(value) => setFilterCriteria({...filterCriteria, format: value === "all" ? null : value})}
            >
              <SelectTrigger id="filter-format">
                <SelectValue placeholder="Tous les formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les formats</SelectItem>
                {formats.map(format => (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
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
            <Label htmlFor="filter-period">Période</Label>
            <Select
              value={filterCriteria.period || "all"}
              onValueChange={(value) => setFilterCriteria({...filterCriteria, period: value === "all" ? null : value})}
            >
              <SelectTrigger id="filter-period">
                <SelectValue placeholder="Toutes les périodes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                {periods.map(period => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 pt-2">
            <Label htmlFor="filter-createdBy">Créé par moi uniquement</Label>
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox 
                id="filter-createdBy" 
                checked={filterCriteria.createdBy === "me"}
                onCheckedChange={(checked) => 
                  setFilterCriteria({...filterCriteria, createdBy: checked ? "me" : null})
                }
              />
              <label
                htmlFor="filter-createdBy"
                className="text-sm leading-none cursor-pointer"
              >
                Afficher uniquement mes rapports
              </label>
            </div>
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

export default ReportsFilterDialog;
