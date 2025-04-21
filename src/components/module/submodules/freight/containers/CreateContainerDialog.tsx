
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAddContainer } from "@/hooks/modules/useContainersFirestore";
import { toast } from "sonner";

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateContainerDialog({ open, onOpenChange }: CreateContainerDialogProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const addContainer = useAddContainer();

  const onSubmit = async (data: any) => {
    try {
      await addContainer.mutateAsync({
        number: data.number || "",
        client: data.client || "",
        carrier: data.carrier || "",
        origin: data.origin || "",
        destination: data.destination || "",
        cost: data.cost ? parseFloat(data.cost) : null,
        status: data.status || "-",
      });
      toast.success("Conteneur ajouté !");
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error("Erreur lors de l’ajout.");
    }
  };

  const onCloseDialog = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Ajouter un conteneur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Référence" {...register("number", { required: true })} placeholder="CTR-20250421-XXXXX" />
          <Input label="Client" {...register("client")} placeholder="Nom du client" />
          <Input label="Transporteur" {...register("carrier")} placeholder="Nom du transporteur" />
          <Input label="Origine" {...register("origin")} placeholder="Ville/Pays d’origine" />
          <Input label="Destination" {...register("destination")} placeholder="Ville/Pays de destination" />
          <Input label="Coût" type="number" step="0.01" {...register("cost")} placeholder="Montant" />
          <Input label="Statut" {...register("status")} placeholder="Statut (chargement, en transit…)" />
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onCloseDialog}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
