
import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateDocument } from "@/hooks/firestore/update-operations";
import { RecruitmentPost } from "@/hooks/useRecruitmentData";

interface EditRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruitment: RecruitmentPost | null;
  onSuccess: () => void;
}

const EditRecruitmentDialog: React.FC<EditRecruitmentDialogProps> = ({
  open,
  onOpenChange,
  recruitment,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<RecruitmentPost>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (recruitment && open) {
      setFormData({
        position: recruitment.position,
        department: recruitment.department,
        priority: recruitment.priority,
        location: recruitment.location,
        contractType: recruitment.contractType,
        salary: recruitment.salary,
        description: recruitment.description,
        requirements: recruitment.requirements,
        status: recruitment.status,
        applicationDeadline: recruitment.applicationDeadline,
      });
    }
  }, [recruitment, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruitment || !formData.position || !formData.location) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, we would update the document in Firestore
      console.log("Updating job post:", recruitment.id, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app with Firestore, you would use:
      // await updateDocument('recruitments', recruitment.id, formData);
      
      toast({
        title: "Offre mise à jour",
        description: "L'offre d'emploi a été mise à jour avec succès.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating job post:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'offre.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!recruitment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'offre d'emploi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Intitulé du poste *</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ""}
                  onChange={handleInputChange}
                  placeholder="ex: Développeur Full-Stack"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Logistique">Logistique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                  placeholder="ex: Paris"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractType">Type de contrat</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => handleSelectChange("contractType", value)}
                >
                  <SelectTrigger id="contractType">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Alternance">Alternance</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salaire</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={formData.salary || ""}
                  onChange={handleInputChange}
                  placeholder="ex: 45-55K€"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basse">Basse</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Haute">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ouvert">Ouvert</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Clôturé">Clôturé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Date limite de candidature</Label>
              <Input
                id="applicationDeadline"
                name="applicationDeadline"
                value={formData.applicationDeadline || ""}
                onChange={handleInputChange}
                placeholder="ex: 15/05/2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du poste</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Décrivez les responsabilités et missions du poste"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Prérequis et compétences</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements || ""}
                onChange={handleInputChange}
                placeholder="Listez les compétences et qualifications requises"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecruitmentDialog;
