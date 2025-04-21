
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const containerTypes = [
  "Standard (Dry)",
  "Réfrigéré (Reefer)",
  "Open Top",
  "Flat Rack",
  "Tank",
];
const containerSizes = [
  "20 pieds",
  "40 pieds",
  "40 pieds High Cube",
  "45 pieds",
];
const containerStatus = [
  "Prévu",
  "Chargé",
  "En transit",
  "Arrivé",
  "Livré",
];

interface Article {
  id: string;
  name: string;
  quantity: number;
  description?: string;
}

interface ContainerDialogTabsProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  defaultNumber: string;
  clients: { id: string; name: string }[];
  routes: { id: string; name: string; origin?: string; destination?: string }[];
}

const ContainerDialogTabs: React.FC<ContainerDialogTabsProps> = ({
  open,
  onClose,
  onSave,
  defaultNumber,
  clients,
  routes,
}) => {
  const [tab, setTab] = useState<"info" | "articles" | "pricing">("info");
  const [form, setForm] = useState({
    number: defaultNumber || "",
    type: containerTypes[0],
    size: containerSizes[0],
    status: containerStatus[0],
    client: clients[0]?.id || "",
    route: routes[0]?.id || "",
    origin: "",
    destination: "",
    departDate: "",
    arrivalDate: "",
    transporter: "",
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const [newArticle, setNewArticle] = useState({ name: "", quantity: 1, description: "" });
  const [pricing, setPricing] = useState({ basePrice: 0, distance: 0, total: 0 });

  React.useEffect(() => {
    // Set origin, destination by route
    const routeObj = routes.find((r) => r.id === form.route);
    setForm((prev) => ({
      ...prev,
      origin: routeObj?.origin || "",
      destination: routeObj?.destination || ""
    }));
    // eslint-disable-next-line
  }, [form.route]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Articles logic
  const addArticle = () => {
    if (!newArticle.name || newArticle.quantity <= 0) {
      toast.error("Nom et quantité valides requis");
      return;
    }
    setArticles((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: newArticle.name,
        quantity: Number(newArticle.quantity),
        description: newArticle.description,
      },
    ]);
    setNewArticle({ name: "", quantity: 1, description: "" });
  };

  const removeArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPricing((prev) => ({
      ...prev,
      [name]: Number(value),
      total:
        name === "basePrice"
          ? Number(value) + prev.distance * 0.8
          : prev.basePrice + Number(value) * 0.8,
    }));
  };

  // Simple price calculation for user experience
  React.useEffect(() => {
    setPricing((prev) => ({
      ...prev,
      total: Number(prev.basePrice) + Number(prev.distance) * 0.8,
    }));
  }, [pricing.basePrice, pricing.distance]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.number || !form.type || !form.size || !form.client || !form.route) {
      toast.error("Tous les champs obligatoires doivent être remplis");
      return;
    }
    onSave({
      ...form,
      articles,
      pricing,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={t => setTab(t as any)} className="mb-2">
          <TabsList className="mb-4 w-full grid grid-cols-3">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="pricing">Tarification</TabsTrigger>
          </TabsList>
          {/* Onglet informations */}
          <TabsContent value="info">
            <form className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Numéro de conteneur</label>
                  <Input name="number" placeholder="ex: MSCU1234567" value={form.number} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Type</label>
                  <select
                    className="appearance-none w-full h-10 px-3 rounded-md border"
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                  >
                    {containerTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Taille</label>
                  <select
                    className="appearance-none w-full h-10 px-3 rounded-md border"
                    name="size"
                    value={form.size}
                    onChange={handleFormChange}
                  >
                    {containerSizes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Statut</label>
                  <select
                    className="appearance-none w-full h-10 px-3 rounded-md border"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {containerStatus.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Transporteur</label>
                  <Input name="transporter" placeholder="ex: TEST-TRANSPORT" value={form.transporter} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Client</label>
                  <select
                    className="appearance-none w-full h-10 px-3 rounded-md border"
                    name="client"
                    value={form.client}
                    onChange={handleFormChange}
                  >
                    {clients.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Route</label>
                  <select
                    className="appearance-none w-full h-10 px-3 rounded-md border"
                    name="route"
                    value={form.route}
                    onChange={handleFormChange}
                  >
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div />
                <div>
                  <label className="block mb-1 text-sm">Origine</label>
                  <Input name="origin" placeholder="CAMEROUN" value={form.origin} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Destination</label>
                  <Input name="destination" placeholder="PARIS" value={form.destination} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Date de départ</label>
                  <Input type="date" name="departDate" value={form.departDate} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Date d'arrivée prévue</label>
                  <Input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleFormChange} />
                </div>
              </div>
            </form>
          </TabsContent>
          {/* Onglet articles */}
          <TabsContent value="articles">
            <div className="mb-4">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  addArticle();
                }}
                className="flex items-end gap-2"
              >
                <div>
                  <label className="block mb-1 text-sm">Désignation</label>
                  <Input
                    value={newArticle.name}
                    onChange={e => setNewArticle(a => ({ ...a, name: e.target.value }))}
                    placeholder="Nom de l'article"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Quantité</label>
                  <Input
                    type="number"
                    min={1}
                    value={newArticle.quantity}
                    onChange={e => setNewArticle(a => ({ ...a, quantity: +e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Description (optionnel)</label>
                  <Input
                    value={newArticle.description}
                    onChange={e => setNewArticle(a => ({ ...a, description: e.target.value }))}
                    placeholder="Description"
                  />
                </div>
                <Button type="submit" variant="default" className="h-10 ml-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </form>
              <div className="mt-4">
                {articles.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Aucun article pour ce conteneur.</div>
                ) : (
                  <ul className="divide-y">
                    {articles.map(article => (
                      <li className="py-2 flex justify-between items-center" key={article.id}>
                        <div>
                          <span className="font-semibold">{article.name}</span> &times; {article.quantity}
                          {article.description && (
                            <div className="text-xs text-gray-500">{article.description}</div>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeArticle(article.id)}
                        >
                          <span className="text-red-600 text-lg">&times;</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>
          {/* Onglet tarification */}
          <TabsContent value="pricing">
            <form className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Prix de base (EUR)</label>
                  <Input
                    name="basePrice"
                    type="number"
                    min={0}
                    value={pricing.basePrice}
                    onChange={handlePricingChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Distance (km)</label>
                  <Input
                    name="distance"
                    type="number"
                    min={0}
                    value={pricing.distance}
                    onChange={handlePricingChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Coût total estimé (EUR)</label>
                  <Input value={pricing.total} readOnly className="font-bold bg-gray-100" />
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2">
                * Estimation : coût = prix de base + distance × 0.8 EUR/km
              </div>
            </form>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="default" onClick={handleCreate}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDialogTabs;
