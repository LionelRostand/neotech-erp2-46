
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
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
}

const ContainerEditDialog: React.FC<ContainerEditDialogProps> = ({ open, onClose, container }) => {
  const [form, setForm] = useState<Container | null>(container);
  const updateContainer = useUpdateContainer();

  React.useEffect(() => { setForm(container); }, [container]);

  if (!form) return null;

  const handleChange = (field: keyof Container, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    if (!form) return;
    await updateContainer.mutateAsync({ id: form.id, data: form });
    toast.success("Conteneur modifié avec succès !");
    onClose();
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
