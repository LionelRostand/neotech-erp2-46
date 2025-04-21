
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Container } from "@/types/freight";

interface ContainerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
  onUpdated?: (container: Container) => void;
}

const ContainerEditDialog: React.FC<ContainerEditDialogProps> = ({
  open,
  onOpenChange,
  container,
  onUpdated,
}) => {
  const [editedContainer, setEditedContainer] = useState<Container>({...container});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && container) {
      setEditedContainer({...container});
    }
  }, [open, container]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedContainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedContainer.number || !editedContainer.type || !editedContainer.size) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const containerRef = doc(db, COLLECTIONS.FREIGHT.CONTAINERS, container.id);
      
      // Suppression de l'id avant mise à jour pour éviter les doublons
      const { id, ...dataToUpdate } = editedContainer;
      
      await updateDoc(containerRef, {
        ...dataToUpdate,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Conteneur mis à jour avec succès");
      onUpdated?.(editedContainer);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du conteneur:", error);
      toast.error("Erreur lors de la mise à jour du conteneur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le conteneur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Numéro <span className="text-red-500">*</span>
              </label>
              <Input
                name="number"
                value={editedContainer.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={editedContainer.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="standard">Standard</option>
                <option value="réfrigéré">Réfrigéré</option>
                <option value="sec">Sec</option>
                <option value="open-top">Open-top</option>
                <option value="flat-rack">Flat-rack</option>
                <option value="tank">Citerne</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Taille <span className="text-red-500">*</span>
              </label>
              <select
                name="size"
                value={editedContainer.size}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="20ft">20 pieds</option>
                <option value="40ft">40 pieds</option>
                <option value="45ft">45 pieds</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={editedContainer.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="en attente">En attente</option>
                <option value="en transit">En transit</option>
                <option value="livré">Livré</option>
                <option value="retardé">Retardé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transporteur</label>
              <Input
                name="carrierName"
                value={editedContainer.carrierName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Input
                name="client"
                value={editedContainer.client}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Origine</label>
              <Input
                name="origin"
                value={editedContainer.origin}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input
                name="destination"
                value={editedContainer.destination}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de départ</label>
              <Input
                type="date"
                name="departureDate"
                value={editedContainer.departureDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date d'arrivée prévue</label>
              <Input
                type="date"
                name="arrivalDate"
                value={editedContainer.arrivalDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Localisation actuelle</label>
            <Input
              name="location"
              value={editedContainer.location}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
