
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useFreightClients } from "../hooks/useFreightClients";
import { useCarriers } from "../hooks/useCarriers";
import { useRoutes } from "../hooks/useRoutes";

// Liste des types de conteneurs
const CONTAINER_TYPES = [
  { value: "standard", label: "Standard", size: "20ft" },
  { value: "high-cube", label: "High Cube", size: "40ft" },
  { value: "refrigerated", label: "Réfrigéré", size: "40ft" },
  { value: "open-top", label: "Open Top", size: "20ft" },
  { value: "flat-rack", label: "Flat Rack", size: "20ft" },
];

// Liste des statuts en français
const STATUS_OPTIONS = [
  { value: "vide", label: "Vide" },
  { value: "chargement", label: "En chargement" },
  { value: "plein", label: "Plein" },
  { value: "en_transit", label: "En transit" },
  { value: "livre", label: "Livré" }
];

const initialFormState = {
  reference: "",
  type: "",
  size: "",
  status: "",
  carrier: "",
  client: "",
  origin: "",
  destination: "",
  departureDate: "",
  arrivalDate: "",
  route: ""
};

const NewContainerDialog = ({ open, onOpenChange }) => {
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState(initialFormState);
  const [articles, setArticles] = useState([]);
  const [cost, setCost] = useState(0);

  // Fetch clients, carriers, routes
  const { clients = [], isLoading: isClientsLoading } = useFreightClients();
  const { carriers = [], isLoading: isCarriersLoading } = useCarriers();
  const { routes = [], isLoading: isRoutesLoading } = useRoutes();

  // Sélection d'un type = update taille automatiquement
  useEffect(() => {
    if (form.type) {
      const selected = CONTAINER_TYPES.find((t) => t.value === form.type);
      setForm((f) => ({
        ...f,
        size: selected ? selected.size : ""
      }));
    }
    // eslint-disable-next-line
  }, [form.type]);

  // Sélection d'une route = update origine et destination
  useEffect(() => {
    if (form.route && routes.length) {
      const selected = routes.find((r) => r.id === form.route);
      if (selected) {
        setForm((f) => ({
          ...f,
          origin: selected.origin,
          destination: selected.destination
        }));
      }
    }
    // eslint-disable-next-line
  }, [form.route, routes]);

  const handleFieldChange = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: value
    }));
  };

  const handleAddArticle = () => {
    setArticles([
      ...articles,
      {
        name: '',
        quantity: 1
      }
    ]);
  };

  const handleArticleChange = (idx, key, value) => {
    setArticles(articles.map((a, i) => i === idx ? {
      ...a,
      [key]: key === 'quantity' || key === 'weight' ? Number(value) : value
    } : a));
  };

  const handleRemoveArticle = (idx) => {
    setArticles(articles.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    // Démo only: pas d'appel réel pour la création
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="cost">Tarification</TabsTrigger>
          </TabsList>

          {/* TAB INFORMATIONS */}
          <TabsContent value="info">
            <form 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              autoComplete="off"
              onSubmit={e => e.preventDefault()}
            >
              {/* Référence */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Référence</label>
                <Input
                  value={form.reference}
                  onChange={e => handleFieldChange("reference", e.target.value)}
                  placeholder="Référence"
                  name="reference"
                  autoFocus
                />
              </div>
              {/* Type */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                <Select
                  value={form.type}
                  onValueChange={v => handleFieldChange("type", v)}
                  name="type"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="z-[99] bg-white">
                    {CONTAINER_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Taille (dépend du type) */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Taille</label>
                <Input
                  value={form.size}
                  placeholder="Taille"
                  name="size"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              {/* Statut */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Statut</label>
                <Select
                  value={form.status}
                  onValueChange={v => handleFieldChange("status", v)}
                  name="status"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="z-[99] bg-white">
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Transporteur */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Transporteur</label>
                <Select
                  value={form.carrier}
                  onValueChange={v => handleFieldChange("carrier", v)}
                  name="carrier"
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isCarriersLoading ? "Chargement..." : "Transporteur"} />
                  </SelectTrigger>
                  <SelectContent className="z-[99] bg-white">
                    {carriers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Client */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Client</label>
                <Select
                  value={form.client}
                  onValueChange={v => handleFieldChange("client", v)}
                  name="client"
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isClientsLoading ? "Chargement..." : "Client"} />
                  </SelectTrigger>
                  <SelectContent className="z-[99] bg-white">
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Route */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Route</label>
                <Select
                  value={form.route}
                  onValueChange={v => handleFieldChange("route", v)}
                  name="route"
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRoutesLoading ? "Chargement..." : "Route"} />
                  </SelectTrigger>
                  <SelectContent className="z-[99] bg-white">
                    {routes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Origine */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Origine</label>
                <Input
                  value={form.origin}
                  placeholder="Origine"
                  name="origin"
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              {/* Destination */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Destination</label>
                <Input
                  value={form.destination}
                  placeholder="Destination"
                  name="destination"
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              {/* Date départ */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date départ</label>
                <Input
                  value={form.departureDate}
                  onChange={e => handleFieldChange("departureDate", e.target.value)}
                  placeholder="jj/mm/aaaa"
                  type="date"
                  name="departureDate"
                />
              </div>
              {/* Date arrivée */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date arrivée</label>
                <Input
                  value={form.arrivalDate}
                  onChange={e => handleFieldChange("arrivalDate", e.target.value)}
                  placeholder="jj/mm/aaaa"
                  type="date"
                  name="arrivalDate"
                />
              </div>
              {/* Boutons footer */}
              <div className="col-span-2 flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={handleCancel}>Annuler</Button>
                <Button type="submit" onClick={handleCreate}>Créer</Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB ARTICLES */}
          <TabsContent value="articles">
            <div className="space-y-2">
              {articles.map((a, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Nom article"
                    value={a.name}
                    onChange={e => handleArticleChange(idx, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Quantité"
                    type="number"
                    min={1}
                    value={a.quantity}
                    onChange={e => handleArticleChange(idx, "quantity", e.target.value)}
                  />
                  <Input
                    placeholder="Poids (kg)"
                    type="number"
                    min={0}
                    value={a.weight ?? ""}
                    onChange={e => handleArticleChange(idx, "weight", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveArticle(idx)}
                    className="ml-2 text-destructive border-destructive hover:bg-red-100"
                    title="Supprimer"
                  >×</Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={handleAddArticle}>+ Ajouter un article</Button>
            </div>
          </TabsContent>

          {/* TAB TARIFICATION */}
          <TabsContent value="cost">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-4">Résumé des coûts</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Type de conteneur:</span>
                  <span className="font-medium">{form.type || "Non spécifié"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nombre d'articles:</span>
                  <span className="font-medium">{articles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Poids total:</span>
                  <span className="font-medium">
                    {articles.reduce((acc, a) => acc + (a.weight ?? 0) * a.quantity, 0).toFixed(2)} kg
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Coût estimé:</span>
                    <span className="text-green-600 font-bold">
                      {cost.toLocaleString()} €
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                <p>Le calcul du coût est basé sur le type de conteneur et le poids total des marchandises.</p>
                <p>Ce tarif est indicatif et peut être ajusté avant la finalisation.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialog;
