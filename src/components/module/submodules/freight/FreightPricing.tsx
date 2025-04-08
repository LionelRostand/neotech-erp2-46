
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Search, Plus, Filter, Download, Route, TrendingUp } from 'lucide-react';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';

interface PricingRule {
  id: string;
  name: string;
  description?: string;
  origin: string;
  destination: string;
  transportType: 'road' | 'sea' | 'air' | 'rail' | 'multimodal';
  basePrice: number;
  currency: string;
  pricePerKg?: number;
  pricePerKm?: number;
  pricePerCbm?: number;
  minWeight?: number;
  maxWeight?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  active: boolean;
}

const FreightPricing: React.FC = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [transportTypeFilter, setTransportTypeFilter] = useState('all');
  const { toast } = useToast();

  // Fetch pricing data
  useEffect(() => {
    const loadPricingRules = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFreightCollectionData<PricingRule>('PRICING');
        setPricingRules(data);
        setFilteredRules(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading pricing rules:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les règles de tarification. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    loadPricingRules();
  }, [toast]);

  // Filter pricing rules based on search term and transport type filter
  useEffect(() => {
    if (!pricingRules) return;
    
    let filtered = [...pricingRules];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(rule => 
        rule.name.toLowerCase().includes(term) || 
        rule.origin.toLowerCase().includes(term) ||
        rule.destination.toLowerCase().includes(term) ||
        (rule.description && rule.description.toLowerCase().includes(term))
      );
    }
    
    // Apply transport type filter
    if (transportTypeFilter !== 'all') {
      filtered = filtered.filter(rule => rule.transportType === transportTypeFilter);
    }
    
    setFilteredRules(filtered);
  }, [pricingRules, searchTerm, transportTypeFilter]);

  const handleAddPricingRule = () => {
    toast({
      title: "Fonction en développement",
      description: "L'ajout de règles de tarification sera disponible prochainement.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "L'export des données sera disponible prochainement.",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getTransportTypeIcon = (type: string) => {
    switch (type) {
      case 'road':
        return <Route className="h-4 w-4 mr-2" />;
      case 'sea':
        return <TrendingUp className="h-4 w-4 mr-2" />;
      case 'air':
        return <TrendingUp className="h-4 w-4 mr-2" />;
      case 'rail':
        return <Route className="h-4 w-4 mr-2" />;
      case 'multimodal':
        return <Route className="h-4 w-4 mr-2" />;
      default:
        return <Route className="h-4 w-4 mr-2" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement des tarifs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gestion des Tarifs</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={handleAddPricingRule}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Règle
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher une règle de tarification..."
              className="pl-8 w-full lg:w-[350px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs 
            value={transportTypeFilter} 
            onValueChange={setTransportTypeFilter}
            className="w-full lg:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="road">Route</TabsTrigger>
              <TabsTrigger value="sea">Maritime</TabsTrigger>
              <TabsTrigger value="air">Aérien</TabsTrigger>
              <TabsTrigger value="rail">Ferroviaire</TabsTrigger>
              <TabsTrigger value="multimodal">Multimodal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Origine</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Prix de base</TableHead>
                <TableHead>Par Kg</TableHead>
                <TableHead>Par Km</TableHead>
                <TableHead>Par m³</TableHead>
                <TableHead>Valide du</TableHead>
                <TableHead>Au</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => (
                  <TableRow key={rule.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getTransportTypeIcon(rule.transportType)}
                        {rule.transportType}
                      </div>
                    </TableCell>
                    <TableCell>{rule.origin}</TableCell>
                    <TableCell>{rule.destination}</TableCell>
                    <TableCell>{formatCurrency(rule.basePrice, rule.currency)}</TableCell>
                    <TableCell>{rule.pricePerKg ? formatCurrency(rule.pricePerKg, rule.currency) : '-'}</TableCell>
                    <TableCell>{rule.pricePerKm ? formatCurrency(rule.pricePerKm, rule.currency) : '-'}</TableCell>
                    <TableCell>{rule.pricePerCbm ? formatCurrency(rule.pricePerCbm, rule.currency) : '-'}</TableCell>
                    <TableCell>{formatDate(rule.effectiveFrom)}</TableCell>
                    <TableCell>{rule.effectiveTo ? formatDate(rule.effectiveTo) : 'Indéfini'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${rule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {rule.active ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center h-24 text-muted-foreground">
                    Aucune règle de tarification trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default FreightPricing;
