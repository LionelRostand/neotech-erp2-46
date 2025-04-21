
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useCarriers } from "../hooks/useCarriers";
import { useRoutes } from "../hooks/useRoutes";
import { useFreightData } from "@/hooks/modules/useFreightData";

// Différents types de conteneurs disponibles
const CONTAINER_TYPES = [
  { value: "Standard", size: "20ft" },
  { value: "Refrigerated", size: "40ft" },
  { value: "High Cube", size: "40ft High Cube" },
  { value: "Open Top", size: "20ft" },
  { value: "Flat Rack", size: "40ft" },
  { value: "Tank", size: "20ft" }
];

// Liste des statuts - correspondance capture
const STATUS_OPTIONS = [
  { value: "vide", label: "Vide" },
  { value: "chargement", label: "En chargement" },
  { value: "plein", label: "Plein" },
  { value: "en transit", label: "En transit" },
  { value: "livré", label: "Livré" }
];

const initialFormState = {
  reference: "",
  type: "",
  size: "",
  status: "",
  carrier: "",
  client: "",
  route: "",
  origin: "",
  destination: "",
  departureDate: "",
  arrivalDate: "",
};

const NewContainerDialog = ({ open, onOpenChange }) => {
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState(initialFormState);
  const [articles, setArticles] = useState([]);
  const [cost, setCost] = useState(0);

  // Fetch clients, carriers, routes depuis les hooks
  const { clients, loading: isClientsLoading } = useFreightData();
  const { carriers, isLoading: isCarriersLoading } = useCarriers();
  const { routes, isLoading: isRoutesLoading } = useRoutes();

  // Remplit taille selon le type sélectionné
  useEffect(() => {
    const typeObj = CONTAINER_TYPES.find((t) => t.value === form.type);
    if (typeObj) {
      setForm((f) => ({ ...f, size: typeObj.size }));
    } else if(form.type === "") {
      setForm((f) => ({ ...f, size: "" }));
    }
    // eslint-disable-next-line
  }, [form.type]);

  // Remplit origine/destination selon la route
  useEffect(() => {
    if (form.route && routes.length > 0) {
      const routeObj = routes.find((r) => r.id === form.route);
      if (routeObj) {
        setForm((f) => ({
          ...f,
          origin: routeObj.origin,
          destination: routeObj.destination
        }));
      }
    }
    // eslint-disable-next-line
  }, [form.route, routes]);

  // Champs dynamiques des articles (tab Articles)
  const handleAddArticle = () => {
    setArticles([...articles, { name: "", quantity: 1, weight: 0 }]);
  };
  const handleArticleChange = (idx, key, value) => {
    setArticles(
      articles.map((a, i) =>
        i === idx ? { ...a, [key]: key === "quantity" || key === "weight" ? Number(value) : value } : a
      )
    );
  };
  const handleRemoveArticle = (idx) => setArticles(articles.filter((_, i) => i !== idx));

  // Formulaire
  const handleFieldChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Simuler la création (ferme pop-up)
  const handleCreate = () => onOpenChange(false);
  const handleCancel = () => onOpenChange(false);

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

          {/* Onglet Informations */}
          <TabsContent value="info">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => e.preventDefault()} autoComplete="off">
              {/* Référence */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="reference">Référence</label>
                <Input
                  id="reference"
                  name="reference"
                  value={form.reference}
                  placeholder="Référence"
                  onChange={e => handleFieldChange("reference", e.target.value)}
                  autoFocus
                />
              </div>
              {/* Type */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="type">Type</label>
                <Select value={form.type} onValueChange={v => handleFieldChange("type", v)} name="type">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTAINER_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Taille (auto selon type) */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="size">Taille</label>
                <Input
                  id="size"
                  name="size"
                  placeholder="Taille"
                  value={form.size}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              {/* Statut */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="status">Statut</label>
                <Select value={form.status} onValueChange={v => handleFieldChange("status", v)} name="status">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Transporteur */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="carrier">Transporteur</label>
                <Select value={form.carrier} onValueChange={v => handleFieldChange("carrier", v)} name="carrier">
                  <SelectTrigger id="carrier">
                    <SelectValue placeholder={isCarriersLoading ? "Chargement..." : "Transporteur"} />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Client */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="client">Client</label>
                <Select value={form.client} onValueChange={v => handleFieldChange("client", v)} name="client">
                  <SelectTrigger id="client">
                    <SelectValue placeholder={isClientsLoading ? "Chargement..." : "Client"} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Route */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="route">Route</label>
                <Select value={form.route} onValueChange={v => handleFieldChange("route", v)} name="route">
                  <SelectTrigger id="route">
                    <SelectValue placeholder={isRoutesLoading ? "Chargement..." : "Route"} />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Origine */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="origin">Origine</label>
                <Input
                  id="origin"
                  name="origin"
                  value={form.origin}
                  placeholder="Origine"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              {/* Destination */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="destination">Destination</label>
                <Input
                  id="destination"
                  name="destination"
                  value={form.destination}
                  placeholder="Destination"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              {/* Départ */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="departureDate">Date départ</label>
                <Input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={form.departureDate}
                  onChange={e => handleFieldChange("departureDate", e.target.value)}
                  placeholder="jj/mm/aaaa"
                />
              </div>
              {/* Arrivée */}
              <div>
                <label className="block text-sm mb-1 font-medium" htmlFor="arrivalDate">Date arrivée</label>
                <Input
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  value={form.arrivalDate}
                  onChange={e => handleFieldChange("arrivalDate", e.target.value)}
                  placeholder="jj/mm/aaaa"
                />
              </div>
            </form>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" onClick={handleCreate}>
                Créer
              </Button>
            </div>
          </TabsContent>

          {/* Onglet Articles */}
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
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={handleAddArticle}>
                + Ajouter un article
              </Button>
            </div>
          </TabsContent>

          {/* Onglet Tarification */}
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
