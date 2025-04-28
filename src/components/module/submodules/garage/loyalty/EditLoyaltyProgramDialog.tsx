
import React from 'react';
import { useForm } from 'react-hook-form';
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
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { LoyaltyProgram } from '../types/loyalty-types';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface EditLoyaltyProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: LoyaltyProgram | null;
  onSuccess: () => void;
}

const EditLoyaltyProgramDialog: React.FC<EditLoyaltyProgramDialogProps> = ({
  open,
  onOpenChange,
  program,
  onSuccess
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  
  // Reset form when the dialog opens or the program changes
  React.useEffect(() => {
    if (program && open) {
      reset({
        name: program.name,
        description: program.description,
        benefitsDescription: program.benefitsDescription,
        pointsMultiplier: program.pointsMultiplier,
        minimumSpend: program.minimumSpend,
        status: program.status,
      });
      
      // Set dates
      if (program.startDate) {
        setStartDate(new Date(program.startDate));
      }
      if (program.endDate) {
        setEndDate(new Date(program.endDate));
      }
    }
  }, [program, open, reset]);
  
  if (!program) return null;
  
  const onSubmit = async (data: any) => {
    try {
      // Add dates to the data
      const formData = {
        ...data,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        updatedAt: new Date().toISOString(),
      };
      
      // Convert numeric fields
      formData.pointsMultiplier = parseFloat(formData.pointsMultiplier);
      formData.minimumSpend = parseFloat(formData.minimumSpend);
      
      // Update the program in Firebase
      const programRef = doc(db, COLLECTIONS.GARAGE.LOYALTY, program.id);
      await updateDoc(programRef, formData);
      
      // Show success toast
      toast.success("Programme de fidélité mis à jour avec succès");
      
      // Close the dialog and refresh the list
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du programme:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifier le programme de fidélité</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du programme</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="benefitsDescription">Avantages</Label>
            <Textarea
              id="benefitsDescription"
              {...register("benefitsDescription")}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pointsMultiplier">Multiplicateur de points</Label>
              <Input
                id="pointsMultiplier"
                type="number"
                step="0.1"
                {...register("pointsMultiplier", { required: true, min: 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minimumSpend">Dépense minimum (€)</Label>
              <Input
                id="minimumSpend"
                type="number"
                step="0.01"
                {...register("minimumSpend", { required: true, min: 0 })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date de début</Label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Sélectionner une date"
              />
            </div>
            <div className="grid gap-2">
              <Label>Date de fin</Label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="Sélectionner une date"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={watch("status")} 
              onValueChange={(value) => setValue("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLoyaltyProgramDialog;
