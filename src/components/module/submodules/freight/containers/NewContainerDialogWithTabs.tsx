
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoutes } from "../../hooks/useRoutes";

const CONTAINER_TYPES = [
    { type: "Standard", size: "20ft" },
    { type: "Refrigerated", size: "40ft" },
    { type: "Flat Rack", size: "40ft" },
    { type: "Open Top", size: "20ft" }
];
const STATUS_OPTIONS = [
    "In Transit",
    "At Port",
    "Delivered",
    "Pending",
    "Delayed"
];

interface NewContainerDialogWithTabsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetRouteId?: string;
}

const tabList = [
  { key: "info", label: "Informations" },
  { key: "articles", label: "Articles" },
  { key: "pricing", label: "Tarification" }
];

const NewContainerDialogWithTabs: React.FC<NewContainerDialogWithTabsProps> = ({
  open,
  onOpenChange,
  presetRouteId
}) => {
  const { routes } = useRoutes();
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState({
    number: "",
    type: "",
    size: "",
    status: "",
    carrierName: "",
    routeId: presetRouteId || "",
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: ""
  });

  // Autofill type -> size
  useEffect(() => {
    const typeData = CONTAINER_TYPES.find((t) => t.type === form.type);
    setForm((prev) => ({
      ...prev,
      size: typeData ? typeData.size : ""
    }));
  }, [form.type]);

  // Autofill route -> origin/destination
  useEffect(() => {
    const selectedRoute = routes.find((r) => r.id === form.routeId);
    setForm((prev) => ({
      ...prev,
      origin: selectedRoute ? selectedRoute.origin : "",
      destination: selectedRoute ? selectedRoute.destination : ""
    }));
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
    // TODO: log or send form to backend
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Conteneur</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex w-full">
            {tabList.map((t) => (
              <TabsTrigger value={t.key} key={t.key} className="flex-1">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="info">
            <form className="space-y-4" onSubmit={handleSubmit}>
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
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select value={form.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de conteneur" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTAINER_TYPES.map(({ type }) => (
                      <SelectItem value={type} key={type}>{type}</SelectItem>
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
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <Select value={form.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem value={status} key={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transporteur</label>
                <Input
                  name="carrierName"
                  value={form.carrierName}
                  onChange={handleChange}
                  placeholder="Nom du transporteur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Route</label>
                <Select value={form.routeId} onValueChange={handleRouteChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem value={route.id} key={route.id}>{route.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <div>
                <label className="block text-sm font-medium mb-1">Date de départ</label>
                <Input
                  type="date"
                  name="departureDate"
                  value={form.departureDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date d'arrivée</label>
                <Input
                  type="date"
                  name="arrivalDate"
                  value={form.arrivalDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-primary rounded text-white px-4 py-2 hover:bg-primary/90">Créer</button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="articles">
            <div>
              <p className="text-muted-foreground italic">Section "Articles" à compléter...</p>
            </div>
          </TabsContent>
          <TabsContent value="pricing">
            <div>
              <p className="text-muted-foreground italic">Section "Tarification" à compléter...</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialogWithTabs;
