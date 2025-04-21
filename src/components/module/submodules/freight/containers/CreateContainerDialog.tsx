
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Article {
  name: string;
  quantity: number;
  weight?: number;
}

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultContainerData = {
  number: `CTR-${new Date().getFullYear()}${(new Date().getMonth()+1)
    .toString().padStart(2,'0')}${new Date().getDate().toString().padStart(2,"0")}-${Math.floor(Math.random()*100000).toString().padStart(5,'0')}`,
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
};

const containerTypes = [
  "Standard (Dry)",
  "Reefer (Frigorifique)",
  "Open Top",
  "Flat Rack",
];

const containerSizes = [
  "20 pieds",
  "40 pieds",
  "40 pieds High Cube"
];

// Onglet Articles
function ArticlesTab({
  articles,
  setArticles,
}: {
  articles: Article[];
  setArticles: (arts: Article[]) => void;
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState<number | undefined>();

  const handleAdd = () => {
    if (name && quantity > 0) {
      setArticles([...articles, { name, quantity, weight }]);
      setName("");
      setQuantity(1);
      setWeight(undefined);
    }
  };

  const handleDelete = (idx: number) => {
    setArticles(articles.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex items-end gap-2 mb-4">
        <Input
          value={name}
          placeholder="Nom de l'article"
          onChange={e => setName(e.target.value)}
          className="flex-1"
        />
        <Input
          type="number"
          value={quantity}
          min={1}
          placeholder="Quantité"
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-24"
        />
        <Input
          type="number"
          min={0}
          value={weight ?? ""}
          placeholder="Poids (kg)"
          onChange={e => setWeight(e.target.value ? Number(e.target.value) : undefined)}
          className="w-32"
        />
        <Button type="button" variant="secondary" onClick={handleAdd}>Ajouter</Button>
      </div>
      <ul>
        {articles.map((a, i) => (
          <li key={i} className="flex items-center gap-2 border-b py-1 text-sm">
            <span className="flex-1">{a.name}</span>
            <span className="w-16 text-center">{a.quantity}</span>
            <span className="w-24 text-center">{a.weight ?? "-"}</span>
            <Button size="sm" variant="outline" onClick={() => handleDelete(i)} className="ml-2">Supprimer</Button>
          </li>
        ))}
        {articles.length === 0 && (
          <li className="text-muted-foreground text-center py-4">Aucun article ajouté</li>
        )}
      </ul>
    </div>
  );
}

// Onglet Tarification (très simple pour l'instant)
function CostTab({
  type,
  size,
  route,
  cost,
  setCost,
}: {
  type: string;
  size: string;
  route: string;
  cost: number;
  setCost: (val: number) => void;
}) {
  // Base rates for quick demo
  const getBaseTarif = () => {
    if (type.includes("40")) return 900;
    return 500;
  };
  const [kmDistance, setKmDistance] = useState("");
  const handleCalc = () => {
    const dist = parseFloat(kmDistance) || 0;
    const montant = getBaseTarif() + dist * 1.2;
    setCost(Number(montant.toFixed(2)));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Input 
          value={route}
          className="flex-1"
          disabled
          label="Route"
          placeholder="Exemple : CAMEROUN-PARIS"
        />
        <Input 
          type="number" 
          value={kmDistance}
          onChange={e => setKmDistance(e.target.value)}
          placeholder="Distance (km)"
          className="w-40"
        />
      </div>
      <Button type="button" variant="outline" onClick={handleCalc}>
        Calculer coût estimé
      </Button>
      <div className="pt-2">
        <span className="font-medium">Coût estimé :</span>{" "}
        <span className="text-green-600 font-semibold">{cost.toLocaleString()} €</span>
      </div>
    </div>
  );
}

export default function CreateContainerDialog({
  open,
  onOpenChange,
}: CreateContainerDialogProps) {
  // Informations
  const [tab, setTab] = useState("infos");
  const [fields, setFields] = useState({ ...defaultContainerData });
  const [articles, setArticles] = useState<Article[]>([]);
  const [cost, setCost] = useState(0);

  // Reset
  const handleClose = () => {
    setFields({ ...defaultContainerData });
    setArticles([]);
    setCost(0);
    setTab("infos");
    onOpenChange(false);
  };

  // Simule un ajout (dans l'app réelle: utiliser useAddContainer)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Conteneur créé !");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-3 w-full grid grid-cols-3 bg-gray-50">
            <TabsTrigger value="infos">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="tarif">Tarification</TabsTrigger>
          </TabsList>
          <TabsContent value="infos">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Numéro de conteneur"
                  value={fields.number}
                  onChange={e => setFields(f => ({ ...f, number: e.target.value }))}
                  placeholder="CTR-20250421-XXXXX"
                  required
                />
                <Input
                  label="Type"
                  value={fields.type}
                  onChange={e => setFields(f => ({ ...f, type: e.target.value }))}
                  placeholder="Standard (Dry)"
                  list="container-types-list"
                  required
                />
                <datalist id="container-types-list">
                  {containerTypes.map(t => <option key={t} value={t} />)}
                </datalist>
                <Input
                  label="Taille"
                  value={fields.size}
                  onChange={e => setFields(f => ({ ...f, size: e.target.value }))}
                  placeholder="20 pieds"
                  list="container-sizes-list"
                  required
                />
                <datalist id="container-sizes-list">
                  {containerSizes.map(t => <option key={t} value={t} />)}
                </datalist>
                <Input
                  label="Statut"
                  value={fields.status}
                  onChange={e => setFields(f => ({ ...f, status: e.target.value }))}
                  placeholder="Prévu"
                  required
                />
                <Input
                  label="Transporteur"
                  value={fields.carrier}
                  onChange={e => setFields(f => ({ ...f, carrier: e.target.value }))}
                  placeholder="ex: TEST-TRANSPORT"
                  required
                />
                <Input
                  label="Client"
                  value={fields.client}
                  onChange={e => setFields(f => ({ ...f, client: e.target.value }))}
                  placeholder="Sans nom"
                  required
                />
                <Input
                  label="Route"
                  value={fields.route}
                  onChange={e => setFields(f => ({ ...f, route: e.target.value }))}
                  placeholder="CAMEROUN-PARIS"
                  required
                />
                <Input
                  label="Origine"
                  value={fields.origin}
                  onChange={e => setFields(f => ({ ...f, origin: e.target.value }))}
                  placeholder="CAMEROUN"
                  required
                />
                <Input
                  label="Destination"
                  value={fields.destination}
                  onChange={e => setFields(f => ({ ...f, destination: e.target.value }))}
                  placeholder="PARIS"
                  required
                />
                <Input
                  label="Date de départ"
                  type="date"
                  value={fields.departureDate}
                  onChange={e => setFields(f => ({ ...f, departureDate: e.target.value }))}
                  placeholder="jj/mm/aaaa"
                />
                <Input
                  label="Date d'arrivée prévue"
                  type="date"
                  value={fields.arrivalDate}
                  onChange={e => setFields(f => ({ ...f, arrivalDate: e.target.value }))}
                  placeholder="jj/mm/aaaa"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button type="submit" variant="default">
                  Créer
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="articles">
            <ArticlesTab articles={articles} setArticles={setArticles} />
          </TabsContent>
          <TabsContent value="tarif">
            <CostTab 
              type={fields.type} 
              size={fields.size} 
              route={fields.route} 
              cost={cost} 
              setCost={setCost} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
