
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Pill, Search, PackageOpen, ShoppingCart, BarChart3, AlertTriangle, 
  Plus, PlusCircle, MinusCircle, Calendar, FileText
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PharmacyItem, PharmacySale } from './types/health-types';
import { toast } from 'sonner';

const PharmacyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [isLowStockDialogOpen, setIsLowStockDialogOpen] = useState(false);

  // Mock data for pharmacy inventory
  const medicationInventory: PharmacyItem[] = [
    {
      id: '1',
      name: 'Amoxicilline',
      genericName: 'Amoxicilline',
      category: 'Antibiotique',
      type: 'capsule',
      dosage: '500mg',
      manufacturer: 'Laboratoire XYZ',
      batchNumber: 'AMX-2023-001',
      expiryDate: '2025-05-15',
      stockQuantity: 120,
      reorderLevel: 30,
      unitPrice: 0.5,
      location: 'Étagère A-1',
      needsPrescription: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Paracétamol',
      genericName: 'Paracétamol',
      category: 'Antalgique',
      type: 'tablet',
      dosage: '1000mg',
      manufacturer: 'Laboratoire ABC',
      batchNumber: 'PCM-2023-102',
      expiryDate: '2024-10-22',
      stockQuantity: 250,
      reorderLevel: 50,
      unitPrice: 0.2,
      location: 'Étagère B-3',
      needsPrescription: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Ibuprofène',
      genericName: 'Ibuprofène',
      category: 'Anti-inflammatoire',
      type: 'tablet',
      dosage: '400mg',
      manufacturer: 'Laboratoire DEF',
      batchNumber: 'IBU-2023-054',
      expiryDate: '2024-08-30',
      stockQuantity: 180,
      reorderLevel: 40,
      unitPrice: 0.3,
      location: 'Étagère B-4',
      needsPrescription: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Lorazépam',
      genericName: 'Lorazépam',
      category: 'Anxiolytique',
      type: 'tablet',
      dosage: '2mg',
      manufacturer: 'Laboratoire MNO',
      batchNumber: 'LRZ-2023-031',
      expiryDate: '2024-12-15',
      stockQuantity: 18,
      reorderLevel: 25,
      unitPrice: 0.8,
      location: 'Armoire sécurisée C-2',
      needsPrescription: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Insuline Rapide',
      genericName: 'Insuline Aspart',
      category: 'Hormone',
      type: 'injection',
      dosage: '100UI/ml',
      manufacturer: 'Laboratoire GHI',
      batchNumber: 'INS-2023-008',
      expiryDate: '2024-03-20',
      stockQuantity: 22,
      reorderLevel: 20,
      unitPrice: 25,
      location: 'Réfrigérateur D-1',
      needsPrescription: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Mock sales data
  const recentSales: PharmacySale[] = [
    {
      id: '1',
      date: '2023-05-10',
      patientId: '1',
      prescriptionId: '101',
      items: [
        { medicationId: '1', quantity: 1, unitPrice: 0.5 },
        { medicationId: '2', quantity: 2, unitPrice: 0.2 }
      ],
      totalAmount: 0.9,
      paymentMethod: 'cash',
      staffId: 's1',
      createdAt: '2023-05-10T10:15:00Z',
      updatedAt: '2023-05-10T10:15:00Z'
    },
    {
      id: '2',
      date: '2023-05-10',
      items: [
        { medicationId: '2', quantity: 1, unitPrice: 0.2 },
        { medicationId: '3', quantity: 1, unitPrice: 0.3 }
      ],
      totalAmount: 0.5,
      paymentMethod: 'card',
      staffId: 's2',
      createdAt: '2023-05-10T14:30:00Z',
      updatedAt: '2023-05-10T14:30:00Z'
    },
    {
      id: '3',
      date: '2023-05-09',
      patientId: '2',
      prescriptionId: '102',
      items: [
        { medicationId: '4', quantity: 1, unitPrice: 0.8 },
      ],
      totalAmount: 0.8,
      paymentMethod: 'insurance',
      staffId: 's1',
      createdAt: '2023-05-09T09:45:00Z',
      updatedAt: '2023-05-09T09:45:00Z'
    }
  ];

  // Filter inventory by search term
  const filteredInventory = medicationInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get low stock items
  const lowStockItems = medicationInventory.filter(item => 
    item.stockQuantity <= item.reorderLevel
  );

  // Form for adding medication
  const addMedicationForm = useForm({
    defaultValues: {
      name: '',
      genericName: '',
      category: '',
      type: 'tablet' as 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'other',
      dosage: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      stockQuantity: 0,
      reorderLevel: 0,
      unitPrice: 0,
      location: '',
      needsPrescription: false,
    }
  });

  // Handle add medication form submission
  const handleAddMedication = (data: any) => {
    console.log('New medication:', data);
    toast.success(`${data.name} a été ajouté à l'inventaire`);
    setIsAddMedicationDialogOpen(false);
    addMedicationForm.reset();
  };

  // Render medication type badge
  const getMedicationTypeBadge = (type: string) => {
    switch (type) {
      case 'tablet':
        return <Badge className="bg-blue-100 text-blue-800">Comprimé</Badge>;
      case 'capsule':
        return <Badge className="bg-green-100 text-green-800">Gélule</Badge>;
      case 'liquid':
        return <Badge className="bg-purple-100 text-purple-800">Liquide</Badge>;
      case 'injection':
        return <Badge className="bg-red-100 text-red-800">Injectable</Badge>;
      case 'topical':
        return <Badge className="bg-amber-100 text-amber-800">Topique</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Autre</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pharmacie</h1>
        <div className="flex items-center space-x-2">
          {lowStockItems.length > 0 && (
            <Button variant="outline" onClick={() => setIsLowStockDialogOpen(true)} className="text-amber-600 border-amber-300 hover:text-amber-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {lowStockItems.length} produits en stock bas
            </Button>
          )}
          <Button onClick={() => setIsAddMedicationDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un médicament
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">
            <PackageOpen className="h-4 w-4 mr-2" />
            Inventaire
          </TabsTrigger>
          <TabsTrigger value="sales">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ventes
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <FileText className="h-4 w-4 mr-2" />
            Ordonnances
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Inventaire des médicaments</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un médicament..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">
                        {medication.name}
                        {medication.needsPrescription && (
                          <span className="ml-2 text-xs text-red-500">Ordonnance</span>
                        )}
                      </TableCell>
                      <TableCell>{medication.category}</TableCell>
                      <TableCell>{getMedicationTypeBadge(medication.type)}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{format(new Date(medication.expiryDate), 'MM/yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={
                            medication.stockQuantity <= medication.reorderLevel 
                              ? "text-red-600 font-medium" 
                              : ""
                          }>
                            {medication.stockQuantity}
                          </span>
                          {medication.stockQuantity <= medication.reorderLevel && (
                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{medication.unitPrice.toFixed(2)} €</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon">
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Ventes récentes</CardTitle>
                <Button>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Nouvelle vente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Ordonnance</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paiement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{format(new Date(sale.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>#{sale.id}</TableCell>
                      <TableCell>
                        {sale.prescriptionId ? (
                          <Badge className="bg-blue-100 text-blue-800">Avec ordonnance</Badge>
                        ) : (
                          <Badge variant="outline">Sans ordonnance</Badge>
                        )}
                      </TableCell>
                      <TableCell>{sale.items.length} article(s)</TableCell>
                      <TableCell>{sale.totalAmount.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sale.paymentMethod === 'cash' && 'Espèces'}
                          {sale.paymentMethod === 'card' && 'Carte bancaire'}
                          {sale.paymentMethod === 'insurance' && 'Assurance'}
                          {sale.paymentMethod === 'other' && 'Autre'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Gestion des ordonnances</h3>
                <p className="text-muted-foreground max-w-md">
                  Cette section vous permettra de gérer les ordonnances, de les visualiser et d'assurer 
                  leur traitement par la pharmacie.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex flex-col items-center justify-center h-full">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Graphique de répartition des médicaments par catégorie
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ventes mensuelles</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex flex-col items-center justify-center h-full">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Graphique des ventes mensuelles
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Medication Dialog */}
      <Dialog open={isAddMedicationDialogOpen} onOpenChange={setIsAddMedicationDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Pill className="h-5 w-5 mr-2" />
              Ajouter un médicament
            </DialogTitle>
          </DialogHeader>
          <Form {...addMedicationForm}>
            <form onSubmit={addMedicationForm.handleSubmit(handleAddMedication)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addMedicationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom commercial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addMedicationForm.control}
                  name="genericName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom générique</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom générique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addMedicationForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Input placeholder="Catégorie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addMedicationForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tablet">Comprimé</SelectItem>
                          <SelectItem value="capsule">Gélule</SelectItem>
                          <SelectItem value="liquid">Liquide</SelectItem>
                          <SelectItem value="injection">Injectable</SelectItem>
                          <SelectItem value="topical">Topique</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addMedicationForm.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addMedicationForm.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricant</FormLabel>
                      <FormControl>
                        <Input placeholder="Fabricant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addMedicationForm.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de lot</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro de lot" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addMedicationForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'expiration</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={addMedicationForm.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité en stock</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addMedicationForm.control}
                  name="reorderLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seuil de réapprovisionnement</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addMedicationForm.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix unitaire (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addMedicationForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emplacement</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Étagère A-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addMedicationForm.control}
                  name="needsPrescription"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div>
                        <FormLabel>Nécessite une ordonnance</FormLabel>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddMedicationDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Low Stock Alert Dialog */}
      <Dialog open={isLowStockDialogOpen} onOpenChange={setIsLowStockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Produits en stock bas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Médicament</TableHead>
                  <TableHead>Stock actuel</TableHead>
                  <TableHead>Seuil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-red-600">{item.stockQuantity}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsLowStockDialogOpen(false)}>
                Fermer
              </Button>
              <Button>
                Créer une commande
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PharmacyPage;
