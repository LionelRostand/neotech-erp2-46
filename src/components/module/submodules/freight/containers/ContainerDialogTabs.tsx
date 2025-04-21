
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, DollarSign } from "lucide-react";
import ContainerStatusSelect from "./ContainerStatusSelect";
import ContainerDateFields from "./ContainerDateFields";
import ContainerArticlesTab from "./ContainerArticlesTab";
import ContainerCostTab from "./ContainerCostTab";

interface ContainerDialogTabsProps {
  open: boolean;
  onClose: () => void;
  onSave: (container: any) => void;
  defaultNumber: string;
  routes: { id: string; name: string; origin: string; destination: string }[];
  clients: { id: string; name: string }[];
  carriers: { id: string; name: string }[];
  initialData?: any;
}

const DEFAULT_STATUSES = [
  { value: "vide", label: "Vide" },
  { value: "chargement", label: "En chargement" },
  { value: "plein", label: "Plein" },
  { value: "en transit", label: "En transit" },
  { value: "livré", label: "Livré" },
];

const CONTAINER_TYPES = [
  { value: "20ft", label: "20 pieds" },
  { value: "40ft", label: "40 pieds" }
];

const ContainerDialogTabs: React.FC<ContainerDialogTabsProps> = ({
  open,
  onClose,
  onSave,
  defaultNumber,
  routes,
  clients,
  carriers,
  initialData,
}) => {
  const [tab, setTab] = useState("infos");
  const [number, setNumber] = useState(initialData?.number ?? defaultNumber);
  const [client, setClient] = useState(initialData?.client ?? "");
  const [carrier, setCarrier] = useState(initialData?.carrier ?? "");
  const [routeId, setRouteId] = useState(initialData?.routeId ?? "");
  const [origin, setOrigin] = useState(initialData?.origin ?? "");
  const [destination, setDestination] = useState(initialData?.destination ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "vide");
  const [entryDate, setEntryDate] = useState<Date | undefined>(initialData?.entryDate);
  const [exitDate, setExitDate] = useState<Date | undefined>(initialData?.exitDate);
  const [containerType, setContainerType] = useState(initialData?.type ?? "20ft");
  const [articles, setArticles] = useState<any[]>(initialData?.articles ?? []);
  const [cost, setCost] = useState<number>(initialData?.cost ?? 0);

  // Remplit automatiquement origine/destination si la route change
  React.useEffect(() => {
    if (routeId) {
      const route = routes.find(r => r.id === routeId);
      if (route) {
        setOrigin(route.origin || "");
        setDestination(route.destination || "");
      }
    }
  }, [routeId, routes]);

  const handleSave = () => {
    onSave({
      number,
      client,
      carrier,
      routeId,
      origin,
      destination,
      status,
      entryDate: entryDate ? entryDate.toISOString() : undefined,
      exitDate: exitDate ? exitDate.toISOString() : undefined,
      type: containerType,
      articles,
      cost,
    });
  };

  // Callbacks articles/cost can be refined if you manage at root level
  return (
    <Dialog open={open} onOpenChange={val => !val && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau Conteneur</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="infos">Infos</TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <Package className="w-4 h-4 mr-1" /> Articles
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 mr-1" /> Cout
            </TabsTrigger>
          </TabsList>
          <TabsContent value="infos">
            <form className="space-y-4" onSubmit={e => {e.preventDefault(); handleSave();}}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Référence</label>
                  <input className="border rounded px-2 py-2 w-full" value={number} onChange={e => setNumber(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Client</label>
                  <select className="border rounded px-2 py-2 w-full" value={client} onChange={e => setClient(e.target.value)} required>
                    <option value="">Sélectionner</option>
                    {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Transporteur</label>
                  <select className="border rounded px-2 py-2 w-full" value={carrier} onChange={e => setCarrier(e.target.value)} required>
                    <option value="">Sélectionner</option>
                    {carriers.map(car => <option key={car.id} value={car.id}>{car.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Route</label>
                  <select className="border rounded px-2 py-2 w-full" value={routeId} onChange={e => setRouteId(e.target.value)}>
                    <option value="">Sélectionner</option>
                    {routes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Type</label>
                  <select className="border rounded px-2 py-2 w-full" value={containerType} onChange={e => setContainerType(e.target.value)}>
                    {CONTAINER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Statut</label>
                  <ContainerStatusSelect value={status} onChange={setStatus} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Origine</label>
                  <input className="border rounded px-2 py-2 w-full" value={origin} onChange={e => setOrigin(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Destination</label>
                  <input className="border rounded px-2 py-2 w-full" value={destination} onChange={e => setDestination(e.target.value)} required />
                </div>
              </div>
              <ContainerDateFields
                entryDate={entryDate}
                setEntryDate={setEntryDate}
                exitDate={exitDate}
                setExitDate={setExitDate}
              />
            </form>
          </TabsContent>
          <TabsContent value="articles">
            <ContainerArticlesTab articles={articles} setArticles={setArticles} />
          </TabsContent>
          <TabsContent value="cost">
            <ContainerCostTab containerType={containerType} articles={articles} cost={cost} setCost={setCost} />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDialogTabs;
