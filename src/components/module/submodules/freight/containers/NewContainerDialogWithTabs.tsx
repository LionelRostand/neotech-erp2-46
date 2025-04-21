
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContainerTabs from "./ContainerTabs";
import { useCarriers } from "../hooks/useCarriers";
import { useFreightClients } from "../hooks/useFreightClients";
import { useRoutes } from "../hooks/useRoutes";
import ContainerArticlesTab from "./ContainerArticlesTab";
import ContainerCostTab from "./ContainerCostTab";

const initialForm = {
  number: "",
  type: "",
  size: "",
  status: "",
  carrierName: "",
  client: "",
  origin: "",
  destination: "",
  routeId: "",
  departureDate: "",
  arrivalDate: "",
  articles: [],
  cost: undefined,
};

const containerTypeSizeOptions = [
  { type: "20ft", size: "6m" },
  { type: "40ft", size: "12m" },
  { type: "Réfrigéré", size: "12m" },
  { type: "Standard", size: "12m" },
  { type: "Open Top", size: "12m" },
  { type: "Flat Rack", size: "12m" },
  { type: "Tank", size: "12m" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewContainerDialogWithTabs: React.FC<Props> = ({ open, onOpenChange }) => {
  const [tab, setTab] = useState<"info" | "articles" | "pricing">("info");
  const [form, setForm] = useState(initialForm);
  const { carriers, isLoading: loadingCarriers } = useCarriers();
  const { clients, isLoading: loadingClients } = useFreightClients();
  const { routes, isLoading: loadingRoutes } = useRoutes();

  // Remplissage de taille selon type
  useEffect(() => {
    const match = containerTypeSizeOptions.find(opt => opt.type === form.type);
    if (match) {
      setForm((f) => ({ ...f, size: match.size }));
    } else {
      setForm((f) => ({ ...f, size: "" }));
    }
    // eslint-disable-next-line
  }, [form.type]);

  // Sélection d'une route => remplissage origine/destination
  useEffect(() => {
    if (form.routeId && routes.length) {
      const selectedRoute = routes.find(r => r.id === form.routeId);
      if (selectedRoute) {
        setForm((f) => ({
          ...f,
          origin: selectedRoute.origin,
          destination: selectedRoute.destination,
        }));
      }
    }
    // eslint-disable-next-line
  }, [form.routeId, routes]);

  // Handlers génériques d’input & select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ARTICLES : mise à jour dans le parent
  const handleSetArticles = (articles: any[]) => {
    setForm((f) => ({ ...f, articles }));
  };

  // COST : mise à jour depuis tab tarification
  const handleSetCost = (cost: number) => {
    setForm((f) => ({ ...f, cost }));
  };

  // Pour l’instant, l’envoi ne fait qu’un reset :
  const handleCreate = () => {
    // TODO: Enregistrer le conteneur dans la base de données ici.
    setForm(initialForm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <ContainerTabs tab={tab} setTab={setTab} />
        <div>
          {tab === "info" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Référence */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="number">
                  Référence
                </label>
                <input
                  id="number"
                  name="number"
                  className="w-full border rounded px-3 py-2"
                  value={form.number}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              {/* Type */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="type">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="w-full border rounded px-3 py-2 bg-white"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  {containerTypeSizeOptions.map(opt =>
                    <option value={opt.type} key={opt.type}>{opt.type}</option>
                  )}
                </select>
              </div>
              {/* Taille */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="size">
                  Taille
                </label>
                <input
                  id="size"
                  name="size"
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  value={form.size}
                  disabled
                  placeholder="Sélectionner un type"
                  autoComplete="off"
                />
              </div>
              {/* Statut */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="status">
                  Statut
                </label>
                <input
                  id="status"
                  name="status"
                  className="w-full border rounded px-3 py-2"
                  value={form.status}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              {/* Transporteur */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="carrierName">
                  Transporteur
                </label>
                <select
                  id="carrierName"
                  name="carrierName"
                  className="w-full border rounded px-3 py-2 bg-white"
                  value={form.carrierName}
                  onChange={handleChange}
                  disabled={loadingCarriers}
                >
                  <option value="">Sélectionner</option>
                  {carriers.map(c =>
                    <option value={c.name} key={c.id}>{c.name}</option>
                  )}
                </select>
              </div>
              {/* Client */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="client">
                  Client
                </label>
                <select
                  id="client"
                  name="client"
                  className="w-full border rounded px-3 py-2 bg-white"
                  value={form.client}
                  onChange={handleChange}
                  disabled={loadingClients}
                >
                  <option value="">Sélectionner</option>
                  {clients.map(cl =>
                    <option value={cl.name} key={cl.id}>{cl.name}</option>
                  )}
                </select>
              </div>
              {/* Route */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="routeId">
                  Route
                </label>
                <select
                  id="routeId"
                  name="routeId"
                  className="w-full border rounded px-3 py-2 bg-white"
                  value={form.routeId}
                  onChange={handleChange}
                  disabled={loadingRoutes}
                >
                  <option value="">Sélectionner</option>
                  {routes.map(rt =>
                    <option value={rt.id} key={rt.id}>{rt.name}</option>
                  )}
                </select>
              </div>
              {/* Origine */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="origin">
                  Origine
                </label>
                <input
                  id="origin"
                  name="origin"
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  value={form.origin}
                  disabled
                  placeholder="Rempli via la route"
                  autoComplete="off"
                />
              </div>
              {/* Destination */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="destination">
                  Destination
                </label>
                <input
                  id="destination"
                  name="destination"
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  value={form.destination}
                  disabled
                  placeholder="Rempli via la route"
                  autoComplete="off"
                />
              </div>
              {/* Date départ */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="departureDate">
                  Date départ
                </label>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  className="w-full border rounded px-3 py-2"
                  value={form.departureDate}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              {/* Date arrivée */}
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="arrivalDate">
                  Date arrivée
                </label>
                <input
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  className="w-full border rounded px-3 py-2"
                  value={form.arrivalDate}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </div>
          )}
          {tab === "articles" && (
            <ContainerArticlesTab
              articles={form.articles}
              setArticles={handleSetArticles}
            />
          )}
          {tab === "pricing" && (
            <ContainerCostTab
              containerType={form.type}
              articles={form.articles || []}
              cost={form.cost}
              setCost={handleSetCost}
            />
          )}
        </div>
        <DialogFooter className="pt-5">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleCreate} type="button">
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialogWithTabs;

