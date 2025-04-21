
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFreightClients } from "./hooks/useFreightClients";

const INITIAL_FORM = {
  reference: "EXP-",
  clientId: "",
  shipmentType: "Local",
  carrier: "",
  origin: "",
  destination: "",
  scheduledDate: "",
  estimatedDeliveryDate: "",
  notes: "",
  articles: [{ name: "", qty: 1, weight: 0, packaging: "Carton" }],
  // Paramètres tarif
  basePrice: "10",
  zone: "National",
  pricingType: "Standard (1-3 jours)",
  distance: "100",
  extraFees: "0",
  // Suivi
  trackingCode: "",
  status: "Brouillon",
  route: "",
  transportType: "Route",
  transitHours: "24",
  trackDistance: "100"
};

const packagingTypes = ["Carton", "Palette", "Enveloppe", "Autre"];

const CreateShipmentPage: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ ...INITIAL_FORM });
  const [step, setStep] = React.useState<"general" | "articles" | "pricing" | "tracking">("general");
  const { clients, isLoading } = useFreightClients();

  // Utilities
  const handleField = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  const handleArticleChange = (idx: number, key: string, value: any) => {
    setForm(f => ({
      ...f,
      articles: f.articles.map((a, i) => (i === idx ? { ...a, [key]: value } : a))
    }));
  };
  const addArticle = () =>
    setForm(f => ({ ...f, articles: [...f.articles, { name: "", qty: 1, weight: 0, packaging: "Carton" }] }));
  const removeArticle = idx =>
    setForm(f => ({ ...f, articles: f.articles.filter((_, i) => i !== idx) }));

  // Calculs simples pour pricing
  const totalWeight = form.articles.reduce((sum, a) => sum + (Number(a.weight) * Number(a.qty)), 0);
  const base = Number(form.basePrice);
  const perWeight = totalWeight * 0;
  const perDistance = Number(form.distance) * 0.1;
  const totalPricing = base + perWeight + perDistance + Number(form.extraFees);

  // Réinitialisation lors de la fermeture
  const handleClose = () => {
    setOpen(false);
    setStep("general");
    setForm({ ...INITIAL_FORM });
  };

  // Champs propres au tracking générés automatiquement
  React.useEffect(() => {
    if (open) {
      // Ex : TRK + 6 chiffres aléatoires
      handleField("trackingCode", "TRK" + Math.floor(100000 + Math.random() * 900000));
      handleField("status", "Brouillon");
    }
  }, [open]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Expéditions</h1>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nouvelle Expédition</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Nouvelle Expédition</DialogTitle>
            </DialogHeader>
            <Tabs value={step} onValueChange={setStep} className="mt-2">
              <TabsList className="grid w-full grid-cols-4 mb-5">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="pricing">Tarification</TabsTrigger>
                <TabsTrigger value="tracking">Suivi & Route</TabsTrigger>
              </TabsList>
              {/* ÉTAPE 1 : INFOS GÉNÉRALES */}
              <TabsContent value="general">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium mb-1">Référence</label>
                    <Input value={form.reference} onChange={e => handleField("reference", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Client</label>
                    <Select
                      value={form.clientId}
                      onValueChange={val => handleField("clientId", val)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Nom du client" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading && <SelectItem value="" disabled>Chargement…</SelectItem>}
                        {!isLoading && clients.length === 0 && (
                          <SelectItem value="" disabled>Aucun client</SelectItem>
                        )}
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type d&apos;expédition</label>
                    <Select
                      value={form.shipmentType}
                      onValueChange={val => handleField("shipmentType", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type d'expédition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Local">Local</SelectItem>
                        <SelectItem value="International">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transporteur</label>
                    <Select
                      value={form.carrier}
                      onValueChange={val => handleField("carrier", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un transporteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sélectionner</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="UPS">UPS</SelectItem>
                        <SelectItem value="FedEx">FedEx</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Origine</label>
                    <Input placeholder="Adresse d'origine"
                      value={form.origin}
                      onChange={e => handleField("origin", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination</label>
                    <Input placeholder="Adresse de destination"
                      value={form.destination}
                      onChange={e => handleField("destination", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date d&apos;expédition</label>
                    <Input type="date"
                      value={form.scheduledDate}
                      onChange={e => handleField("scheduledDate", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de livraison estimée</label>
                    <Input type="date"
                      value={form.estimatedDeliveryDate}
                      onChange={e => handleField("estimatedDeliveryDate", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full border rounded p-2 min-h-[60px]"
                      placeholder="Informations complémentaires sur l'expédition…"
                      value={form.notes}
                      onChange={e => handleField("notes", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-2 mt-6">
                  <div />
                  <Button variant="default" onClick={() => setStep("articles")} disabled={!form.clientId}>Suivant</Button>
                </div>
              </TabsContent>
              {/* ÉTAPE 2 : ARTICLES */}
              <TabsContent value="articles">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-3 font-medium text-sm text-muted-foreground">
                    <span>Article</span>
                    <span>Quantité</span>
                    <span>Poids (kg)</span>
                    <span>Type d&apos;emballage</span>
                    <span>Poids total</span>
                  </div>
                  {form.articles.map((a, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-2">
                      <Input placeholder="Nom de l'article" value={a.name}
                        onChange={e => handleArticleChange(idx, "name", e.target.value)} />
                      <Input type="number" min={1} value={a.qty}
                        onChange={e => handleArticleChange(idx, "qty", Number(e.target.value))} />
                      <Input type="number" min={0} value={a.weight}
                        onChange={e => handleArticleChange(idx, "weight", Number(e.target.value))} />
                      <Select value={a.packaging}
                        onValueChange={val => handleArticleChange(idx, "packaging", val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {packagingTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="ml-2">{(Number(a.weight) * Number(a.qty)).toFixed(2)} kg</span>
                      {form.articles.length > 1 && (
                        <Button type="button" variant="ghost" size="sm"
                          className="ml-2 text-red-500" onClick={() => removeArticle(idx)}>Supprimer</Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="my-2" onClick={addArticle}>+ Ajouter une ligne</Button>
                  <div className="flex flex-wrap justify-end items-center gap-6 mt-4">
                    <span>Total articles: {form.articles.length}</span>
                    <span>Poids total: {totalWeight.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between gap-2 mt-6">
                    <Button variant="outline" onClick={() => setStep("general")}>Précédent</Button>
                    <Button variant="default" onClick={() => setStep("pricing")}>Suivant</Button>
                  </div>
                </div>
              </TabsContent>
              {/* ÉTAPE 3 : TARIFICATION */}
              <TabsContent value="pricing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">Paramètres de tarification</h3>
                    <div className="space-y-2">
                      <label>Prix de base (€)</label>
                      <Input type="number" min={0} value={form.basePrice} onChange={e => handleField("basePrice", e.target.value)} />
                      <label>Zone géographique</label>
                      <Select value={form.zone} onValueChange={val => handleField("zone", val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                      <label>Type d&apos;expédition</label>
                      <Select value={form.pricingType} onValueChange={val => handleField("pricingType", val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard (1-3 jours)">Standard (1-3 jours)</SelectItem>
                          <SelectItem value="Express (1 jour)">Express (1 jour)</SelectItem>
                        </SelectContent>
                      </Select>
                      <label>Distance estimée (km)</label>
                      <Input type="number" min={0} value={form.distance}
                        onChange={e => handleField("distance", e.target.value)} />
                      <label>Frais supplémentaires (€)</label>
                      <Input type="number" min={0} value={form.extraFees}
                        onChange={e => handleField("extraFees", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Résumé du calcul</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Poids total:</span>
                        <span>{totalWeight.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tarif de base:</span>
                        <span>{Number(form.basePrice).toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tarif au poids:</span>
                        <span>{perWeight.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tarif à la distance:</span>
                        <span>{perDistance.toFixed(2)} €</span>
                      </div>
                    </div>
                    <div className="mt-4 font-bold text-lg flex justify-between">
                      <span>PRIX TOTAL:</span>
                      <span>{totalPricing.toFixed(2)} €</span>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">Les prix sont calculés selon nos tarifs en vigueur.</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-6">
                  <Button variant="outline" onClick={() => setStep("articles")}>Précédent</Button>
                  <Button variant="default" onClick={() => setStep("tracking")}>Suivant</Button>
                  <span className="font-medium ml-auto">Prix total: {totalPricing.toFixed(2)} €</span>
                </div>
              </TabsContent>
              {/* ÉTAPE 4 : SUIVI / ROUTE */}
              <TabsContent value="tracking">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium mb-1">Numéro de suivi</label>
                    <Input value={form.trackingCode} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <Input value={form.status} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Route</label>
                    <Select value={form.route} onValueChange={val => handleField("route", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sélectionner</SelectItem>
                        <SelectItem value="Nord">Nord</SelectItem>
                        <SelectItem value="Sud">Sud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type de transport</label>
                    <Select value={form.transportType} onValueChange={val => handleField("transportType", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de transport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Route">Route</SelectItem>
                        <SelectItem value="Air">Air</SelectItem>
                        <SelectItem value="Mer">Mer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Délai de transit (heures)</label>
                    <Input type="number" min={1} value={form.transitHours}
                      onChange={e => handleField("transitHours", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Distance (km)</label>
                    <Input type="number" min={0} value={form.trackDistance}
                      onChange={e => handleField("trackDistance", e.target.value)} />
                  </div>
                  <div className="col-span-2 mt-3">
                    <div className="p-4 border-l-4 border-blue-400 bg-blue-50 rounded text-sm text-blue-900 flex items-center gap-2">
                      <span role="img" aria-label="pin">📍</span>
                      Suivi en temps réel&nbsp;: Un lien de suivi sera généré à la création de l'expédition.
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6 gap-2">
                  <Button variant="outline" onClick={() => setStep("pricing")}>Précédent</Button>
                  <div className="flex gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" onClick={handleClose}>Annuler</Button>
                    </DialogClose>
                    <Button variant="default"
                      onClick={() => { /* TODO: Enregistrer l'expédition */ handleClose(); }}
                      disabled={!form.clientId}
                    >
                      Créer l'expédition
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      {/* Ici on pourra afficher plus tard la liste ou le tableau des expéditions */}
    </div>
  );
};

export default CreateShipmentPage;
