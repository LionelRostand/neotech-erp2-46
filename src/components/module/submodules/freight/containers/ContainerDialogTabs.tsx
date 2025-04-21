
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
}

interface ClientOption {
  id: string;
  name: string;
}

interface CarrierOption {
  id: string;
  name: string;
}

interface ContainerDialogTabsProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  defaultNumber: string;
  routes: Route[];
  clients: ClientOption[];
  carriers: CarrierOption[];
}

const ContainerDialogTabs: React.FC<ContainerDialogTabsProps> = ({
  open,
  onClose,
  onSave,
  defaultNumber,
  routes,
  clients,
  carriers,
}) => {
  const [tab, setTab] = useState<string>("general");

  // Champs principaux du conteneur
  const [form, setForm] = useState({
    number: defaultNumber,
    client: "",
    carrier: "",
    route: "",
    origin: "",
    destination: "",
    status: "",
    cost: "",
  });

  // Quand route change, autocomplete orig/dest
  useEffect(() => {
    if (form.route && routes && routes.length > 0) {
      const selectedRoute = routes.find((r) => r.id === form.route);
      if (selectedRoute) {
        setForm((prev) => ({
          ...prev,
          origin: selectedRoute.origin || "",
          destination: selectedRoute.destination || "",
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.route]);

  // Fournir les handlers pour chaque champ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(form);
  };

  // Gérer la fermeture : reset le tab au besoin
  useEffect(() => {
    if (!open) {
      setTab("general");
      setForm({
        number: defaultNumber,
        client: "",
        carrier: "",
        route: "",
        origin: "",
        destination: "",
        status: "",
        cost: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultNumber]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau Conteneur</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="pricing">Coût</TabsTrigger>
          </TabsList>

          {/* Onglet Général */}
          <TabsContent value="general">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {/* Référence du conteneur */}
              <div>
                <label className="block text-sm font-medium mb-1">Numéro du conteneur</label>
                <Input
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              {/* Client & Transporteur */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client</label>
                  <select
                    name="client"
                    value={form.client}
                    onChange={handleChange}
                    required
                    className="border rounded w-full px-3 py-2 bg-white z-20"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Transporteur</label>
                  <select
                    name="carrier"
                    value={form.carrier}
                    onChange={handleChange}
                    required
                    className="border rounded w-full px-3 py-2 bg-white z-20"
                  >
                    <option value="">Sélectionner un transporteur</option>
                    {carriers.map((carrier) => (
                      <option key={carrier.id} value={carrier.id}>
                        {carrier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Route, Origine & Destination sur la même ligne */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Route</label>
                  <select
                    name="route"
                    value={form.route}
                    onChange={handleChange}
                    className="border rounded w-full px-3 py-2 bg-white z-20"
                  >
                    <option value="">Sélectionner une route</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Origine</label>
                  <Input
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destination</label>
                  <Input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <Input
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  placeholder="Statut"
                />
              </div>

              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Onglet Articles */}
          <TabsContent value="articles">
            <div className="py-4">
              <div className="mb-2 font-medium">Ajoutez ici la liste des articles pour ce conteneur.</div>
              <div className="italic text-muted-foreground text-sm mb-4">Module à venir (fonctionnalité à compléter)...</div>
              {/* Ici il faudra ajouter la vraie gestion des articles */}
            </div>
          </TabsContent>

          {/* Onglet Coût */}
          <TabsContent value="pricing">
            <div className="py-4">
              <div className="mb-2 font-medium">Définir le coût du conteneur</div>
              <Input
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="Montant en €"
                type="number"
                min="0"
              />
              <div className="text-xs text-muted-foreground mt-2">
                Le coût est calculé selon la distance et le prix de base (fonctionnalité à développer).
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDialogTabs;

