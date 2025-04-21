
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useFreightClients } from "../../hooks/useFreightClients";
import { useCarriers } from "../hooks/useCarriers";
import { useRoutes } from "../hooks/useRoutes";

interface NewContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Article {
  name: string;
  quantity: number;
  weight?: number;
}

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
  route: "",
};

export const NewContainerDialog: React.FC<NewContainerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState(initialFormState);
  const [articles, setArticles] = useState<Article[]>([]);
  const [cost, setCost] = useState(0);

  // Fetch clients, carriers, routes
  const { clients, isLoading: isClientsLoading } = useFreightClients();
  const { carriers, isLoading: isCarriersLoading } = useCarriers();
  const { routes, isLoading: isRoutesLoading } = useRoutes();

  // Fill origin/destination when selecting a route
  useEffect(() => {
    if (form.route && routes.length) {
      const selected = routes.find(r => r.id === form.route);
      if (selected) {
        setForm(f => ({
          ...f,
          origin: selected.origin,
          destination: selected.destination
        }));
      }
    }
  // eslint-disable-next-line
  }, [form.route, routes]);

  const handleFieldChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleAddArticle = () => {
    setArticles([...articles, { name: '', quantity: 1 }]);
  };

  const handleArticleChange = (idx: number, key: keyof Article, value: string | number) => {
    setArticles(
      articles.map((a, i) =>
        i === idx ? { ...a, [key]: key === 'quantity' || key === 'weight' ? Number(value) : value } : a
      )
    );
  };

  const handleRemoveArticle = (idx: number) => {
    setArticles(articles.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    // Only demo: In production, handle saving container (not done here)
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

          {/* Informations tab */}
          <TabsContent value="info">
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={e => e.preventDefault()}
              autoComplete="off"
            >
              <Input
                value={form.reference}
                onChange={e => handleFieldChange("reference", e.target.value)}
                placeholder="Référence"
                className=""
                name="reference"
                autoFocus
              />
              <Input
                value={form.type}
                onChange={e => handleFieldChange("type", e.target.value)}
                placeholder="Type"
                name="type"
              />
              <Input
                value={form.size}
                onChange={e => handleFieldChange("size", e.target.value)}
                placeholder="Taille"
                name="size"
              />
              <Input
                value={form.status}
                onChange={e => handleFieldChange("status", e.target.value)}
                placeholder="Statut"
                name="status"
              />

              <Select
                value={form.carrier}
                onValueChange={v => handleFieldChange("carrier", v)}
                name="carrier"
              >
                <SelectTrigger>
                  <SelectValue placeholder={isCarriersLoading ? "Chargement..." : "Transporteur"} />
                </SelectTrigger>
                <SelectContent className="z-[99] bg-white">
                  {carriers.map(c =>
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Select
                value={form.client}
                onValueChange={v => handleFieldChange("client", v)}
                name="client"
              >
                <SelectTrigger>
                  <SelectValue placeholder={isClientsLoading ? "Chargement..." : "Client"} />
                </SelectTrigger>
                <SelectContent className="z-[99] bg-white">
                  {clients.map(c =>
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Select
                value={form.route}
                onValueChange={v => handleFieldChange("route", v)}
                name="route"
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRoutesLoading ? "Chargement..." : "Route"} />
                </SelectTrigger>
                <SelectContent className="z-[99] bg-white">
                  {routes.map(r =>
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Input
                value={form.origin}
                onChange={e => handleFieldChange("origin", e.target.value)}
                placeholder="Origine"
                name="origin"
              />
              <Input
                value={form.destination}
                onChange={e => handleFieldChange("destination", e.target.value)}
                placeholder="Destination"
                name="destination"
              />
              <Input
                value={form.departureDate}
                onChange={e => handleFieldChange("departureDate", e.target.value)}
                placeholder="Date départ"
                type="date"
                name="departureDate"
              />
              <Input
                value={form.arrivalDate}
                onChange={e => handleFieldChange("arrivalDate", e.target.value)}
                placeholder="Date arrivée"
                type="date"
                name="arrivalDate"
              />
            </form>
            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>Annuler</Button>
              <Button type="submit" onClick={handleCreate}>Créer</Button>
            </div>
          </TabsContent>

          {/* Articles tab */}
          <TabsContent value="articles">
            <div className="space-y-2">
              {articles.map((a, idx) => (
                <div
                  className="flex items-center gap-2"
                  key={idx}
                >
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

          {/* Tarification tab */}
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
                    {(articles.reduce((acc, a) => acc + (a.weight ?? 0) * a.quantity, 0)).toFixed(2)} kg
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Coût estimé:</span>
                    <span className="text-green-600 font-bold">{cost.toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              <p>Le calcul du coût est basé sur le type de conteneur et le poids total des marchandises.</p>
              <p>Ce tarif est indicatif et peut être ajusté avant la finalisation.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialog;
