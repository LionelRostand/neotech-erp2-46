
import React, { useState } from 'react';
import { Plus, Trash2, Calculator, BarChart4, ArrowUpDown, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  PricingDialog, 
  PromotionDialog,
  ActionButtons,
  PriceCalculator
} from './helpers/FreightActionHelpers';

const FreightPricing: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("price-models");
  const [showNewPriceModel, setShowNewPriceModel] = useState(false);
  const [showNewPromotion, setShowNewPromotion] = useState(false);
  const [editingPriceModel, setEditingPriceModel] = useState<any>(null);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  
  // Sample pricing models
  const pricingModels = [
    { 
      id: 1, 
      name: "Standard", 
      basePrice: 15,
      weightFactor: 1.2, 
      distanceFactor: 0.5, 
      volumeFactor: 5, 
      description: "Tarification standard pour les expéditions régulières" 
    },
    { 
      id: 2, 
      name: "Express", 
      basePrice: 30,
      weightFactor: 2, 
      distanceFactor: 0.8, 
      volumeFactor: 7, 
      description: "Tarification express pour les livraisons urgentes" 
    },
    { 
      id: 3, 
      name: "Économique", 
      basePrice: 10,
      weightFactor: 0.8, 
      distanceFactor: 0.3, 
      volumeFactor: 3, 
      description: "Tarification économique pour les envois non urgents" 
    },
    { 
      id: 4, 
      name: "International", 
      basePrice: 50,
      weightFactor: 3, 
      distanceFactor: 0.2, 
      volumeFactor: 10, 
      description: "Tarification pour les expéditions internationales" 
    }
  ];
  
  // Sample promotions
  const promotions = [
    { 
      id: 1, 
      name: "Promotion d'été", 
      code: "ETE2023", 
      discount: 15, 
      startDate: "2023-06-01", 
      endDate: "2023-08-31", 
      status: "active",
      description: "Réduction estivale pour tous les clients"
    },
    { 
      id: 2, 
      name: "Black Friday", 
      code: "BLACK2023", 
      discount: 25, 
      startDate: "2023-11-24", 
      endDate: "2023-11-27", 
      status: "scheduled",
      description: "Promotion spéciale pour le Black Friday"
    },
    { 
      id: 3, 
      name: "Nouveaux clients", 
      code: "WELCOME", 
      discount: 10, 
      startDate: "2023-01-01", 
      endDate: "2023-12-31", 
      status: "active",
      description: "Réduction pour les nouveaux clients"
    }
  ];
  
  const handleEditPriceModel = (model: any) => {
    setEditingPriceModel(model);
    setShowNewPriceModel(true);
  };
  
  const handleDeletePriceModel = (modelId: number) => {
    toast({
      title: "Modèle de tarification supprimé",
      description: "Le modèle de tarification a été supprimé avec succès.",
    });
  };
  
  const handleSavePriceModel = (model: any) => {
    toast({
      title: editingPriceModel ? "Modèle de tarification modifié" : "Modèle de tarification ajouté",
      description: `Le modèle de tarification "${model.name || 'Nouveau modèle'}" a été ${editingPriceModel ? 'modifié' : 'ajouté'} avec succès.`,
    });
    setEditingPriceModel(null);
  };
  
  const handleEditPromotion = (promotion: any) => {
    setEditingPromotion(promotion);
    setShowNewPromotion(true);
  };
  
  const handleDeletePromotion = (promotionId: number) => {
    toast({
      title: "Promotion supprimée",
      description: "La promotion a été supprimée avec succès.",
    });
  };
  
  const handleSavePromotion = (promotion: any) => {
    toast({
      title: editingPromotion ? "Promotion modifiée" : "Promotion ajoutée",
      description: `La promotion "${promotion.name || 'Nouvelle promotion'}" a été ${editingPromotion ? 'modifiée' : 'ajoutée'} avec succès.`,
    });
    setEditingPromotion(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tarification et Facturation</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="price-models" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>Modèles de tarification</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span>Codes promotionnels</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Calculateur de tarifs</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Modèles de tarification */}
        <TabsContent value="price-models" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Modèles de tarification</CardTitle>
                  <CardDescription>
                    Gérez les différents modèles de tarification pour vos expéditions
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingPriceModel(null);
                  setShowNewPriceModel(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau modèle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prix de base</TableHead>
                    <TableHead>Facteur poids</TableHead>
                    <TableHead>Facteur distance</TableHead>
                    <TableHead>Facteur volume</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>{model.basePrice} €</TableCell>
                      <TableCell>{model.weightFactor} €/kg</TableCell>
                      <TableCell>{model.distanceFactor} €/km</TableCell>
                      <TableCell>{model.volumeFactor} €/m³</TableCell>
                      <TableCell className="max-w-[200px] truncate">{model.description}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons 
                          onEdit={() => handleEditPriceModel(model)}
                          onDelete={() => handleDeletePriceModel(model.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Codes promotionnels */}
        <TabsContent value="promotions" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Codes promotionnels</CardTitle>
                  <CardDescription>
                    Gérez les différentes promotions et réductions pour vos clients
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingPromotion(null);
                  setShowNewPromotion(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle promotion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Réduction</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.name}</TableCell>
                      <TableCell><code>{promo.code}</code></TableCell>
                      <TableCell>{promo.discount}%</TableCell>
                      <TableCell>{promo.startDate}</TableCell>
                      <TableCell>{promo.endDate}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            promo.status === 'active' 
                              ? 'default' 
                              : promo.status === 'scheduled' 
                                ? 'outline' 
                                : 'secondary'
                          }
                        >
                          {promo.status === 'active' ? 'Actif' : promo.status === 'scheduled' ? 'Planifié' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons 
                          onEdit={() => handleEditPromotion(promo)}
                          onDelete={() => handleDeletePromotion(promo.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calculateur de tarifs */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calculateur de tarifs</CardTitle>
              <CardDescription>
                Calculez le tarif d'une expédition en fonction de ses caractéristiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      {showNewPriceModel && (
        <PricingDialog 
          isOpen={showNewPriceModel}
          onClose={() => {
            setShowNewPriceModel(false);
            setEditingPriceModel(null);
          }}
          pricing={editingPriceModel}
          onSave={handleSavePriceModel}
        />
      )}
      
      {showNewPromotion && (
        <PromotionDialog 
          isOpen={showNewPromotion}
          onClose={() => {
            setShowNewPromotion(false);
            setEditingPromotion(null);
          }}
          promotion={editingPromotion}
          onSave={handleSavePromotion}
        />
      )}
    </div>
  );
};

export default FreightPricing;
