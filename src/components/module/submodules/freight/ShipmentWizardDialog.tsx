
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

type WizardStep = 'general' | 'articles' | 'pricing' | 'tracking';

interface ShipmentWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const clientsList = [
  { id: '1', name: 'ABC Logistics' },
  { id: '2', name: 'Express Client' },
  // Ajoutez ici la vraie liste dynamique si besoin
];

const carriersList = [
  { id: '1', name: 'TransRoute' },
  { id: '2', name: 'GlobalCarrier' },
];

const routeList = [
  { id: '1', name: 'Douala - Paris' },
  { id: '2', name: 'Lyon - Marseille' },
];

const packagingTypes = [
  { id: 'carton', name: 'Carton' },
  { id: 'palette', name: 'Palette' },
];

const ShipmentWizardDialog: React.FC<ShipmentWizardDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<WizardStep>('general');
  const [form, setForm] = useState({
    reference: 'EXP-',
    client: '',
    carrier: '',
    shipmentType: 'local',
    origin: '',
    destination: '',
    scheduledDate: '',
    estimatedDeliveryDate: '',
    notes: '',
    lineItems: [
      {
        id: Date.now().toString(),
        productName: '',
        quantity: 1,
        weight: 0,
        packageType: 'carton'
      }
    ],
    // Pricing fields
    basePrice: 10,
    geoZone: 'national',
    deliveryType: 'standard',
    distanceKm: 100,
    extraFees: 0,
    // Tracking
    trackingNumber: `TRK${Math.floor(Math.random() * 900000000 + 100000000)}`,
    status: 'draft',
    routeId: '',
    transportType: 'road',
    transitTime: 24,
    trackingDistance: 100,
  });

  // Pour l'erreur Select : chaque SelectItem a une valeur non vide
  // Gestion simple pour la démo du wizard
  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (index: number, key: string, value: any) => {
    const clone = [...form.lineItems];
    clone[index] = { ...clone[index], [key]: value };
    setForm(f => ({ ...f, lineItems: clone }));
  };

  const addLineItem = () => {
    setForm(f => ({
      ...f,
      lineItems: [
        ...f.lineItems,
        {
          id: Date.now().toString() + Math.floor(Math.random() * 1000),
          productName: '',
          quantity: 1,
          weight: 0,
          packageType: 'carton'
        }
      ]
    }));
  };

  const removeLineItem = (id: string) => {
    setForm(f => ({
      ...f,
      lineItems: f.lineItems.filter((item) => item.id !== id)
    }));
  };

  // Basculer entre étapes
  const goToNext = () => {
    if (step === 'general') setStep('articles');
    else if (step === 'articles') setStep('pricing');
    else if (step === 'pricing') setStep('tracking');
  };
  const goToPrev = () => {
    if (step === 'tracking') setStep('pricing');
    else if (step === 'pricing') setStep('articles');
    else if (step === 'articles') setStep('general');
  };

  // Prix de base + calcul mock
  const totalWeight = form.lineItems.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const totalQuantity = form.lineItems.length;
  const weightTariff = (totalWeight * 0.5);
  const distanceTariff = (form.distanceKm * 0.1);
  const totalPrice = (Number(form.basePrice) + weightTariff + distanceTariff + Number(form.extraFees)).toFixed(2);

  // Rendu du popup
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl animate-fade-in">
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        <Tabs value={step} className="mt-2">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general" onClick={() => setStep('general')}>Informations générales</TabsTrigger>
            <TabsTrigger value="articles" onClick={() => setStep('articles')}>Articles</TabsTrigger>
            <TabsTrigger value="pricing" onClick={() => setStep('pricing')}>Tarification</TabsTrigger>
            <TabsTrigger value="tracking" onClick={() => setStep('tracking')}>Suivi & Route</TabsTrigger>
          </TabsList>
          {/* Onglet Informations générales */}
          <TabsContent value="general">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Référence</label>
                <Input value={form.reference} onChange={e => updateForm('reference', e.target.value)} placeholder="EXP-" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <Select value={form.client} onValueChange={v => updateForm('client', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nom du client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsList.map(c => (
                      <SelectItem value={c.id} key={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type d'expédition</label>
                <Select value={form.shipmentType} onValueChange={v => updateForm('shipmentType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'expédition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transporteur</label>
                <Select value={form.carrier} onValueChange={v => updateForm('carrier', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un transporteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriersList.map(c => (
                      <SelectItem value={c.id} key={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Origine</label>
                <Input placeholder="Adresse d'origine" value={form.origin} onChange={e => updateForm('origin', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <Input placeholder="Adresse de destination" value={form.destination} onChange={e => updateForm('destination', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date d'expédition</label>
                <Input placeholder="jj / mm / aaaa" value={form.scheduledDate} onChange={e => updateForm('scheduledDate', e.target.value)} type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de livraison estimée</label>
                <Input placeholder="jj / mm / aaaa" value={form.estimatedDeliveryDate} onChange={e => updateForm('estimatedDeliveryDate', e.target.value)} type="date" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea className="w-full border rounded-md p-2" rows={2} placeholder="Informations complémentaires sur l'expédition..." value={form.notes} onChange={e => updateForm('notes', e.target.value)} />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div />
              <Button className="bg-emerald-600" onClick={goToNext}>Suivant</Button>
            </div>
          </TabsContent>
          {/* Onglet Articles */}
          <TabsContent value="articles">
            <div>
              <div className="grid grid-cols-5 gap-3 items-end mb-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Article</label>
                  <Input value={form.lineItems[0].productName} onChange={e => handleLineChange(0, 'productName', e.target.value)} placeholder="Nom de l'article" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantité</label>
                  <Input type="number" className="w-full" min={1} value={form.lineItems[0].quantity} onChange={e => handleLineChange(0, 'quantity', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Poids (kg)</label>
                  <Input type="number" className="w-full" min={0} value={form.lineItems[0].weight} onChange={e => handleLineChange(0, 'weight', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Type d'emballage</label>
                  <Select value={form.lineItems[0].packageType} onValueChange={v => handleLineChange(0, 'packageType', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {packagingTypes.map(pt => (
                        <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Affichage des lignes (simili edition) */}
              {/* Extension future : gérer plusieurs articles */}
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={goToPrev}>Précédent</Button>
                <Button className="bg-emerald-600" onClick={goToNext}>Suivant</Button>
              </div>
            </div>
          </TabsContent>
          {/* Onglet Tarification */}
          <TabsContent value="pricing">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Paramètres de tarification</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix de base (€)</label>
                    <Input type="number" value={form.basePrice} onChange={e => updateForm('basePrice', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zone géographique</label>
                    <Select value={form.geoZone} onValueChange={v => updateForm('geoZone', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Zone géographique" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type d'expédition</label>
                    <Select value={form.deliveryType} onValueChange={v => updateForm('deliveryType', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (1-3 jours)</SelectItem>
                        <SelectItem value="express">Express (24h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Distance estimée (km)</label>
                    <Input type="number" value={form.distanceKm} min={0} onChange={e => updateForm('distanceKm', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frais supplémentaires (€)</label>
                    <Input type="number" value={form.extraFees} min={0} onChange={e => updateForm('extraFees', e.target.value)} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Résumé du calcul</h3>
                <div className="bg-gray-50 border rounded p-4 space-y-2">
                  <div>Poids total: <span className="font-medium">{totalWeight.toFixed(2)} kg</span></div>
                  <div>Tarif de base: <span className="font-medium">{Number(form.basePrice).toFixed(2)} €</span></div>
                  <div>Tarif au poids: <span className="font-medium">{weightTariff.toFixed(2)} €</span></div>
                  <div>Tarif à la distance: <span className="font-medium">{distanceTariff.toFixed(2)} €</span></div>
                  <div className="text-lg mt-2 font-bold">PRIX TOTAL: {totalPrice} €</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPrev}>Précédent</Button>
              <Button className="bg-emerald-600" onClick={goToNext}>Suivant</Button>
            </div>
          </TabsContent>
          {/* Onglet Suivi & Route */}
          <TabsContent value="tracking">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de suivi</label>
                <Input value={form.trackingNumber} readOnly className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <Select value={form.status} onValueChange={v => updateForm('status', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="in_transit">En cours</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="delayed">Retardée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Route</label>
                <Select value={form.routeId} onValueChange={v => updateForm('routeId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routeList.map(r => (
                      <SelectItem value={r.id} key={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type de transport</label>
                <Select value={form.transportType} onValueChange={v => updateForm('transportType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="road">Route</SelectItem>
                    <SelectItem value="sea">Mer</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="rail">Train</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Délai de transit (heures)</label>
                <Input type="number" min={0} value={form.transitTime} onChange={e => updateForm('transitTime', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Distance (km)</label>
                <Input type="number" min={0} value={form.trackingDistance} onChange={e => updateForm('trackingDistance', e.target.value)} />
              </div>
              <div className="col-span-2 mt-4 p-3 bg-blue-50 rounded flex items-center">
                <span className="mr-3">
                  <svg width={18} height={18} fill="#2563eb" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="9"/><path d="M13.3 8.6c-1.2-2.1-2-3.3-2.1-3.5l-.3-.4c-.2-.3-.6-.3-.8 0 0 .1-.2.3-.3.4-.1.2-.9 1.4-2.1 3.5C7.2 9.4 7 10 7 10.6s.2 1.2.5 1.6c.5.7 1.3 1.1 2.2 1.1s1.7-.4 2.2-1.1c.3-.4.5-1 .5-1.6s-.2-1.2-.4-2zm-2.3 3.1c-.5 0-.9-.2-1.2-.5-.2-.3-.3-.6-.3-1 0-.4.1-.7.3-1.1C9.8 8.6 10.4 7.7 10.5 7.5c.1.2.7 1.1 1.6 2.1.2.4.3.7.3 1.1 0 .4-.1.7-.3 1-.3.3-.7.5-1.2.5z"/></svg>
                </span>
                <span className="text-blue-700 font-medium">
                  Suivi en temps réel
                </span>
                <span className="ml-3 text-blue-700 text-sm">
                  Un lien de suivi sera généré automatiquement après la création de l'expédition.<br />
                  Les clients pourront y accéder via le code de suivi.
                </span>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPrev}>Précédent</Button>
              <Button className="bg-emerald-600" onClick={() => { onOpenChange(false); }}>Créer l'expédition</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
};

export default ShipmentWizardDialog;
