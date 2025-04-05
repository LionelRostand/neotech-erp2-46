import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Check, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const EmployeesEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState([
    { id: '1', employee: 'John Doe', date: '2024-01-20', status: 'Planifiée', score: 85 },
    { id: '2', employee: 'Jane Smith', date: '2024-02-15', status: 'Complétée', score: 92 },
    { id: '3', employee: 'Alice Johnson', date: '2024-03-10', status: 'Planifiée', score: 78 },
  ]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsDeleteDialogOpen(true);
  };

  const closeDialogs = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedEvaluation(null);
  };

  // Add a mock submit handler for the CreateEvaluationDialog
  const handleCreateEvaluation = async (data: any) => {
    console.log('Creating evaluation with data:', data);
    // Implement actual evaluation creation logic
    return Promise.resolve();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Évaluations des employés</h1>
      <p className="mb-4">Gérez les évaluations de performance de vos employés.</p>

      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog}>
          Ajouter une évaluation
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell>{evaluation.employee}</TableCell>
                <TableCell>{evaluation.date}</TableCell>
                <TableCell>{evaluation.status}</TableCell>
                <TableCell>{evaluation.score}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(evaluation)}>
                    Modifier
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(evaluation)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateEvaluationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateEvaluation}
      />

      <EditEvaluationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        evaluation={selectedEvaluation}
        onUpdate={(updatedEvaluation) => {
          // Update the evaluation in the list
          setEvaluations((prevEvaluations) =>
            prevEvaluations.map((evaluation) =>
              evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
            )
          );
          closeDialogs();
        }}
      />

      <DeleteEvaluationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        evaluation={selectedEvaluation}
        onDelete={() => {
          // Delete the evaluation from the list
          setEvaluations((prevEvaluations) =>
            prevEvaluations.filter((evaluation) => evaluation.id !== selectedEvaluation.id)
          );
          closeDialogs();
        }}
      />
    </div>
  );
};

export default EmployeesEvaluations;

interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [employee, setEmployee] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState('Planifiée');
  const [score, setScore] = useState(0);

  const handleSubmit = async () => {
    const data = { employee, date, status, score };
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une évaluation</DialogTitle>
          <DialogDescription>
            Ajouter une nouvelle évaluation pour un employé.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employé
            </Label>
            <Input id="employee" value={employee} onChange={(e) => setEmployee(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={fr}
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Statut
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planifiée">Planifiée</SelectItem>
                <SelectItem value="Complétée">Complétée</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right">
              Score
            </Label>
            <Input type="number" id="score" value={score} onChange={(e) => setScore(Number(e.target.value))} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: any;
  onUpdate: (evaluation: any) => void;
}

const EditEvaluationDialog: React.FC<EditEvaluationDialogProps> = ({ open, onOpenChange, evaluation, onUpdate }) => {
  const [employee, setEmployee] = useState(evaluation?.employee || '');
  const [date, setDate] = useState<Date | undefined>(evaluation?.date ? new Date(evaluation.date) : undefined);
  const [status, setStatus] = useState(evaluation?.status || 'Planifiée');
  const [score, setScore] = useState(evaluation?.score || 0);

  useEffect(() => {
    if (evaluation) {
      setEmployee(evaluation.employee || '');
      setDate(evaluation.date ? new Date(evaluation.date) : undefined);
      setStatus(evaluation.status || 'Planifiée');
      setScore(evaluation.score || 0);
    }
  }, [evaluation]);

  const handleUpdate = () => {
    const updatedEvaluation = { ...evaluation, employee, date: date?.toISOString().split('T')[0], status, score };
    onUpdate(updatedEvaluation);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier une évaluation</DialogTitle>
          <DialogDescription>
            Modifier les informations de l'évaluation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employé
            </Label>
            <Input id="employee" value={employee} onChange={(e) => setEmployee(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={fr}
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Statut
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planifiée">Planifiée</SelectItem>
                <SelectItem value="Complétée">Complétée</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right">
              Score
            </Label>
            <Input type="number" id="score" value={score} onChange={(e) => setScore(Number(e.target.value))} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" onClick={handleUpdate}>Modifier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: any;
  onDelete: () => void;
}

const DeleteEvaluationDialog: React.FC<DeleteEvaluationDialogProps> = ({ open, onOpenChange, evaluation, onDelete }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer une évaluation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette évaluation ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" variant="destructive" onClick={onDelete}>Supprimer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
