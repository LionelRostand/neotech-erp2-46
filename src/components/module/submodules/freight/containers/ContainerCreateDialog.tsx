
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Container } from "@/types/freight";

interface ContainerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (container: Container) => void;
}

const ContainerCreateDialog: React.FC<ContainerCreateDialogProps> = ({
  open,
  onOpenChange,
  onCreated,
}) => {
  const [container, setContainer] = useState({
    number: "",
    type: "standard",
    size: "20ft",
    status: "en attente",
    carrierName: "",
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    location: "",
    client: "",
    departure: "",
    arrival: "",
    articles: [],
    costs: []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!container.number || !container.type || !container.size) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.FREIGHT.CONTAINERS), {
        ...container,
        createdAt: new Date().toISOString(),
      });

      const newContainer = { ...container, id: docRef.id } as Container;
      toast.success("Conteneur ajouté avec succès");
      onCreated?.(newContainer);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du conteneur:", error);
      toast.error("Erreur lors de l'ajout du conteneur");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContainer({
      number: "",
      type: "standard",
      size: "20ft",
      status: "en attente",
      carrierName: "",
      origin: "",
      destination: "",
      departureDate: "",
      arrivalDate: "",
      location: "",
      client: "",
      departure: "",
      arrival: "",
      articles: [],
      costs: []
    });
  };

  React.useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau conteneur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Numéro <span className="text-red-500">*</span>
              </label>
              <Input
                name="number"
                value={container.number}
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
                value={container.type}
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
                value={container.size}
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
                value={container.status}
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
                value={container.carrierName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Input
                name="client"
                value={container.client}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Origine</label>
              <Input
                name="origin"
                value={container.origin}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input
                name="destination"
                value={container.destination}
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
                value={container.departureDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date d'arrivée prévue</label>
              <Input
                type="date"
                name="arrivalDate"
                value={container.arrivalDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Localisation actuelle</label>
            <Input
              name="location"
              value={container.location}
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
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerCreateDialog;
