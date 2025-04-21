
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Types
interface ClientOption {
  id: string;
  name: string;
}
interface CarrierOption {
  id: string;
  name: string;
}
interface Article {
  id: string;
  name: string;
  quantity: number;
}
interface TarificationData {
  distance: number;
  basePrice: number;
  cost: number;
}

interface ContainerDialogTabsProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  routes: { id: string; name: string }[];
  clients: ClientOption[];
  carriers?: CarrierOption[]; // Nouvelle props transporteurs (optionnel pour rétrocompatibilité)
  defaultNumber: string;
}

const initialContainerData = (defaultNumber: string) => ({
  number: defaultNumber,
  type: "Standard (Dry)",
  size: "20 pieds",
  status: "Prévu",
  carrier: "",
  client: "",
  route: "",
  origin: "",
  destination: "",
  departureDate: "",
  arrivalDate: "",
  articles: [],
  tarification: {
    distance: "",
    basePrice: "",
    cost: "",
  }
});

// Ajout simple d’articles pour l’onglet Articles
const ArticlesTab: React.FC<{ articles: Article[]; onAdd: (a: Article) => void; }> = ({ articles, onAdd }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => {
    if (name && quantity > 0) {
      onAdd({ id: Date.now().toString(), name, quantity });
      setName("");
      setQuantity(1);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          className="border rounded p-2 flex-1"
          type="text"
          placeholder="Nom de l'article"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border rounded p-2 w-24"
          type="number"
          min={1}
          placeholder="Qté"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <Button type="button" onClick={handleAdd}>Ajouter</Button>
      </div>
      <ul className="space-y-1">
        {articles.map(a => (
          <li key={a.id} className="border-b py-1 flex justify-between">
            <span>{a.name} (x{a.quantity})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Onglet Tarification avec calcul automatique
const TarificationTab: React.FC<{
  tarification: TarificationData,
  onChange: (data: TarificationData) => void;
}> = ({ tarification, onChange }) => {
  // Calcul automatique
  const handleChange = (field: keyof TarificationData, value: string | number) => {
    const updated = { ...tarification, [field]: value };
    // coût = basePrice * distance (démonstratif, ajuster selon votre logique)
    const price = Number(updated.basePrice) || 0;
    const dist = Number(updated.distance) || 0;
    updated.cost = price * dist;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Distance (km)</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            placeholder="Distance"
            value={tarification.distance}
            onChange={e => handleChange("distance", e.target.value)}
            min={0}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Prix de base (par km)</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            placeholder="Prix de base"
            value={tarification.basePrice}
            onChange={e => handleChange("basePrice", e.target.value)}
            min={0}
          />
        </div>
      </div>
      <div className="text-right text-green-800 font-bold text-lg mt-4">
        Coût total estimé : {tarification.cost ? tarification.cost.toLocaleString() + " €" : "-"}
      </div>
    </div>
  );
};

// Onglet principal informations
const InformationsTab: React.FC<{
  data: any;
  onChange: (d: any) => void;
  clients: ClientOption[];
  carriers?: CarrierOption[];
  routes: { id: string; name: string }[];
}> = ({ data, onChange, clients, carriers, routes }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Numéro de conteneur</label>
        <input className="border rounded p-2 w-full" value={data.number} readOnly />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Type</label>
        <input className="border rounded p-2 w-full" value={data.type} onChange={e => onChange({ ...data, type: e.target.value })} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Taille</label>
        <input className="border rounded p-2 w-full" value={data.size} onChange={e => onChange({ ...data, size: e.target.value })} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Statut</label>
        <input className="border rounded p-2 w-full" value={data.status} onChange={e => onChange({ ...data, status: e.target.value })} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Transporteur</label>
        <select
          className="border rounded p-2 w-full"
          value={data.carrier}
          onChange={e => onChange({ ...data, carrier: e.target.value })}
        >
          <option value="">Sélectionner...</option>
          {carriers && carriers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Client</label>
        <select
          className="border rounded p-2 w-full"
          value={data.client}
          onChange={e => onChange({ ...data, client: e.target.value })}
        >
          <option value="">Sélectionner...</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Route</label>
        <select
          className="border rounded p-2 w-full"
          value={data.route}
          onChange={e => onChange({ ...data, route: e.target.value })}
        >
          <option value="">Sélectionner...</option>
          {routes.map(r => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Origine</label>
        <input className="border rounded p-2 w-full" value={data.origin} onChange={e => onChange({ ...data, origin: e.target.value })} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Destination</label>
        <input className="border rounded p-2 w-full" value={data.destination} onChange={e => onChange({ ...data, destination: e.target.value })} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Date de départ</label>
        <input
          className="border rounded p-2 w-full"
          type="date"
          value={data.departureDate}
          onChange={e => onChange({ ...data, departureDate: e.target.value })}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Date d'arrivée prévue</label>
        <input
          className="border rounded p-2 w-full"
          type="date"
          value={data.arrivalDate}
          onChange={e => onChange({ ...data, arrivalDate: e.target.value })}
        />
      </div>
    </div>
  );
};

const ContainerDialogTabs: React.FC<ContainerDialogTabsProps> = ({
  open,
  onClose,
  onSave,
  routes,
  clients,
  carriers = [],
  defaultNumber,
}) => {
  const [tab, setTab] = useState("info");
  const [infos, setInfos] = useState(() => initialContainerData(defaultNumber));
  const [articles, setArticles] = useState<Article[]>([]);
  const [tarification, setTarification] = useState<TarificationData>({
    distance: "",
    basePrice: "",
    cost: "",
  });

  // On change d'onglet: re-sync state
  React.useEffect(() => {
    setInfos({ ...infos, articles, tarification });
  }, [articles, tarification]);

  // Save action
  const handleSave = () => {
    onSave({
      ...infos,
      articles,
      tarification
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full flex mb-6">
            <TabsTrigger value="info" className="flex-1">Informations</TabsTrigger>
            <TabsTrigger value="articles" className="flex-1">Articles</TabsTrigger>
            <TabsTrigger value="tarif" className="flex-1">Tarification</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <InformationsTab
              data={infos}
              onChange={setInfos}
              clients={clients}
              carriers={carriers}
              routes={routes}
            />
          </TabsContent>
          <TabsContent value="articles">
            <ArticlesTab articles={articles} onAdd={a => setArticles([...articles, a])} />
          </TabsContent>
          <TabsContent value="tarif">
            <TarificationTab tarification={tarification} onChange={setTarification} />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDialogTabs;
