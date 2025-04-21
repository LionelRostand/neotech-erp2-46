
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { updateDocument, setDocument } from "@/hooks/firestore/update-operations";
import ContainerArticlesForm, { ContainerArticle } from "./ContainerArticlesForm";

// Types pour les options d'autocomplete
type Option = { label: string; value: string; origin?: string; destination?: string };

interface Props {
  open: boolean;
  onClose: () => void;
  container?: any;
  carrierOptions: Option[];
  clientOptions: Option[];
  routeOptions: Option[];
}

const containerTypes = [
  { value: "dry", label: "Standard (Dry)" },
  { value: "reefer", label: "Réfrigéré (Reefer)" },
  { value: "open_top", label: "Open Top" },
  { value: "flat_rack", label: "Flat Rack" },
  { value: "tank", label: "Citerne (Tank)" },
  { value: "high_cube", label: "High Cube" }
];

const containerSizes = [
  { value: "20ft", label: "20 pieds" },
  { value: "40ft", label: "40 pieds" },
  { value: "45ft", label: "45 pieds" }
];

const containerStatuses = [
  { value: "available", label: "Disponible" },
  { value: "in_transit", label: "En transit" },
  { value: "loading", label: "En chargement" },
  { value: "unloading", label: "En déchargement" },
  { value: "maintenance", label: "En maintenance" },
  { value: "reserved", label: "Réservé" }
];

// Générer un numéro de conteneur aléatoire
const generateContainerNumber = () => {
  const prefix = "CONT";
  const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return `${prefix}${randomDigits}`;
};

const CreateEditContainerDialog: React.FC<Props> = ({
  open,
  onClose,
  container,
  carrierOptions,
  clientOptions,
  routeOptions
}) => {
  const [formData, setFormData] = useState({
    number: "",
    type: "dry",
    size: "20ft",
    status: "available",
    weight: 0,
    carrier: "",
    carrierName: "",
    client: "",
    route: "",
    origin: "",
    destination: "",
    notes: ""
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [articles, setArticles] = useState<ContainerArticle[]>([]);

  // Initialiser le formulaire avec les données existantes ou générées
  useEffect(() => {
    if (container) {
      setFormData({
        number: container.number || "",
        type: container.type || "dry",
        size: container.size || "20ft",
        status: container.status || "available",
        weight: container.weight || 0,
        carrier: container.carrier || "",
        carrierName: container.carrierName || "",
        client: container.client || "",
        route: container.route || "",
        origin: container.origin || "",
        destination: container.destination || "",
        notes: container.notes || ""
      });
      // Initialiser les articles si disponibles
      if (container.articles && Array.isArray(container.articles)) {
        setArticles(container.articles);
      }
    } else {
      // Pour un nouveau conteneur, générer un numéro
      setFormData(prev => ({
        ...prev,
        number: generateContainerNumber()
      }));
    }
  }, [container]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "route") {
      // Trouver la route sélectionnée pour obtenir origine et destination
      const selectedRoute = routeOptions.find(r => r.value === value);
      if (selectedRoute) {
        setFormData(prev => ({
          ...prev,
          route: value,
          origin: selectedRoute.origin || "",
          destination: selectedRoute.destination || ""
        }));
      } else {
        setFormData(prev => ({ ...prev, route: value }));
      }
    } else if (name === "carrier") {
      // Trouver le nom du transporteur sélectionné
      const selectedCarrier = carrierOptions.find(c => c.value === value);
      setFormData(prev => ({
        ...prev,
        carrier: value,
        carrierName: selectedCarrier?.label || ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArticlesChange = (updatedArticles: ContainerArticle[]) => {
    setArticles(updatedArticles);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Préparer les données du conteneur
      const containerData = {
        ...formData,
        weight: Number(formData.weight) || 0,
        articles: articles,
        updatedAt: new Date().toISOString()
      };

      // Créer ou mettre à jour le conteneur
      if (container?.id) {
        // Mise à jour d'un conteneur existant
        await updateDocument(COLLECTIONS.FREIGHT.CONTAINERS, container.id, containerData);
        toast.success("Conteneur mis à jour !");
      } else {
        // Création d'un nouveau conteneur
        containerData.createdAt = new Date().toISOString();
        await addDoc(collection(db, COLLECTIONS.FREIGHT.CONTAINERS), containerData);
        toast.success("Nouveau conteneur créé !");
      }
      
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde du conteneur:", err);
      toast.error(`Erreur de sauvegarde: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {container ? "Modifier le Conteneur" : "Nouveau Conteneur"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">Informations Générales</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Numéro de Conteneur</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  readOnly
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de Conteneur</Label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={value => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Taille</Label>
                <Select
                  name="size"
                  value={formData.size}
                  onValueChange={value => handleSelectChange("size", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerSizes.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={value => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrier">Transporteur</Label>
                <Select
                  name="carrier"
                  value={formData.carrier}
                  onValueChange={value => handleSelectChange("carrier", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un transporteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {carrierOptions.map(carrier => (
                      <SelectItem key={carrier.value} value={carrier.value}>
                        {carrier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  name="client"
                  value={formData.client}
                  onValueChange={value => handleSelectChange("client", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientOptions.map(client => (
                      <SelectItem key={client.value} value={client.value}>
                        {client.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Select
                  name="route"
                  value={formData.route}
                  onValueChange={value => handleSelectChange("route", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routeOptions.map(route => (
                      <SelectItem key={route.value} value={route.value}>
                        {route.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origine</Label>
                <Input
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  readOnly={!!formData.route}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  readOnly={!!formData.route}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="articles" className="mt-4">
            <ContainerArticlesForm
              articles={articles}
              onChange={handleArticlesChange}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;
