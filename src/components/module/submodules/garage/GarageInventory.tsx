
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Search, Plus, Package, AlertCircle, Truck, ArrowDownUp, MoreHorizontal } from 'lucide-react';

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  reference: string;
  brand: string;
  compatibleModels: string[];
  stock: number;
  minStock: number;
  price: number;
  location: string;
  supplier: string;
  lastRestocked: string;
}

type StockMovement = {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reason: string;
  user: string;
}

const sampleInventory: InventoryItem[] = [
  {
    id: "INV001",
    name: "Filtre à huile",
    category: "Filtres",
    reference: "FH-2356-R",
    brand: "Bosch",
    compatibleModels: ["Renault Clio", "Renault Megane", "Peugeot 208"],
    stock: 15,
    minStock: 5,
    price: 8.50,
    location: "Étagère A-12",
    supplier: "EuroPieces Auto",
    lastRestocked: "2023-10-15"
  },
  {
    id: "INV002",
    name: "Plaquettes de frein avant",
    category: "Freinage",
    reference: "PF-8712-A",
    brand: "Ferodo",
    compatibleModels: ["Citroen C3", "Peugeot 208", "Renault Clio"],
    stock: 3,
    minStock: 4,
    price: 35.00,
    location: "Étagère B-05",
    supplier: "Autoparts Premium",
    lastRestocked: "2023-09-28"
  },
  {
    id: "INV003",
    name: "Batterie 60Ah",
    category: "Électricité",
    reference: "BAT-60-L3",
    brand: "Varta",
    compatibleModels: ["Renault Megane", "Peugeot 308", "Volkswagen Golf"],
    stock: 6,
    minStock: 2,
    price: 89.99,
    location: "Zone C-01",
    supplier: "Autoparts Premium",
    lastRestocked: "2023-11-05"
  },
  {
    id: "INV004",
    name: "Huile moteur 5W40 (bidon 5L)",
    category: "Lubrifiants",
    reference: "HM-5W40-5L",
    brand: "Total",
    compatibleModels: ["Multi-marques"],
    stock: 12,
    minStock: 8,
    price: 42.50,
    location: "Zone D-03",
    supplier: "MécaPro Distribution",
    lastRestocked: "2023-11-12"
  },
  {
    id: "INV005",
    name: "Liquide de refroidissement (bidon 5L)",
    category: "Liquides",
    reference: "LR-G12-5L",
    brand: "Castrol",
    compatibleModels: ["Multi-marques"],
    stock: 7,
    minStock: 5,
    price: 18.75,
    location: "Zone D-04",
    supplier: "MécaPro Distribution",
    lastRestocked: "2023-11-12"
  }
];

const sampleMovements: StockMovement[] = [
  {
    id: "MOV001",
    itemId: "INV001",
    type: 'in',
    quantity: 10,
    date: "2023-10-15",
    reason: "Réapprovisionnement",
    user: "Jean Dupont"
  },
  {
    id: "MOV002",
    itemId: "INV001",
    type: 'out',
    quantity: 2,
    date: "2023-10-18",
    reason: "Réparation #REP123",
    user: "Marc Martin"
  },
  {
    id: "MOV003",
    itemId: "INV002",
    type: 'in',
    quantity: 5,
    date: "2023-09-28",
    reason: "Réapprovisionnement",
    user: "Jean Dupont"
  },
  {
    id: "MOV004",
    itemId: "INV002",
    type: 'out',
    quantity: 2,
    date: "2023-10-05",
    reason: "Réparation #REP124",
    user: "Sophie Laporte"
  },
  {
    id: "MOV005",
    itemId: "INV003",
    type: 'in',
    quantity: 3,
    date: "2023-11-05",
    reason: "Réapprovisionnement",
    user: "Jean Dupont"
  }
];

const getLowStockBadge = (currentStock: number, minStock: number) => {
  if (currentStock <= 0) {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rupture</Badge>;
  } else if (currentStock <= minStock) {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Stock bas</Badge>;
  } else {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">OK</Badge>;
  }
};

const GarageInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [movements, setMovements] = useState<StockMovement[]>(sampleMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isStockMovementDialogOpen, setIsStockMovementDialogOpen] = useState(false);

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get movements for a specific item
  const getItemMovements = (itemId: string) => {
    return movements.filter(movement => movement.itemId === itemId);
  };

  // Handle item selection for detail view
  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
  };

  const handleNewItem = () => {
    setIsNewItemDialogOpen(true);
  };

  const handleStockMovement = (item: InventoryItem | null = null) => {
    if (item) {
      setSelectedItem(item);
    }
    setIsStockMovementDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Inventaire</h2>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={handleNewItem}>
            <Plus size={18} />
            <span>Nouveau Produit</span>
          </Button>
          <Button className="flex items-center gap-2" variant="outline" onClick={() => handleStockMovement()}>
            <ArrowDownUp size={18} />
            <span>Mouvement de stock</span>
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="inventory" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Stock</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="warehouses">Entrepôts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          {/* Inventory search and filter */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Recherche et filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher par nom, référence, marque..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="md:w-auto">Filtrer</Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Liste des produits</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInventory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun produit trouvé. Ajoutez votre premier produit avec le bouton "Nouveau Produit".
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Emplacement</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map(item => (
                        <TableRow key={item.id} onClick={() => handleItemSelect(item)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{item.reference}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.brand}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-center">{item.stock}</TableCell>
                          <TableCell>{item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{getLowStockBadge(item.stock, item.minStock)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                handleStockMovement(item);
                              }}>
                                <ArrowDownUp className="h-4 w-4 mr-1" />
                                Stock
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

        <TabsContent value="movements">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Historique des mouvements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Utilisateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map(movement => {
                    const item = inventory.find(i => i.id === movement.itemId);
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>{new Date(movement.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{item?.name || 'Produit inconnu'}</TableCell>
                        <TableCell>
                          {movement.type === 'in' ? (
                            <Badge className="bg-green-100 text-green-800">Entrée</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Sortie</Badge>
                          )}
                        </TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.user}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Alertes de stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory
                  .filter(item => item.stock <= item.minStock)
                  .map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="flex items-center">
                        <AlertCircle className={`h-5 w-5 mr-3 ${item.stock <= 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.reference} - {item.brand}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Stock actuel</div>
                          <div className="font-medium text-center">{item.stock}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Stock minimum</div>
                          <div className="font-medium text-center">{item.minStock}</div>
                        </div>
                        <Button size="sm" className="ml-4">
                          <Truck className="h-4 w-4 mr-1" />
                          Commander
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {inventory.filter(item => item.stock <= item.minStock).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune alerte de stock. Tous les niveaux sont normaux.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle>Gestion des entrepôts</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Nouvel entrepôt
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">Entrepôt Principal</h3>
                  <p className="text-sm text-muted-foreground">12 Rue de la Mécanique, 75001 Paris</p>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm">Produits: 250</span>
                    <span className="text-sm">Capacité: 70%</span>
                  </div>
                </div>
                <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">Entrepôt Secondaire</h3>
                  <p className="text-sm text-muted-foreground">5 Avenue des Véhicules, 75002 Paris</p>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm">Produits: 120</span>
                    <span className="text-sm">Capacité: 45%</span>
                  </div>
                </div>
                <div className="border border-dashed rounded-lg p-4 flex items-center justify-center">
                  <Button variant="ghost">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un entrepôt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item detail dialog */}
      {selectedItem && (
        <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du produit</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations du produit</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Nom</Label>
                    <div className="text-md font-medium">{selectedItem.name}</div>
                  </div>
                  <div>
                    <Label>Référence</Label>
                    <div className="text-md">{selectedItem.reference}</div>
                  </div>
                  <div>
                    <Label>Catégorie</Label>
                    <div className="text-md">{selectedItem.category}</div>
                  </div>
                  <div>
                    <Label>Marque</Label>
                    <div className="text-md">{selectedItem.brand}</div>
                  </div>
                  <div>
                    <Label>Prix</Label>
                    <div className="text-md">{selectedItem.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Stock</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Stock actuel</Label>
                    <div className="text-md flex items-center">
                      <span className="text-lg font-medium mr-2">{selectedItem.stock}</span>
                      {getLowStockBadge(selectedItem.stock, selectedItem.minStock)}
                    </div>
                  </div>
                  <div>
                    <Label>Stock minimum</Label>
                    <div className="text-md">{selectedItem.minStock}</div>
                  </div>
                  <div>
                    <Label>Emplacement</Label>
                    <div className="text-md">{selectedItem.location}</div>
                  </div>
                  <div>
                    <Label>Fournisseur</Label>
                    <div className="text-md">{selectedItem.supplier}</div>
                  </div>
                  <div>
                    <Label>Dernier réapprovisionnement</Label>
                    <div className="text-md">{new Date(selectedItem.lastRestocked).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 mt-6">Compatibilité</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.compatibleModels.map((model, index) => (
                    <Badge key={index} variant="outline">{model}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Historique des mouvements</h3>
              {getItemMovements(selectedItem.id).length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun mouvement enregistré pour ce produit.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Utilisateur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getItemMovements(selectedItem.id).map(movement => (
                      <TableRow key={movement.id}>
                        <TableCell>{new Date(movement.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          {movement.type === 'in' ? (
                            <Badge className="bg-green-100 text-green-800">Entrée</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Sortie</Badge>
                          )}
                        </TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>Fermer</Button>
              <Button className="flex items-center gap-2" onClick={() => handleStockMovement(selectedItem)}>
                <ArrowDownUp className="h-4 w-4" />
                <span>Mouvement de stock</span>
              </Button>
              <Button className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Commander</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Item dialog */}
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Produit</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit</Label>
                <Input id="name" placeholder="Nom du produit" />
              </div>
              <div>
                <Label htmlFor="reference">Référence</Label>
                <Input id="reference" placeholder="REF-1234" />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input id="category" placeholder="Catégorie" />
              </div>
              <div>
                <Label htmlFor="brand">Marque</Label>
                <Input id="brand" placeholder="Marque" />
              </div>
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stock">Stock initial</Label>
                <Input id="stock" type="number" min="0" defaultValue="0" />
              </div>
              <div>
                <Label htmlFor="minStock">Stock minimum</Label>
                <Input id="minStock" type="number" min="0" defaultValue="1" />
              </div>
              <div>
                <Label htmlFor="location">Emplacement</Label>
                <Input id="location" placeholder="Ex: Étagère A-12" />
              </div>
              <div>
                <Label htmlFor="supplier">Fournisseur</Label>
                <Input id="supplier" placeholder="Nom du fournisseur" />
              </div>
              <div>
                <Label htmlFor="compatibleModels">Modèles compatibles</Label>
                <Input id="compatibleModels" placeholder="Séparés par des virgules" />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewItemDialogOpen(false)}>Annuler</Button>
            <Button>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Movement dialog */}
      <Dialog open={isStockMovementDialogOpen} onOpenChange={setIsStockMovementDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mouvement de stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item">Produit</Label>
              <select 
                id="item" 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                defaultValue={selectedItem?.id || ''}
              >
                <option value="" disabled>Sélectionner un produit</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>{item.name} - {item.reference}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="movementType">Type de mouvement</Label>
              <select id="movementType" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="in">Entrée de stock</option>
                <option value="out">Sortie de stock</option>
              </select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantité</Label>
              <Input id="quantity" type="number" min="1" defaultValue="1" />
            </div>
            <div>
              <Label htmlFor="reason">Raison</Label>
              <select id="reason" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="restock">Réapprovisionnement</option>
                <option value="repair">Réparation</option>
                <option value="adjustment">Ajustement d'inventaire</option>
                <option value="return">Retour</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea 
                id="notes" 
                rows={3} 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Notes supplémentaires..."
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsStockMovementDialogOpen(false)}>Annuler</Button>
            <Button>Valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GarageInventory;
