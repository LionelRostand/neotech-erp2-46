
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUpdateContainer } from "@/hooks/modules/useContainersFirestore";
import type { Container } from "@/types/freight";

interface ContainerEditDialogProps {
  open: boolean;
  onClose: () => void;
  container: Container | null;
  onSave?: (updatedContainer: Container) => void;
}

const ContainerEditDialog: React.FC<ContainerEditDialogProps> = ({ 
  open, 
  onClose, 
  container,
  onSave
}) => {
  const [form, setForm] = useState<Container | null>(container);
  const updateContainer = useUpdateContainer();

  useEffect(() => { 
    setForm(container); 
  }, [container]);

  if (!form) return null;

  const handleChange = (field: keyof Container, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    if (!form || !form.id) return;
    
    try {
      await updateContainer.mutateAsync({ id: form.id, data: form });
      toast.success("Conteneur modifié avec succès !");
      if (onSave) {
        onSave(form);
      }
      onClose();
    } catch (error) {
      console.error("Erreur lors de la modification du conteneur:", error);
      toast.error("Erreur lors de la modification du conteneur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le conteneur</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input placeholder="Numéro" value={form.number} onChange={e => handleChange("number", e.target.value)} />
          <Input placeholder="Type" value={form.type} onChange={e => handleChange("type", e.target.value)} />
          <Input placeholder="Taille" value={form.size} onChange={e => handleChange("size", e.target.value)} />
          <Input placeholder="Client" value={form.client} onChange={e => handleChange("client", e.target.value)} />
          <Input placeholder="Statut" value={form.status} onChange={e => handleChange("status", e.target.value)} />
          <Input placeholder="Origine" value={form.origin} onChange={e => handleChange("origin", e.target.value)} />
          <Input placeholder="Destination" value={form.destination} onChange={e => handleChange("destination", e.target.value)} />
          <Input placeholder="Date départ" value={form.departureDate || ""} onChange={e => handleChange("departureDate", e.target.value)} />
          <Input placeholder="Date arrivée" value={form.arrivalDate || ""} onChange={e => handleChange("arrivalDate", e.target.value)} />
          <Input placeholder="Localisation" value={form.location} onChange={e => handleChange("location", e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={updateContainer.isPending}>
            {updateContainer.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
