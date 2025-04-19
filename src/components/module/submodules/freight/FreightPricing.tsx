import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DollarSign, 
  FileText, 
  Plus, 
  Search, 
  RefreshCcw, 
  Download,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ShipIcon,
  Package
} from 'lucide-react';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { formatCurrency as formatCurrencyLib } from '@/lib/formatters';

// Utility function to format currency with a default EUR currency code
const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Date formatter
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

interface PriceItem {
  id: string;
  name: string;
  description?: string;
  type: 'standard' | 'custom' | 'contract';
  price: number;
  unit: string;
  minQty?: number;
  maxQty?: number;
  validFrom?: string;
  validTo?: string;
  discount?: number;
  currency: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
}

interface PriceCategory {
  id: string;
  name: string;
  description?: string;
  count: number;
}

const FreightPricing: React.FC = () => {
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [filteredPriceItems, setFilteredPriceItems] = useState<PriceItem[]>([]);
  const [priceCategories, setPriceCategories] = useState<PriceCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPriceItem, setSelectedPriceItem] = useState<PriceItem | null>(null);
  const { toast } = useToast();

  const fetchPriceItems = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFreightCollectionData<PriceItem>('PRICING');
      setPriceItems(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading price items:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les tarifs. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const fetchPriceCategories = async () => {
    try {
      const data = await fetchFreightCollectionData<PriceCategory>('PRICING_CATEGORIES');
      setPriceCategories(data);
    } catch (error) {
      console.error("Error loading price categories:", error);
    }
  };

  useEffect(() => {
    fetchPriceItems();
    fetchPriceCategories();
  }, [toast]);

  useEffect(() => {
    let filtered = [...priceItems];

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        item.type.toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredPriceItems(filtered);
  }, [priceItems, searchQuery, categoryFilter, statusFilter]);

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: PriceItem) => {
    setSelectedPriceItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Fonction en développement",
      description: "La suppression des tarifs sera disponible prochainement.",
    });
  };

  const handleDuplicate = (item: PriceItem) => {
    toast({
      title: "Fonction en développement",
      description: "La duplication des tarifs sera disponible prochainement.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Téléchargement lancé",
      description: "Le fichier sera téléchargé prochainement.",
    });
  };

  const handleRefresh = () => {
    fetchPriceItems();
    toast({
      title: "Tarifs mis à jour",
      description: "Les tarifs ont été mis à jour avec succès.",
    });
  };

  const handleStatusChange = (item: PriceItem, newStatus: 'active' | 'inactive' | 'pending') => {
    toast({
      title: "Fonction en développement",
      description: `Le statut du tarif ${item.name} sera mis à jour prochainement.`,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement des tarifs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gestion des Tarifs</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={handleRefresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Rafraîchir
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Tarif
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un tarif..."
              className="pl-8 w-full lg:w-[350px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {priceCategories.map(category => (
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPriceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{formatCurrency(item.price, item.currency)}</TableCell>
                <TableCell>
                  {item.status === 'active' && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                      Actif
                    </div>
                  )}
                  {item.status === 'inactive' && (
                    <div className="flex items-center">
                      <XCircle className="w-4 h-4 mr-1 text-red-500" />
                      Inactif
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1 text-gray-500" />
                      En attente
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Price Item Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouveau Tarif</DialogTitle>
            <DialogDescription>
              Ajouter un nouveau tarif à la liste.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>Formulaire de création de tarif à venir...</p>
          </div>
          <DialogFooter>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Price Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le Tarif</DialogTitle>
            <DialogDescription>
              Modifier les informations du tarif sélectionné.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>Formulaire de modification de tarif à venir...</p>
          </div>
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreightPricing;
