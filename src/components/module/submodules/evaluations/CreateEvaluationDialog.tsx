
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface CreateEvaluationDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void; // Added this prop
  onSubmit: (data: any) => void;
  employees?: any[];
}

const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({
  open,
  onClose,
  onOpenChange,
  onSubmit,
  employees = []
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    evaluatorId: 'none',
    date: new Date(),
    status: 'Planifiée',
    title: '',
    comments: '',
  });
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const handleChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove 'none' evaluatorId if selected
    const submissionData = {...formData};
    if (submissionData.evaluatorId === 'none') {
      submissionData.evaluatorId = '';
    }
    
    onSubmit(submissionData);
  };
  
  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      employeeId: '',
      evaluatorId: 'none',
      date: new Date(),
      status: 'Planifiée',
      title: '',
      comments: '',
    });
  };
  
  // Use onOpenChange if provided, otherwise fallback to our internal handling
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else if (!open) {
      handleCancel();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Nouvelle évaluation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employé à évaluer</Label>
            <Select 
              value={formData.employeeId} 
              onValueChange={(value) => handleChange('employeeId', value)}
              required
            >
              <SelectTrigger id="employeeId">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.length === 0 ? (
                  <SelectItem value="no-employees">Aucun employé disponible</SelectItem>
                ) : (
                  employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evaluatorId">Évaluateur</Label>
            <Select 
              value={formData.evaluatorId} 
              onValueChange={(value) => handleChange('evaluatorId', value)}
            >
              <SelectTrigger id="evaluatorId">
                <SelectValue placeholder="Sélectionner un évaluateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Non assigné</SelectItem>
                {employees?.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'évaluation</Label>
            <Input
              id="title"
              placeholder="Ex: Évaluation annuelle"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, 'dd MMMM yyyy', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      handleChange('date', date || new Date());
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    locale={fr}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planifiée">Planifiée</SelectItem>
                  <SelectItem value="Complétée">Complétée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Commentaires</Label>
            <Textarea
              id="comments"
              placeholder="Objectifs et informations complémentaires"
              rows={4}
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={!formData.employeeId || !formData.title}>
              Créer l'évaluation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvaluationDialog;
