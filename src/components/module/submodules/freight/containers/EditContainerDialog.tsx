
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Container } from "@/types/freight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ContainerStatusSelect from "./ContainerStatusSelect";
import { useUpdateContainer } from "@/hooks/modules/useContainersFirestore";
import { toast } from "sonner";

// Pour simplifier, on propose que tous les champs éditables soient inclus. Adapter selon vos besoins.
interface EditContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container | null;
}

const EditContainerDialog: React.FC<EditContainerDialogProps> = ({
  open,
  onOpenChange,
  container,
}) => {
  const [form, setForm] = useState<Partial<Container>>({});
  const { mutate: updateContainer, isLoading } = useUpdateContainer();

  useEffect(() => {
    if (open && container) {
      setForm(container);
    }
  }, [open, container]);

  if (!container) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (val: string) => {
    setForm((prev) => ({ ...prev, status: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!container.id) {
      toast.error("Erreur : identifiant conteneur manquant.");
      return;
    }
    updateContainer(
      {
        id: container.id,
        data: { ...form },
      },
      {
        onSuccess: () => {
          toast.success("Conteneur mis à jour !");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Modifier le conteneur</DialogTitle>
          <DialogDescription>
            Modification du conteneur N° {container.number}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Numéro</label>
              <Input
                name="number"
                value={form.number || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Type</label>
              <Input
                name="type"
                value={form.type || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Taille</label>
              <Input
                name="size"
                value={form.size || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Statut</label>
              <ContainerStatusSelect
                value={form.status || ""}
                onChange={handleStatusChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Coût (€)</label>
              <Input
                name="cost"
                type="number"
                value={form.cost ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Transporteur</label>
              <Input
                name="carrierName"
                value={form.carrierName || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Origine</label>
              <Input
                name="origin"
                value={form.origin || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Destination</label>
              <Input
                name="destination"
                value={form.destination || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Client</label>
              <Input
                name="client"
                value={form.client || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Départ</label>
              <Input
                name="departureDate"
                type="date"
                value={form.departureDate || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Arrivée</label>
              <Input
                name="arrivalDate"
                type="date"
                value={form.arrivalDate || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContainerDialog;
