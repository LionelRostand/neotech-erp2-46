
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Tag, 
  PlusCircle, 
  Trash2, 
  Save, 
  Percent,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSalonServices } from "../../../salon/services/hooks/useSalonServices";
import { SalonService } from "../../../../submodules/salon/types/salon-types";

interface PricingSettingsProps {
  onSave: () => void;
}

const PricingSettings: React.FC<PricingSettingsProps> = ({ onSave }) => {
  const { toast } = useToast();
  const { services } = useSalonServices();
  
  const [serviceCategories, setServiceCategories] = useState([
    { id: "coupe", name: "Coupe" },
    { id: "coloration", name: "Coloration" },
    { id: "technique", name: "Technique" },
    { id: "coiffage", name: "Coiffage" },
    { id: "homme", name: "Homme" },
    { id: "soin", name: "Soin" }
  ]);

  const [promotions, setPromotions] = useState([
    { 
      id: "1", 
      name: "Offre de Bienvenue", 
      code: "BIENVENUE", 
      discount: 15, 
      limitUses: 100,
      startDate: "2023-10-01", 
      endDate: "2023-12-31", 
      isActive: true,
      applicableCategories: ["coupe", "coloration"]
    },
    { 
      id: "2", 
      name: "Offre Fidélité", 
      code: "FIDELE", 
      discount: 10, 
      limitUses: 200,
      startDate: "2023-09-01", 
      endDate: "2023-12-31", 
      isActive: true,
      applicableCategories: ["coupe", "coloration", "technique", "coiffage"]
    }
  ]);

  const [seasonalRates, setSeasonalRates] = useState([
    { id: "1", name: "Haute saison (été)", startDate: "2024-06-15", endDate: "2024-08-31", multiplier: 1.2 },
    { id: "2", name: "Fêtes de fin d'année", startDate: "2024-12-15", endDate: "2024-12-31", multiplier: 1.15 }
  ]);

  const [enableSeasonalRates, setEnableSeasonalRates] = useState(true);

  const handleAddPromotion = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const newPromo = {
      id: Date.now().toString(),
      name: "Nouvelle Promotion",
      code: "PROMO" + Date.now().toString().slice(-4),
      discount: 10,
      limitUses: 50,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
      isActive: true,
      applicableCategories: []
    };
    
    setPromotions([...promotions, newPromo]);
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  const updatePromotion = (id: string, field: keyof typeof promotions[0], value: any) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? { ...promo, [field]: value } : promo
    ));
  };

  const toggleCategoryForPromotion = (promoId: string, categoryId: string) => {
    setPromotions(promotions.map(promo => {
      if (promo.id === promoId) {
        const updatedCategories = promo.applicableCategories.includes(categoryId)
          ? promo.applicableCategories.filter(catId => catId !== categoryId)
          : [...promo.applicableCategories, categoryId];
        
        return { ...promo, applicableCategories: updatedCategories };
      }
      return promo;
    }));
  };

  const handleAddSeasonalRate = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const newSeason = {
      id: Date.now().toString(),
      name: "Nouvelle période",
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
      multiplier: 1.1
    };
    
    setSeasonalRates([...seasonalRates, newSeason]);
  };

  const updateSeasonalRate = (id: string, field: keyof typeof seasonalRates[0], value: any) => {
    setSeasonalRates(seasonalRates.map(season => 
      season.id === id ? { ...season, [field]: value } : season
    ));
  };

  const handleDeleteSeasonalRate = (id: string) => {
    setSeasonalRates(seasonalRates.filter(season => season.id !== id));
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: "category-" + Date.now(),
      name: "Nouvelle catégorie"
    };
    setServiceCategories([...serviceCategories, newCategory]);
  };

  const updateCategory = (index: number, name: string) => {
    const updatedCategories = [...serviceCategories];
    updatedCategories[index].name = name;
    setServiceCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    setServiceCategories(serviceCategories.filter(cat => cat.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Tarifs des services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            <span>Tarifs des Services</span>
          </CardTitle>
          <CardDescription>
            Gérez les tarifs de vos services par catégorie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du service</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Durée (min)</TableHead>
                  <TableHead>Prix (€)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.map((service: SalonService) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={service.duration} className="w-20" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={service.price} className="w-20" step="0.5" />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Catégories de services</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {serviceCategories.map((category, index) => (
                <div key={category.id} className="flex items-center space-x-2 border rounded-md p-2">
                  <Input 
                    value={category.name} 
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="w-40" 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleAddCategory}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Ajouter</span>
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Enregistrer les tarifs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des promotions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            <span>Gestion des Promotions</span>
          </CardTitle>
          <CardDescription>
            Créez et gérez des promotions saisonnières ou pour des occasions spéciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4">
              {promotions.map(promo => (
                <div key={promo.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant={promo.isActive ? "default" : "outline"}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <h3 className="font-medium">{promo.name}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeletePromotion(promo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor={`promo-name-${promo.id}`}>Nom de la promotion</Label>
                      <Input 
                        id={`promo-name-${promo.id}`} 
                        value={promo.name}
                        onChange={(e) => updatePromotion(promo.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`promo-code-${promo.id}`}>Code promo</Label>
                      <Input 
                        id={`promo-code-${promo.id}`} 
                        value={promo.code}
                        onChange={(e) => updatePromotion(promo.id, 'code', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`promo-discount-${promo.id}`}>Réduction (%)</Label>
                      <Input 
                        id={`promo-discount-${promo.id}`} 
                        type="number" 
                        value={promo.discount}
                        onChange={(e) => updatePromotion(promo.id, 'discount', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`promo-limit-${promo.id}`}>Limite d'utilisation</Label>
                      <Input 
                        id={`promo-limit-${promo.id}`} 
                        type="number" 
                        value={promo.limitUses}
                        onChange={(e) => updatePromotion(promo.id, 'limitUses', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`promo-start-${promo.id}`}>Date de début</Label>
                      <Input 
                        id={`promo-start-${promo.id}`} 
                        type="date" 
                        value={promo.startDate}
                        onChange={(e) => updatePromotion(promo.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`promo-end-${promo.id}`}>Date de fin</Label>
                      <Input 
                        id={`promo-end-${promo.id}`} 
                        type="date" 
                        value={promo.endDate}
                        onChange={(e) => updatePromotion(promo.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id={`promo-active-${promo.id}`}
                          checked={promo.isActive}
                          onCheckedChange={(checked) => updatePromotion(promo.id, 'isActive', checked)}
                        />
                        <Label htmlFor={`promo-active-${promo.id}`}>Promotion active</Label>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Catégories applicables</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {serviceCategories.map(category => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`promo-cat-${promo.id}-${category.id}`}
                              checked={promo.applicableCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategoryForPromotion(promo.id, category.id)}
                            />
                            <label htmlFor={`promo-cat-${promo.id}-${category.id}`}>{category.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleAddPromotion}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Ajouter une promotion</span>
              </Button>
              <Button onClick={onSave}>Enregistrer les promotions</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarification saisonnière */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Tarification Saisonnière</span>
          </CardTitle>
          <CardDescription>
            Ajustez automatiquement vos tarifs en fonction des saisons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 py-2">
              <Switch 
                id="seasonal-pricing"
                checked={enableSeasonalRates}
                onCheckedChange={setEnableSeasonalRates}
              />
              <div className="grid gap-0.5">
                <Label htmlFor="seasonal-pricing">Activer la tarification saisonnière</Label>
                <p className="text-sm text-muted-foreground">
                  Les tarifs seront automatiquement ajustés selon les périodes configurées
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Multiplicateur de tarif</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasonalRates.map(season => (
                    <TableRow key={season.id}>
                      <TableCell>
                        <Input 
                          value={season.name} 
                          onChange={(e) => updateSeasonalRate(season.id, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="date" 
                          value={season.startDate}
                          onChange={(e) => updateSeasonalRate(season.id, 'startDate', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="date" 
                          value={season.endDate}
                          onChange={(e) => updateSeasonalRate(season.id, 'endDate', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={season.multiplier} 
                          step="0.05"
                          min="1"
                          max="2"
                          onChange={(e) => updateSeasonalRate(season.id, 'multiplier', Number(e.target.value))}
                          className="w-24" 
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteSeasonalRate(season.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleAddSeasonalRate}
                disabled={!enableSeasonalRates}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Ajouter une période</span>
              </Button>
              <Button onClick={onSave}>Enregistrer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSettings;
