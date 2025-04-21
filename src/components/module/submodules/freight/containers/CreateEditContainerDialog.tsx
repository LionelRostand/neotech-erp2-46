
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { addDocument, setDocument } from "@/hooks/firestore/create-operations";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

/**
 * Génère un numéro de conteneur unique du style "CONT-20240421-XXXX"
 */
function generateContainerNumber() {
  const now = new Date();
  const datePart = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CONT-${datePart}-${random}`;
}

const initialForm = (container?: any) => ({
  number: container?.number || "",
  type: container?.type || "",
  size: container?.size || "",
  status: container?.status || "",
  carrierName: container?.carrierName || "",
  client: container?.client || "",
  origin: container?.origin || "",
  destination: container?.destination || "",
  departureDate: container?.departureDate || "",
  arrivalDate: container?.arrivalDate || "",
  location: container?.location || "",
});

const CreateEditContainerDialog = ({
  open,
  onClose,
  container,
  carrierOptions = [],
  clientOptions = [],
  routeOptions = []
}: {
  open: boolean;
  onClose: () => void;
  container?: any;
  carrierOptions: { label: string; value: string }[];
  clientOptions: { label: string; value: string }[];
  routeOptions: { label: string; value: string }[];
}) => {
  const isEdit = !!container;
  const [form, setForm] = useState(initialForm(container));
  const [loading, setLoading] = useState(false);

  // Générer le numéro de conteneur uniquement lors de la première ouverture EN CRÉATION
  useEffect(() => {
    if (open && !isEdit) {
      setForm((f) => ({
        ...initialForm(),
        number: generateContainerNumber(),
      }));
    }
    if (open && isEdit) {
      setForm(initialForm(container));
    }
    // eslint-disable-next-line
  }, [open, isEdit, container]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && container?.id) {
        await setDocument(COLLECTIONS.FREIGHT.CONTAINERS, container.id, { ...form });
        toast.success("Conteneur modifié !");
      } else {
        await addDocument(COLLECTIONS.FREIGHT.CONTAINERS, { ...form });
        toast.success("Conteneur créé !");
      }
      onClose();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le conteneur" : "Créer un conteneur"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Numéro du conteneur</label>
            <Input 
              name="number" 
              value={form.number} 
              readOnly={!isEdit} 
              required 
              className="bg-gray-100 font-mono"
            />
            {!isEdit && <div className="text-xs text-muted-foreground">Numéro généré automatiquement</div>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <Input name="type" value={form.type} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Taille</label>
            <Input name="size" value={form.size} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Statut</label>
            <Input name="status" value={form.status} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Transporteur</label>
            <Input name="carrierName" value={form.carrierName} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Client</label>
            <Input name="client" value={form.client} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Origine</label>
            <Input name="origin" value={form.origin} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Destination</label>
            <Input name="destination" value={form.destination} onChange={handleChange} required />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Date départ</label>
              <Input type="date" name="departureDate" value={form.departureDate} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Date arrivée</label>
              <Input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Localisation</label>
            <Input name="location" value={form.location} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;
