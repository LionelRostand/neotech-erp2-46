
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument } from '@/lib/firebase-utils';
import { RecruitmentPost } from '@/types/recruitment';

interface CreateRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateRecruitmentDialog: React.FC<CreateRecruitmentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const { departments, isLoading: loadingDepts } = useAvailableDepartments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<RecruitmentPost>>({
    position: '',
    department: '',
    status: 'Ouvert',
    priority: 'Moyenne',
    location: '',
    description: '',
    requirements: [],
    hiringManagerId: '',
    hiringManagerName: '',
    contractType: 'CDI',
    salary: '',
    openDate: new Date().toISOString(),
    applicationCount: 0
  });

  const handleDepartmentChange = (departmentId: string) => {
    const selectedDept = departments.find(dept => dept.id === departmentId);
    if (selectedDept) {
      setFormData(prev => ({
        ...prev,
        department: departmentId,
        hiringManagerId: selectedDept.managerId,
        hiringManagerName: selectedDept.managerName
      }));
    }
  };

  const handleChange = (
    name: keyof RecruitmentPost,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newRecruitment = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requirements: typeof formData.requirements === 'string' 
          ? formData.requirements.split('\n') 
          : formData.requirements,
      };

      await addDocument(COLLECTIONS.HR.RECRUITMENTS, newRecruitment);
      
      toast({
        title: "Offre créée",
        description: "L'offre de recrutement a été créée avec succès",
      });
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de l'offre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'offre",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle offre de recrutement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={formData.position || ''}
                onChange={(e) => handleChange('position', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select 
                value={formData.department} 
                onValueChange={handleDepartmentChange}
                disabled={loadingDepts}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringManagerId">ID Manager</Label>
              <Input
                id="hiringManagerId"
                value={formData.hiringManagerId || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringManagerName">Nom du Manager</Label>
              <Input
                id="hiringManagerName"
                value={formData.hiringManagerName || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractType">Type de contrat</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => handleChange('contractType', value)}
              >
                <SelectTrigger id="contractType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Alternance">Alternance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salaire</Label>
              <Input
                id="salary"
                value={formData.salary || ''}
                onChange={(e) => handleChange('salary', e.target.value)}
                placeholder="Ex: 35-45k€"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du poste</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Prérequis (un par ligne)</Label>
            <Textarea
              id="requirements"
              value={Array.isArray(formData.requirements) ? formData.requirements.join('\n') : formData.requirements || ''}
              onChange={(e) => handleChange('requirements', e.target.value)}
              required
              rows={4}
              placeholder="Listez les prérequis, un par ligne"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingDepts}>
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecruitmentDialog;
