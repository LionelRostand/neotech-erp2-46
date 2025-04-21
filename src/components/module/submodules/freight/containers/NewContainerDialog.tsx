
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useRoutes } from "../hooks/useRoutes";
import ContainerTabs from "./ContainerTabs";

interface NewContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

// Données statiques démo pour Transporteur (remplacer par données dynamiques si nécessaire)
const CARRIERS = [
  { id: "CARRIER-1", name: "DJOSSA LIONEL" },
  { id: "CARRIER-2", name: "TEST-TRANSPORT" }
];

const NewContainerDialog: React.FC<NewContainerDialogProps> = ({ open, onOpenChange }) => {
  const { routes } = useRoutes();

  const [tab, setTab] = useState("info");
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
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>();

  // Gérer la taille auto lors du choix du type
  useEffect(() => {
    const typeData = CONTAINER_TYPES.find(t => t.type === form.type);
    setForm(prev => ({
      ...prev,
      size: typeData ? typeData.size : ""
    }));
  }, [form.type]);

  // Gérer origine/destination auto lors du choix de la route
  useEffect(() => {
    const selectedRoute = routes.find(r => r.id === form.routeId);
    setForm(prev => ({
      ...prev,
      origin: selectedRoute ? selectedRoute.origin : "",
      destination: selectedRoute ? selectedRoute.destination : ""
    }));
  }, [form.routeId, routes]);

  // Gérer les dates avec DatePicker
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      departureDate: departureDate ? departureDate.toISOString().split("T")[0] : "",
    }));
  }, [departureDate]);

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      arrivalDate: arrivalDate ? arrivalDate.toISOString().split("T")[0] : "",
    }));
  }, [arrivalDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: string) => setForm(prev => ({ ...prev, type }));
  const handleStatusChange = (status: string) => setForm(prev => ({ ...prev, status }));
  const handleCarrierChange = (carrierName: string) => setForm(prev => ({ ...prev, carrierName }));
  const handleRouteChange = (routeId: string) => setForm(prev => ({ ...prev, routeId }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de création à implémenter plus tard
    onOpenChange(false);
  };

  // Rendu du contenu de chaque onglet
  function renderTabContent() {
    if (tab === "info") {
      return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Colonne gauche */}
          <div className="space-y-4">
            <div>
              <Input
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="Référence"
                className="text-sm"
                required
              />
            </div>
            <div>
              <Input
                name="size"
                value={form.size}
                readOnly
                placeholder="Taille"
                className="text-sm"
              />
            </div>
            <div>
              <Select value={form.carrierName} onValueChange={handleCarrierChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Transporteur" />
                </SelectTrigger>
                <SelectContent>
                  {CARRIERS.map(carrier =>
                    <SelectItem key={carrier.id} value={carrier.name}>{carrier.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={form.routeId} onValueChange={handleRouteChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(route =>
                    <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                name="destination"
                value={form.destination}
                readOnly={!!form.routeId}
                placeholder="Destination"
                className="text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <DatePicker
                date={arrivalDate}
                onSelect={setArrivalDate}
                placeholder="jj/mm/aaaa"
                className="text-sm"
              />
            </div>
          </div>
          {/* Colonne droite */}
          <div className="space-y-4">
            <div>
              <Select value={form.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTAINER_TYPES.map(({ type }) =>
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={form.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status =>
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                name="origin"
                value={form.origin}
                readOnly={!!form.routeId}
                placeholder="Origine"
                className="text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <DatePicker
                date={departureDate}
                onSelect={setDepartureDate}
                placeholder="jj/mm/aaaa"
                className="text-sm"
              />
            </div>
          </div>
          {/* Boutons en bas */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-8">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer
            </Button>
          </div>
        </form>
      );
    }
    // Pour Articles et Tarification, on affiche un placeholder
    return (
      <div className="p-6 text-muted-foreground text-center">
        Fonctionnalité à venir.
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <ContainerTabs tab={tab} setTab={setTab} />
        {renderTabContent()}
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialog;
