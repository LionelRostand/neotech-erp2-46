
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoutes } from "../hooks/useRoutes"; // Correction du chemin d'import

const CONTAINER_TYPES = [
  { type: "Standard", size: "20ft" },
  { type: "Refrigerated", size: "40ft" },
  { type: "Flat Rack", size: "40ft" },
  { type: "Open Top", size: "20ft" },
];
const STATUS_OPTIONS = [
  "In Transit",
  "At Port",
  "Delivered",
  "Pending",
  "Delayed"
];

interface NewContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewContainerDialog: React.FC<NewContainerDialogProps> = ({ open, onOpenChange }) => {
  const { routes, isLoading } = useRoutes();

  const [form, setForm] = useState({
    number: "",
    type: "",
    size: "",
    status: "",
    carrierName: "",
    routeId: "",
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: ""
  });

  // Met à jour la taille automatiquement quand le type change
  useEffect(() => {
    const typeData = CONTAINER_TYPES.find((t) => t.type === form.type);
    setForm((prev) => ({
      ...prev,
      size: typeData ? typeData.size : ""
    }));
  }, [form.type]);

  // Peut auto-remplir Origine/Destination selon la route sélectionnée
  useEffect(() => {
    if (!form.routeId) return;
    const selectedRoute = routes.find((r) => r.id === form.routeId);
    setForm((prev) => ({
      ...prev,
      origin: selectedRoute ? selectedRoute.origin : "",
      destination: selectedRoute ? selectedRoute.destination : ""
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.routeId, routes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleTypeChange = (type: string) => {
    setForm((prev) => ({
      ...prev,
      type
    }));
  };
  const handleStatusChange = (status: string) => {
    setForm((prev) => ({
      ...prev,
      status
    }));
  };
  const handleRouteChange = (routeId: string) => {
    setForm((prev) => ({
      ...prev,
      routeId
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajouter ici la logique pour la création du conteneur si nécessaire
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Ajouter un conteneur</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Numéro */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="number">Numéro du conteneur</label>
            <Input
              id="number"
              name="number"
              value={form.number}
              onChange={handleChange}
              placeholder="CONTAINER123"
              required
            />
          </div>
          {/* Type & taille */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select value={form.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de conteneur" />
              </SelectTrigger>
              <SelectContent>
                {CONTAINER_TYPES.map(({ type }) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taille</label>
            <Input
              name="size"
              value={form.size}
              readOnly
              placeholder="Taille automatiquement renseignée"
            />
          </div>
          {/* Statut */}
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <Select value={form.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Transporteur */}
          <div>
            <label className="block text-sm font-medium mb-1">Transporteur</label>
            <Input
              name="carrierName"
              value={form.carrierName}
              onChange={handleChange}
              placeholder="Nom du transporteur"
            />
          </div>
          {/* Route */}
          <div>
            <label className="block text-sm font-medium mb-1">Route</label>
            <Select value={form.routeId} onValueChange={handleRouteChange} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une route" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[110]">
                {isLoading ? <SelectItem value="" disabled>Chargement...</SelectItem> :
                  routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          {/* Origine (label ajouté) */}
          <div>
            <label className="block text-sm font-medium mb-1">Origine</label>
            <Input
              name="origin"
              value={form.origin}
              readOnly={!!form.routeId}
              placeholder="Origine"
              onChange={handleChange}
            />
          </div>
          {/* Destination (label ajouté) */}
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <Input
              name="destination"
              value={form.destination}
              readOnly={!!form.routeId}
              placeholder="Destination"
              onChange={handleChange}
            />
          </div>
          {/* Date de départ */}
          <div>
            <label className="block text-sm font-medium mb-1">Date de départ</label>
            <Input
              type="date"
              name="departureDate"
              value={form.departureDate}
              onChange={handleChange}
            />
          </div>
          {/* Date d'arrivée */}
          <div>
            <label className="block text-sm font-medium mb-1">Date d'arrivée</label>
            <Input
              type="date"
              name="arrivalDate"
              value={form.arrivalDate}
              onChange={handleChange}
            />
          </div>
          {/* Validation */}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialog;
