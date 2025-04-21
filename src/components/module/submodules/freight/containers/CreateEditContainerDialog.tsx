
import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContainerArticlesForm, { ContainerArticle } from "./ContainerArticlesForm";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const defaultForm = (carriers: any[], clients: any[], routes: any[]) => ({
  number: "CTN" + String(Math.floor(10000000 + Math.random() * 90000000)),
  type: "",
  size: "",
  status: "",
  carrierId: carriers.length ? carriers[0].id : "",
  carrierName: carriers.length ? carriers[0].name : "",
  client: clients.length ? (clients[0].name || clients[0].clientName) : "",
  routeId: routes.length ? routes[0].id : "",
  origin: routes.length ? routes[0].origin : "",
  destination: routes.length ? routes[0].destination : "",
  departureDate: "",
  arrivalDate: "",
  articles: [],
  costs: []
});

const sizeOptions = [
  { value: "20ft", label: "20 pieds" },
  { value: "40ft", label: "40 pieds" },
  { value: "40ftHC", label: "40 pieds High Cube" }
];

const statusOptions = [
  { value: "vide", label: "Vide" },
  { value: "chargé", label: "Chargé" },
  { value: "livré", label: "Livré" },
  { value: "entretien", label: "En cours d'entretien" }
];

const typeOptions = [
  { value: "dry", label: "Dry" },
  { value: "reefer", label: "Reefer" },
  { value: "open-top", label: "Open Top" },
  { value: "tank", label: "Tank" },
  { value: "autre", label: "Autre" }
];

const CreateEditContainerDialog = ({
  open,
  onClose,
  container,
  carrierOptions,
  clientOptions,
  routeOptions
}: {
  open: boolean;
  onClose: () => void;
  container: any;
  carrierOptions: {label: string; value: string;}[];
  clientOptions: {label: string; value: string;}[];
  routeOptions: {label: string; value: string; origin: string; destination: string;}[];
}) => {
  const [tab, setTab] = useState<"general" | "articles">("general");

  // Form state
  const [form, setForm] = useState<any>(defaultForm(carrierOptions, clientOptions, routeOptions));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (container) {
      setForm({ ...defaultForm(carrierOptions, clientOptions, routeOptions), ...container });
    } else {
      setForm(defaultForm(carrierOptions, clientOptions, routeOptions));
    }
    setTab("general");
    // eslint-disable-next-line
  }, [open, container, carrierOptions, clientOptions, routeOptions]);

  const handleChange = (key: string, value: any) => {
    if (key === "routeId") {
      const route = routeOptions.find(r => r.value === value);
      if (route) {
        setForm(f => ({ ...f, routeId: value, origin: route.origin, destination: route.destination }));
      } else {
        setForm(f => ({ ...f, routeId: value }));
      }
    } else if (key === "carrierId") {
      const carrier = carrierOptions.find(c => c.value === value);
      setForm(f => ({
        ...f,
        carrierId: value,
        carrierName: carrier?.label || ""
      }));
    } else if (key === "client") {
      setForm(f => ({ ...f, client: value }));
    } else {
      setForm(f => ({ ...f, [key]: value }));
    }
  };

  // Mise à jour des articles dans le form state
  const handleArticlesChange = (articles: ContainerArticle[]) => {
    setForm((f: any) => ({ ...f, articles }));
  };

  // Enregistrer (ajouter ou modifier) le conteneur
  const handleSave = async () => {
    setSaving(true);
    try {
      if (container?.id) {
        await updateDoc(doc(db, COLLECTIONS.FREIGHT.CONTAINERS, container.id), {
          ...form,
          updatedAt: new Date().toISOString()
        });
        toast.success("Conteneur mis à jour !");
      } else {
        await addDoc(collection(db, COLLECTIONS.FREIGHT.CONTAINERS), {
          ...form,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success("Conteneur créé !");
      }
      onClose();
    } catch (e) {
      toast.error("Erreur lors de la sauvegarde !");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{container ? "Modifier" : "Nouveau"} Conteneur</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={v => setTab(v as "general" | "articles")} className="mb-2">
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="space-y-4 pt-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Numéro du conteneur</label>
                  <Input value={form.number} disabled placeholder="Numéro automatique" readOnly />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Type</label>
                  <select className="w-full border rounded p-2" value={form.type} onChange={e => handleChange("type", e.target.value)}>
                    <option value="">Sélectionner</option>
                    {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Taille</label>
                  <select className="w-full border rounded p-2" value={form.size} onChange={e => handleChange("size", e.target.value)}>
                    <option value="">Sélectionner</option>
                    {sizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <select className="w-full border rounded p-2" value={form.status} onChange={e => handleChange("status", e.target.value)}>
                    <option value="">Sélectionner</option>
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Transporteur</label>
                  <select className="w-full border rounded p-2" value={form.carrierId} onChange={e => handleChange("carrierId", e.target.value)}>
                    {carrierOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Client</label>
                  <select className="w-full border rounded p-2" value={form.client} onChange={e => handleChange("client", e.target.value)}>
                    {clientOptions.map(opt => <option key={opt.value} value={opt.label}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Route</label>
                  <select className="w-full border rounded p-2" value={form.routeId} onChange={e => handleChange("routeId", e.target.value)}>
                    <option value="">Sélectionner la route</option>
                    {routeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Origine</label>
                  <Input value={form.origin} readOnly />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Destination</label>
                  <Input value={form.destination} readOnly />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Date de départ</label>
                  <Input
                    type="date"
                    value={form.departureDate}
                    onChange={e => handleChange("departureDate", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Date d'arrivée</label>
                  <Input
                    type="date"
                    value={form.arrivalDate}
                    onChange={e => handleChange("arrivalDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="articles">
            <ContainerArticlesForm
              articles={form.articles || []}
              onChange={handleArticlesChange}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;

