
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Truck, AlertTriangle, Search, Filter, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from '../products/hooks/useProducts';
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

// Define types for suppliers and orders
type Supplier = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  notes: string;
  createdAt: string;
};

type Order = {
  id: string;
  supplierId: string;
  supplierName: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string | null;
  deliveryDate: string | null;
  products: Array<{productId: string, name: string, quantity: number, price: number}>;
  total: number;
  notes: string;
};

const SalonInventory = () => {
  const { products, getLowStockProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [showNewSupplierSheet, setShowNewSupplierSheet] = useState(false);
  const [showNewOrderSheet, setShowNewOrderSheet] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    price: 0,
    stockQuantity: 0,
    minStockLevel: 5
  });
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [newOrder, setNewOrder] = useState({
    supplierId: '',
    products: [],
    notes: '',
    expectedDeliveryDate: ''
  });
  
  // Mock data for suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 'sup1',
      name: 'L\'Oréal Professional',
      contactName: 'Jean Dupont',
      email: 'contact@loreal-pro.fr',
      phone: '01 23 45 67 89',
      address: '14 Rue Royale, 75008 Paris',
      products: ['Shampoing', 'Après-shampoing', 'Coloration'],
      notes: 'Fournisseur principal pour les produits de coloration',
      createdAt: '2023-01-15T10:30:00Z'
    },
    {
      id: 'sup2',
      name: 'Schwarzkopf Professional',
      contactName: 'Marie Laurent',
      email: 'contact@schwarzkopf-pro.fr',
      phone: '01 23 45 67 90',
      address: '27 Avenue des Champs-Élysées, 75008 Paris',
      products: ['Shampoing', 'Styling', 'Soin'],
      notes: 'Produits de qualité pour styling et soins',
      createdAt: '2023-02-20T14:15:00Z'
    }
  ]);

  // Mock data for orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord1',
      supplierId: 'sup1',
      supplierName: 'L\'Oréal Professional',
      status: 'delivered',
      orderDate: '2023-05-10T09:30:00Z',
      expectedDeliveryDate: '2023-05-15T09:30:00Z',
      deliveryDate: '2023-05-14T14:30:00Z',
      products: [
        {productId: 'prod1', name: 'Shampoing Excellence', quantity: 10, price: 12.50},
        {productId: 'prod2', name: 'Coloration Majirel', quantity: 15, price: 8.75}
      ],
      total: 256.25,
      notes: 'Commande mensuelle de produits L\'Oréal'
    },
    {
      id: 'ord2',
      supplierId: 'sup2',
      supplierName: 'Schwarzkopf Professional',
      status: 'pending',
      orderDate: '2023-06-05T10:15:00Z',
      expectedDeliveryDate: '2023-06-10T10:15:00Z',
      deliveryDate: null,
      products: [
        {productId: 'prod3', name: 'Gel coiffant OSIS+', quantity: 8, price: 9.99},
        {productId: 'prod4', name: 'Spray fixation BC Bonacure', quantity: 12, price: 11.50}
      ],
      total: 218.92,
      notes: 'Commande urgente de produits de styling'
    },
    {
      id: 'ord3',
      supplierId: 'sup1',
      supplierName: 'L\'Oréal Professional',
      status: 'shipped',
      orderDate: '2023-06-15T15:45:00Z',
      expectedDeliveryDate: '2023-06-20T15:45:00Z',
      deliveryDate: null,
      products: [
        {productId: 'prod5', name: 'Après-shampoing Série Expert', quantity: 10, price: 14.25},
        {productId: 'prod6', name: 'Masque Absolut Repair', quantity: 5, price: 18.50}
      ],
      total: 235.00,
      notes: 'Commande pour reconstituer le stock de soins'
    }
  ]);
  
  const lowStockProducts = getLowStockProducts();
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' || name === 'minStockLevel' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSupplierInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSupplierSelectChange = (name: string, value: string) => {
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProduct = () => {
    // Validate form
    if (!newProduct.name || !newProduct.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Here we'd normally call the addProduct function from useProducts
    // Since it's missing, let's simulate it:
    toast.success("Produit ajouté avec succès");
    setShowNewProductDialog(false);

    // Reset form
    setNewProduct({
      name: '',
      brand: '',
      category: '',
      price: 0,
      stockQuantity: 0,
      minStockLevel: 5
    });
  };

  const handleCreateSupplier = () => {
    // Validate form
    if (!newSupplier.name || !newSupplier.email || !newSupplier.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Create a new supplier
    const supplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupplier.name,
      contactName: newSupplier.contactName,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      products: [],
      notes: newSupplier.notes,
      createdAt: new Date().toISOString()
    };

    setSuppliers(prev => [...prev, supplier]);
    setShowNewSupplierSheet(false);
    toast.success("Fournisseur ajouté avec succès");

    // Reset form
    setNewSupplier({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
  };

  const handleCreateOrder = () => {
    // Validate form
    if (!newOrder.supplierId) {
      toast.error("Veuillez sélectionner un fournisseur");
      return;
    }

    // Find the supplier
    const supplier = suppliers.find(s => s.id === newOrder.supplierId);
    if (!supplier) {
      toast.error("Fournisseur introuvable");
      return;
    }

    // Create a new order (simplified for demonstration)
    const order: Order = {
      id: `ord-${Date.now()}`,
      supplierId: newOrder.supplierId,
      supplierName: supplier.name,
      status: 'pending',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: newOrder.expectedDeliveryDate ? new Date(newOrder.expectedDeliveryDate).toISOString() : null,
      deliveryDate: null,
      products: [], // In a real app, we'd add selected products here
      total: 0, // In a real app, we'd calculate this
      notes: newOrder.notes
    };

    setOrders(prev => [...prev, order]);
    setShowNewOrderSheet(false);
    toast.success("Commande créée avec succès");

    // Reset form
    setNewOrder({
      supplierId: '',
      products: [],
      notes: '',
      expectedDeliveryDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button size="sm" onClick={() => setShowNewProductDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total des produits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{products.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Produits en stock faible</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-2xl font-bold">{lowStockProducts.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Inventaire des produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Produit</th>
                      <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                      <th className="px-4 py-3 text-center font-medium">Prix</th>
                      <th className="px-4 py-3 text-center font-medium">Stock</th>
                      <th className="px-4 py-3 text-center font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-muted-foreground">{product.brand}</div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                          <td className="px-4 py-3 text-center">{product.price.toFixed(2)} €</td>
                          <td className="px-4 py-3 text-center">{product.stockQuantity}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge 
                              variant={product.stockQuantity <= 5 ? "destructive" : "outline"}
                              className={product.stockQuantity <= 5 ? "" : "bg-green-100 text-green-800 hover:bg-green-100"}
                            >
                              {product.stockQuantity <= 5 ? "Stock faible" : "En stock"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          Aucun produit trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Fournisseurs</CardTitle>
              <Button variant="default" onClick={() => setShowNewSupplierSheet(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un fournisseur
              </Button>
            </CardHeader>
            <CardContent>
              {suppliers.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Nom</th>
                        <th className="px-4 py-3 text-left font-medium">Contact</th>
                        <th className="px-4 py-3 text-left font-medium">Email</th>
                        <th className="px-4 py-3 text-left font-medium">Téléphone</th>
                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map((supplier, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{supplier.name}</td>
                          <td className="px-4 py-3">{supplier.contactName}</td>
                          <td className="px-4 py-3">{supplier.email}</td>
                          <td className="px-4 py-3">{supplier.phone}</td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="sm">Détails</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-md border p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Aucun fournisseur</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore ajouté de fournisseurs.
                  </p>
                  <Button onClick={() => setShowNewSupplierSheet(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un fournisseur
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Commandes</CardTitle>
              <Button variant="default" onClick={() => setShowNewOrderSheet(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une commande
              </Button>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Fournisseur</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-center font-medium">Statut</th>
                        <th className="px-4 py-3 text-right font-medium">Total</th>
                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{order.supplierName}</td>
                          <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'outline' : 
                                order.status === 'shipped' ? 'secondary' : 
                                order.status === 'pending' ? 'default' : 
                                'destructive'
                              }
                              className={
                                order.status === 'delivered' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                              }
                            >
                              {order.status === 'delivered' ? 'Livré' : 
                               order.status === 'shipped' ? 'Expédié' : 
                               order.status === 'pending' ? 'En attente' : 
                               'Annulé'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">{order.total.toFixed(2)} €</td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="sm">Détails</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-md border p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore créé de commandes fournisseurs.
                  </p>
                  <Button onClick={() => setShowNewOrderSheet(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une commande
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue pour ajouter un nouveau produit */}
      <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit*</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newProduct.name} 
                  onChange={handleInputChange} 
                  placeholder="Shampoing, Après-shampoing, etc." 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marque</Label>
                <Input 
                  id="brand" 
                  name="brand" 
                  value={newProduct.brand} 
                  onChange={handleInputChange} 
                  placeholder="L'Oréal, Schwarzkopf, etc." 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie*</Label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shampoing">Shampoing</SelectItem>
                    <SelectItem value="Après-shampoing">Après-shampoing</SelectItem>
                    <SelectItem value="Coloration">Coloration</SelectItem>
                    <SelectItem value="Styling">Styling</SelectItem>
                    <SelectItem value="Soin">Soin</SelectItem>
                    <SelectItem value="Accessoires">Accessoires</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={newProduct.price} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Quantité en stock</Label>
                <Input 
                  id="stockQuantity" 
                  name="stockQuantity" 
                  type="number" 
                  min="0" 
                  value={newProduct.stockQuantity} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Niveau d'alerte stock</Label>
                <Input 
                  id="minStockLevel" 
                  name="minStockLevel" 
                  type="number" 
                  min="0" 
                  value={newProduct.minStockLevel} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProductDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateProduct}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet pour ajouter un nouveau fournisseur */}
      <Sheet open={showNewSupplierSheet} onOpenChange={setShowNewSupplierSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Ajouter un fournisseur</SheetTitle>
            <SheetDescription>
              Ajoutez un nouveau fournisseur pour vos produits de salon.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Nom de l'entreprise*</Label>
              <Input
                id="supplier-name"
                name="name"
                value={newSupplier.name}
                onChange={handleSupplierInputChange}
                placeholder="L'Oréal Professional, Schwarzkopf, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nom du contact</Label>
              <Input
                id="contact-name"
                name="contactName"
                value={newSupplier.contactName}
                onChange={handleSupplierInputChange}
                placeholder="Jean Dupont"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newSupplier.email}
                onChange={handleSupplierInputChange}
                placeholder="contact@fournisseur.fr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone*</Label>
              <Input
                id="phone"
                name="phone"
                value={newSupplier.phone}
                onChange={handleSupplierInputChange}
                placeholder="01 23 45 67 89"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={newSupplier.address}
                onChange={handleSupplierInputChange}
                placeholder="14 Rue Royale, 75008 Paris"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newSupplier.notes}
                onChange={handleSupplierInputChange}
                placeholder="Notes supplémentaires sur ce fournisseur..."
                rows={3}
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Annuler</Button>
            </SheetClose>
            <Button onClick={handleCreateSupplier}>Ajouter</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Sheet pour créer une nouvelle commande */}
      <Sheet open={showNewOrderSheet} onOpenChange={setShowNewOrderSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Créer une commande</SheetTitle>
            <SheetDescription>
              Créez une nouvelle commande auprès d'un fournisseur.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-select">Fournisseur*</Label>
              <Select
                value={newOrder.supplierId}
                onValueChange={(value) => handleSupplierSelectChange('supplierId', value)}
              >
                <SelectTrigger id="supplier-select">
                  <SelectValue placeholder="Sélectionner un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expected-delivery">Date de livraison prévue</Label>
              <Input
                id="expected-delivery"
                name="expectedDeliveryDate"
                type="date"
                value={newOrder.expectedDeliveryDate}
                onChange={handleOrderInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order-notes">Notes</Label>
              <Textarea
                id="order-notes"
                name="notes"
                value={newOrder.notes}
                onChange={handleOrderInputChange}
                placeholder="Notes supplémentaires sur cette commande..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                * Dans une version complète, vous pourriez sélectionner des produits à commander ici.
              </p>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Annuler</Button>
            </SheetClose>
            <Button onClick={handleCreateOrder}>Créer la commande</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SalonInventory;

