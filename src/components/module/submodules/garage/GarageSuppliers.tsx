
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Truck, Package, Clock, MoreHorizontal, FileText } from 'lucide-react';

type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  specialties: string[];
  rating: number;
  status: 'active' | 'inactive';
  orders: SupplierOrder[];
}

type SupplierOrder = {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  expectedDelivery: string;
  actualDelivery?: string;
}

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const sampleSuppliers: Supplier[] = [
  {
    id: "SUP001",
    name: "EuroPieces Auto",
    contact: "Jean Dupont",
    email: "contact@europieces.fr",
    phone: "01 23 45 67 89",
    address: "123 Avenue de la Mécanique, 75001 Paris",
    specialties: ["Pièces détachées", "Accessoires"],
    rating: 4.5,
    status: 'active',
    orders: [
      {
        id: "ORD001",
        date: "2023-10-15",
        status: 'delivered',
        items: [
          {
            id: "ITEM001",
            name: "Filtre à huile",
            quantity: 10,
            unitPrice: 8.50,
            total: 85.00
          },
          {
            id: "ITEM002",
            name: "Plaquettes de frein",
            quantity: 5,
            unitPrice: 35.00,
            total: 175.00
          }
        ],
        total: 260.00,
        expectedDelivery: "2023-10-20",
        actualDelivery: "2023-10-19"
      }
    ]
  },
  {
    id: "SUP002",
    name: "Autoparts Premium",
    contact: "Marie Laurent",
    email: "contact@autoparts.com",
    phone: "01 98 76 54 32",
    address: "45 Rue de l'Industrie, 69002 Lyon",
    specialties: ["Pièces d'origine", "Électronique"],
    rating: 4.2,
    status: 'active',
    orders: [
      {
        id: "ORD002",
        date: "2023-11-05",
        status: 'shipped',
        items: [
          {
            id: "ITEM003",
            name: "Batterie 60Ah",
            quantity: 3,
            unitPrice: 89.99,
            total: 269.97
          }
        ],
        total: 269.97,
        expectedDelivery: "2023-11-10"
      }
    ]
  },
  {
    id: "SUP003",
    name: "MécaPro Distribution",
    contact: "Philippe Martin",
    email: "contact@mecapro.fr",
    phone: "01 45 67 89 10",
    address: "78 Boulevard Technique, 33000 Bordeaux",
    specialties: ["Outillage", "Consommables"],
    rating: 3.8,
    status: 'active',
    orders: [
      {
        id: "ORD003",
        date: "2023-11-12",
        status: 'pending',
        items: [
          {
            id: "ITEM004",
            name: "Huile moteur 5W40 (bidon 5L)",
            quantity: 10,
            unitPrice: 42.50,
            total: 425.00
          },
          {
            id: "ITEM005",
            name: "Liquide de refroidissement (bidon 5L)",
            quantity: 5,
            unitPrice: 18.75,
            total: 93.75
          }
        ],
        total: 518.75,
        expectedDelivery: "2023-11-18"
      }
    ]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
    case 'shipped':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Expédié</Badge>;
    case 'delivered':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Livré</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Annulé</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const GarageSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(sampleSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('suppliers');

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle supplier selection for detail view
  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };

  const handleNewSupplier = () => {
    setIsNewSupplierDialogOpen(true);
  };

  const handleNewOrder = () => {
    setIsNewOrderDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Fournisseurs</h2>
        <Button className="flex items-center gap-2" onClick={handleNewSupplier}>
          <Plus size={18} />
          <span>Nouveau Fournisseur</span>
        </Button>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="suppliers" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="analytics">Analytique</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          {/* Supplier search and filter */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Recherche et filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher par nom, contact, spécialité..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="md:w-auto">Filtrer</Button>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Liste des fournisseurs</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun fournisseur trouvé. Ajoutez votre premier fournisseur avec le bouton "Nouveau Fournisseur".
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Spécialités</TableHead>
                        <TableHead>Évaluation</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map(supplier => (
                        <TableRow key={supplier.id} onClick={() => handleSupplierSelect(supplier)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>
                            <div>
                              <div>{supplier.contact}</div>
                              <div className="text-sm text-muted-foreground">{supplier.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {supplier.specialties.map((specialty, index) => (
                                <Badge key={index} variant="outline">{specialty}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="text-sm">{supplier.rating}/5</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                handleNewOrder();
                              }}>
                                <Package className="h-4 w-4 mr-1" />
                                Commander
                              </Button>
                              <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle>Commandes récentes</CardTitle>
              <Button onClick={handleNewOrder}>
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle commande
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Livraison prévue</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.flatMap(supplier => 
                    supplier.orders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {new Date(order.expectedDelivery).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison des prix fournisseurs</CardTitle>
              </CardHeader>
              <CardContent className="min-h-80">
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Graphique comparatif des prix en cours de développement</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance des livraisons</CardTitle>
              </CardHeader>
              <CardContent className="min-h-80">
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Graphique des performances de livraison en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Supplier detail dialog */}
      {selectedSupplier && (
        <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du fournisseur</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations du fournisseur</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Nom</Label>
                    <div className="text-md font-medium">{selectedSupplier.name}</div>
                  </div>
                  <div>
                    <Label>Contact</Label>
                    <div className="text-md">{selectedSupplier.contact}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="text-md">{selectedSupplier.email}</div>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <div className="text-md">{selectedSupplier.phone}</div>
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <div className="text-md">{selectedSupplier.address}</div>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <div className="text-md">{getStatusBadge(selectedSupplier.status)}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Spécialités et évaluation</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Spécialités</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSupplier.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Évaluation</Label>
                    <div className="text-md flex items-center mt-1">
                      <div className="text-lg font-medium">{selectedSupplier.rating}/5</div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 mt-6">Historique des commandes</h3>
                <div className="space-y-4">
                  {selectedSupplier.orders.length === 0 ? (
                    <div className="text-muted-foreground">Aucune commande effectuée</div>
                  ) : (
                    selectedSupplier.orders.map(order => (
                      <div key={order.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Commande {order.id}</div>
                          <div>{getStatusBadge(order.status)}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Date: {new Date(order.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm mt-1">
                          Montant: {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </div>
                        <div className="text-sm mt-1">
                          Livraison prévue: {new Date(order.expectedDelivery).toLocaleDateString('fr-FR')}
                        </div>
                        {order.actualDelivery && (
                          <div className="text-sm mt-1">
                            Livraison effective: {new Date(order.actualDelivery).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSupplierDialogOpen(false)}>Fermer</Button>
              <Button className="flex items-center gap-2" onClick={handleNewOrder}>
                <Package className="h-4 w-4" />
                <span>Nouvelle commande</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Supplier dialog */}
      <Dialog open={isNewSupplierDialogOpen} onOpenChange={setIsNewSupplierDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Fournisseur</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du fournisseur</Label>
                <Input id="name" placeholder="Nom de l'entreprise" />
              </div>
              <div>
                <Label htmlFor="contact">Nom du contact</Label>
                <Input id="contact" placeholder="Prénom et nom" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="01 23 45 67 89" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="Adresse complète" />
              </div>
              <div>
                <Label htmlFor="specialties">Spécialités</Label>
                <Input id="specialties" placeholder="Séparées par des virgules" />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <select id="status" className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewSupplierDialogOpen(false)}>Annuler</Button>
            <Button>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Order dialog */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Commande</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier">Fournisseur</Label>
              <select id="supplier" className="w-full rounded-md border border-input bg-background px-3 py-2">
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Articles</Label>
              <div className="border rounded-md p-4 mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Input placeholder="Nom du produit" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="1" defaultValue="1" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" step="0.01" placeholder="0.00" />
                      </TableCell>
                      <TableCell>0.00 €</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Button variant="outline" className="mt-2" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un article
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="expectedDelivery">Date de livraison prévue</Label>
              <Input id="expectedDelivery" type="date" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea 
                id="notes" 
                rows={3} 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Notes supplémentaires pour cette commande..."
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>Annuler</Button>
            <Button>Commander</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GarageSuppliers;
