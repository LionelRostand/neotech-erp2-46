
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ContainerStatusSelect from "./ContainerStatusSelect";
import ContainerDateFields from "./ContainerDateFields";

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
  onSave: (containerData: any) => void;
  defaultNumber: string;
  routes: Route[];
  clients: ClientOption[];
  carriers: CarrierOption[];
  containerToEdit?: any;
}

const STATUSES = [
  { value: "vide", label: "Vide" },
  { value: "chargement", label: "En chargement" },
  { value: "plein", label: "Plein" },
  { value: "en transit", label: "En transit" },
  { value: "livré", label: "Livré" },
];

const ContainerDialogTabs: React.FC<ContainerDialogTabsProps> = ({
  open,
  onClose,
  onSave,
  defaultNumber,
  routes = [],
  clients = [],
  carriers = [],
  containerToEdit,
}) => {
  // Data states
  const [activeTab, setActiveTab] = useState("details");
  const [number, setNumber] = useState(defaultNumber);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [status, setStatus] = useState(STATUSES[0].value);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cost, setCost] = useState("");
  const [entryDate, setEntryDate] = useState<Date>();
  const [exitDate, setExitDate] = useState<Date>();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Remplir les champs si édition
  useEffect(() => {
    if (containerToEdit) {
      setNumber(containerToEdit.number || defaultNumber);
      setSelectedClient(containerToEdit.client || "");
      setSelectedCarrier(containerToEdit.carrier || "");
      setSelectedRoute(containerToEdit.routeId || "");
      setStatus(containerToEdit.status || STATUSES[0].value);
      setOrigin(containerToEdit.origin || "");
      setDestination(containerToEdit.destination || "");
      setCost(containerToEdit.cost ? String(containerToEdit.cost) : "");
      setEntryDate(containerToEdit.entryDate ? new Date(containerToEdit.entryDate) : undefined);
      setExitDate(containerToEdit.exitDate ? new Date(containerToEdit.exitDate) : undefined);
      setArticles(containerToEdit.articles || []);
    } else {
      setNumber(defaultNumber);
      setSelectedClient("");
      setSelectedCarrier("");
      setSelectedRoute("");
      setStatus(STATUSES[0].value);
      setOrigin("");
      setDestination("");
      setCost("");
      setEntryDate(undefined);
      setExitDate(undefined);
      setArticles([]);
    }
  }, [containerToEdit, defaultNumber, open]);

  // Lorsqu'on sélectionne une route, remplir automatiquement origine/destination
  useEffect(() => {
    if (selectedRoute) {
      const routeObj = routes.find((r) => r.id === selectedRoute);
      if (routeObj) {
        setOrigin(routeObj.origin || "");
        setDestination(routeObj.destination || "");
      }
    }
  }, [selectedRoute, routes]);

  const handleSave = () => {
    if (!number) {
      toast.error("Un numéro de conteneur est requis !");
      return;
    }
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client.");
      return;
    }
    if (!selectedCarrier) {
      toast.error("Veuillez sélectionner un transporteur.");
      return;
    }
    setLoading(true);

    onSave({
      number,
      client: selectedClient,
      carrier: selectedCarrier,
      routeId: selectedRoute,
      origin,
      destination,
      status,
      cost: cost ? parseFloat(cost) : 0,
      entryDate: entryDate ? entryDate.toISOString() : null,
      exitDate: exitDate ? exitDate.toISOString() : null,
      articles,
    });
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {containerToEdit ? "Modifier le conteneur" : "Nouveau Conteneur"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>
          {/* Tab Détails */}
          <TabsContent value="details">
            <form className="space-y-3">
              {/* Numéro */}
              <div>
                <label className="block text-xs font-medium mb-1">Référence</label>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} required />
              </div>
              {/* Client & Transporteur */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Client</label>
                  <select className="w-full border rounded px-2 py-2" value={selectedClient} onChange={e => setSelectedClient(e.target.value)} required>
                    <option value="">Sélectionnez un client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Transporteur</label>
                  <select className="w-full border rounded px-2 py-2" value={selectedCarrier} onChange={e => setSelectedCarrier(e.target.value)} required>
                    <option value="">Sélectionnez un transporteur</option>
                    {carriers.map(carrier => (
                      <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Route / Origine / Destination */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Route</label>
                  <select className="w-full border rounded px-2 py-2" value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}>
                    <option value="">Sélectionnez une route</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id}>{route.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-medium mb-1">Origine</label>
                    <Input value={origin} onChange={e => setOrigin(e.target.value)} />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-medium mb-1">Destination</label>
                    <Input value={destination} onChange={e => setDestination(e.target.value)} />
                  </div>
                </div>
              </div>
              {/* Statut */}
              <div>
                <label className="block text-xs font-medium mb-1">Statut</label>
                <ContainerStatusSelect value={status} onChange={setStatus} />
              </div>
              {/* Dates */}
              <ContainerDateFields
                entryDate={entryDate}
                exitDate={exitDate}
                setEntryDate={setEntryDate}
                setExitDate={setExitDate}
              />
              {/* Coût */}
              <div>
                <label className="block text-xs font-medium mb-1">Coût (calculé ou manuel)</label>
                <Input
                  type="number"
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                  placeholder="Coût du conteneur en fonction du trajet"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                <Button type="button" onClick={handleSave} disabled={loading}>
                  {containerToEdit ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </TabsContent>
          {/* Tab Articles */}
          <TabsContent value="articles">
            <div className="py-2 text-muted-foreground text-center text-xs">
              Module Articles à implémenter ici (prochaine étape).
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDialogTabs;
