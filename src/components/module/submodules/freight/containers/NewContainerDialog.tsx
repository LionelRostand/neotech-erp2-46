
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useFreightClients } from "../hooks/useFreightClients";
import { useCarriers } from "../hooks/useCarriers";
import { useRoutes } from "../hooks/useRoutes";
import ContainerArticlesTab from "./ContainerArticlesTab";
import ContainerCostTab from "./ContainerCostTab";

// Interface for article object
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
  route: ""
};

// Props interface for the dialog component
interface NewContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewContainerDialog: React.FC<NewContainerDialogProps> = ({ open, onOpenChange }) => {
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setForm(initialFormState);
      setArticles([]);
      setCost(0);
      setTab("info");
    }
  }, [open]);

  const handleFieldChange = (field: string, value: string) => {
    setForm((f) => ({
      ...f,
      [field]: value
    }));
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

          <TabsContent value="info">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()} autoComplete="off">
              <Input
                value={form.reference}
                onChange={(e) => handleFieldChange("reference", e.target.value)}
                placeholder="Référence"
                className=""
                name="reference"
                autoFocus
              />
              <Input
                value={form.type}
                onChange={(e) => handleFieldChange("type", e.target.value)}
                placeholder="Type"
                name="type"
              />
              <Input
                value={form.size}
                onChange={(e) => handleFieldChange("size", e.target.value)}
                placeholder="Taille"
                name="size"
              />
              <Input
                value={form.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                placeholder="Statut"
                name="status"
              />

              <Select
                value={form.carrier}
                onValueChange={(v) => handleFieldChange("carrier", v)}
                name="carrier"
              >
                <SelectTrigger>
                  <SelectValue placeholder={isCarriersLoading ? "Chargement..." : "Transporteur"} />
                </SelectTrigger>
                <SelectContent className="z-[99] bg-white">
                  {carriers.map((c) => (
                    <SelectItem key={c.id} value={c.id || `carrier-${c.name}`}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.client}
                onValueChange={(v) => handleFieldChange("client", v)}
                name="client"
              >
                <SelectTrigger>
                  <SelectValue placeholder={isClientsLoading ? "Chargement..." : "Client"} />
                </SelectTrigger>
                <SelectContent className="z-[99] bg-white">
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id || `client-${c.name}`}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.route}
                onValueChange={(v) => handleFieldChange("route", v)}
                name="route"
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRoutesLoading ? "Chargement..." : "Route"} />
                </SelectTrigger>
                <SelectContent className="z-[99] bg-white">
                  {routes.map((r) => (
                    <SelectItem key={r.id} value={r.id || `route-${r.name}`}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={form.origin}
                onChange={(e) => handleFieldChange("origin", e.target.value)}
                placeholder="Origine"
                name="origin"
              />
              <Input
                value={form.destination}
                onChange={(e) => handleFieldChange("destination", e.target.value)}
                placeholder="Destination"
                name="destination"
              />
              <Input
                value={form.departureDate}
                onChange={(e) => handleFieldChange("departureDate", e.target.value)}
                placeholder="Date départ"
                type="date"
                name="departureDate"
              />
              <Input
                value={form.arrivalDate}
                onChange={(e) => handleFieldChange("arrivalDate", e.target.value)}
                placeholder="Date arrivée"
                type="date"
                name="arrivalDate"
              />
            </form>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>Annuler</Button>
              <Button type="submit" onClick={handleCreate}>Créer</Button>
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <ContainerArticlesTab articles={articles} setArticles={setArticles} />
          </TabsContent>

          <TabsContent value="cost">
            <ContainerCostTab 
              containerType={form.type} 
              articles={articles} 
              cost={cost} 
              setCost={setCost} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialog;
