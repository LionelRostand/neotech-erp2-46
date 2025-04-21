
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

interface RouteType {
  id: string;
  name: string;
  origin: string;
  destination: string;
}

interface ClientType {
  id: string;
  name: string;
}

interface ContainerFormData {
  number: string;
  type: string;
  size: string;
  status: string;
  carrierName: string;
  routeId?: string;
  origin: string;
  destination: string;
  location: string;
  client: string;
  departureDate?: string;
  arrivalDate?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  container?: Partial<ContainerFormData> | null;
  onSave: (data: ContainerFormData) => void;
  defaultNumber: string;
  routes?: RouteType[];
  clients?: ClientType[];
}

const typeOptions = ["Dry", "Reefer", "Open Top", "Flat Rack"];
const sizeOptions = ["20'", "40'", "40' HC"];
const statusOptions = ["Disponible", "Chargé", "En transit", "Livré", "Maintenance"];

const CreateEditContainerDialog: React.FC<Props> = ({
  open,
  onClose,
  container,
  onSave,
  defaultNumber,
  routes = [],
  clients = [],
}) => {
  // Etat éditable pour chaque champ
  const [form, setForm] = useState<ContainerFormData>({
    number: defaultNumber,
    type: "",
    size: "",
    status: "",
    carrierName: "",
    routeId: "",
    origin: "",
    destination: "",
    location: "",
    client: "",
    departureDate: "",
    arrivalDate: "",
    ...container, // Pour l'édition : préremplir les champs
  });

  // Si routeId change, options de route changent, MAJ origine et destination
  useEffect(() => {
    if (form.routeId && routes?.length) {
      const route = routes.find((r) => r.id === form.routeId);
      if (route) {
        setForm((prev) => ({
          ...prev,
          origin: route.origin,
          destination: route.destination,
        }));
      }
    }
    // Si route effacée : ne pas conserver ancienne origine/destination
    if (!form.routeId) {
      setForm((prev) => ({
        ...prev,
        origin: "",
        destination: "",
      }));
    }
  }, [form.routeId, routes]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Pour le select de route
  const handleRouteChange = (routeId: string) => {
    setForm((prev) => ({
      ...prev,
      routeId,
    }));
  };

  // Pour le select client
  const handleClientChange = (client: string) => {
    setForm((prev) => ({
      ...prev,
      client,
    }));
  };

  // Pour le select type/size/status
  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation & submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  // Reset le formulaire à l'ouverture pour éviter les erreurs
  useEffect(() => {
    if (open && !container) {
      setForm({
        number: defaultNumber,
        type: "",
        size: "",
        status: "",
        carrierName: "",
        routeId: "",
        origin: "",
        destination: "",
        location: "",
        client: "",
        departureDate: "",
        arrivalDate: "",
      });
    }
    if (open && container) {
      setForm({ ...form, ...container });
    }
    // eslint-disable-next-line
  }, [open, defaultNumber, container]);

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{container ? "Modifier le conteneur" : "Nouveau Conteneur"}</DialogTitle>
          <DialogDescription>
            {container
              ? "Modifier les informations du conteneur."
              : "Créer un nouveau conteneur de fret."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* ligne 1 : Référence - Client */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Référence</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                name="number"
                value={form.number}
                onChange={handleInput}
                required
                disabled={!!container}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Client</label>
              <Select
                value={form.client}
                onValueChange={handleClientChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(cl =>
                    <SelectItem key={cl.id} value={cl.name}>{cl.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* ligne 2 : Route - Type - Taille */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Route</label>
              <Select
                value={form.routeId}
                onValueChange={handleRouteChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(route =>
                    <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
              <Select
                value={form.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(t =>
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Taille</label>
              <Select
                value={form.size}
                onValueChange={(value) => handleSelectChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Taille" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map(sz =>
                    <SelectItem key={sz} value={sz}>{sz}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* ligne 3 : Origine et Destination côte à côte */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Origine</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                name="origin"
                value={form.origin}
                onChange={handleInput}
                required
                readOnly={!!form.routeId}
                placeholder="Origine"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Destination</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                name="destination"
                value={form.destination}
                onChange={handleInput}
                required
                readOnly={!!form.routeId}
                placeholder="Destination"
              />
            </div>
          </div>
          {/* Statut et Transporteur (ligne 4) */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Statut</label>
              <Select
                value={form.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s =>
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Transporteur</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                name="carrierName"
                value={form.carrierName}
                onChange={handleInput}
                required
                placeholder="Transporteur"
              />
            </div>
          </div>
          {/* Emplacement / lieu (ligne 5) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Emplacement</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              name="location"
              value={form.location}
              onChange={handleInput}
              required
              placeholder="Emplacement actuel"
            />
          </div>
          {/* Dates (ligne 6 : départ/arrivée) */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Départ</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 text-sm"
                name="departureDate"
                value={form.departureDate || ""}
                onChange={handleInput}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Arrivée</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 text-sm"
                name="arrivalDate"
                value={form.arrivalDate || ""}
                onChange={handleInput}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {container ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateEditContainerDialog;
