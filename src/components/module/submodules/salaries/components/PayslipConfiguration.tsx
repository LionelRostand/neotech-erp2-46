
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Plus, Trash } from 'lucide-react';

interface DeductionTemplate {
  id: string;
  name: string;
  label: string;
  defaultRate: number;
  isEnabled: boolean;
}

interface CompanyInfoTemplate {
  name: string;
  address: string;
  siret: string;
  logo?: string;
}

const defaultDeductions: DeductionTemplate[] = [
  { id: '1', name: 'csg_deductible', label: 'CSG déductible', defaultRate: 6.8, isEnabled: true },
  { id: '2', name: 'csg_non_deductible', label: 'CSG/CRDS non déductible', defaultRate: 2.9, isEnabled: true },
  { id: '3', name: 'health_insurance', label: 'Sécurité sociale - Maladie', defaultRate: 0.75, isEnabled: true },
  { id: '4', name: 'retirement', label: 'Assurance vieillesse', defaultRate: 4.1, isEnabled: true },
  { id: '5', name: 'complementary_retirement', label: 'Retraite complémentaire', defaultRate: 3.8, isEnabled: true },
  { id: '6', name: 'unemployment', label: 'Assurance chômage', defaultRate: 2.4, isEnabled: true },
];

const PayslipConfiguration: React.FC = () => {
  const [deductions, setDeductions] = useState<DeductionTemplate[]>(defaultDeductions);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoTemplate>({
    name: 'Votre Entreprise SARL',
    address: '1 Rue des Entrepreneurs, 75002 Paris',
    siret: '987 654 321 00098',
  });
  const [newDeduction, setNewDeduction] = useState<DeductionTemplate>({
    id: '',
    name: '',
    label: '',
    defaultRate: 0,
    isEnabled: true,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleDeductionChange = (id: string, field: keyof DeductionTemplate, value: any) => {
    setDeductions(deductions.map(deduction => 
      deduction.id === id ? { ...deduction, [field]: value } : deduction
    ));
  };

  const handleCompanyInfoChange = (field: keyof CompanyInfoTemplate, value: string) => {
    setCompanyInfo({
      ...companyInfo,
      [field]: value
    });
  };

  const handleSaveSettings = () => {
    // Here you would typically save to Firestore or local storage
    // For now, we'll just show a success toast
    toast.success('Configuration des fiches de paie sauvegardée');
  };

  const handleDeleteDeduction = (id: string) => {
    setDeductions(deductions.filter(deduction => deduction.id !== id));
    toast.success('Cotisation supprimée');
  };

  const handleAddNewDeduction = () => {
    if (!newDeduction.label || !newDeduction.name) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const newId = (Math.max(...deductions.map(d => parseInt(d.id))) + 1).toString();
    setDeductions([...deductions, {...newDeduction, id: newId}]);
    setNewDeduction({
      id: '',
      name: '',
      label: '',
      defaultRate: 0,
      isEnabled: true,
    });
    setIsAddingNew(false);
    toast.success('Nouvelle cotisation ajoutée');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuration des fiches de paie</h2>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="deductions">Cotisations</TabsTrigger>
          <TabsTrigger value="template">Modèle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                <Input 
                  id="company-name" 
                  value={companyInfo.name} 
                  onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-address">Adresse</Label>
                <Input 
                  id="company-address" 
                  value={companyInfo.address} 
                  onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-siret">Numéro SIRET</Label>
                <Input 
                  id="company-siret" 
                  value={companyInfo.siret} 
                  onChange={(e) => handleCompanyInfoChange('siret', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deductions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Cotisations sociales</CardTitle>
              <Button 
                size="sm" 
                onClick={() => setIsAddingNew(true)}
                disabled={isAddingNew}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingNew && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-sm font-medium mb-3">Nouvelle cotisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-label">Libellé</Label>
                      <Input 
                        id="new-label" 
                        value={newDeduction.label} 
                        onChange={(e) => setNewDeduction({...newDeduction, label: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Nom technique</Label>
                      <Input 
                        id="new-name" 
                        value={newDeduction.name} 
                        onChange={(e) => setNewDeduction({...newDeduction, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-rate">Taux par défaut (%)</Label>
                      <Input 
                        id="new-rate" 
                        type="number" 
                        step="0.01"
                        value={newDeduction.defaultRate} 
                        onChange={(e) => setNewDeduction({...newDeduction, defaultRate: parseFloat(e.target.value)})}
                      />
                    </div>
                    
                    <div className="flex items-end space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="new-enabled"
                          checked={newDeduction.isEnabled} 
                          onCheckedChange={(checked) => setNewDeduction({...newDeduction, isEnabled: checked})}
                        />
                        <Label htmlFor="new-enabled">Activé</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddNewDeduction}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {deductions.map((deduction) => (
                  <div key={deduction.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-medium">{deduction.label}</div>
                        <div className="text-sm text-muted-foreground">{deduction.name}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive" 
                        onClick={() => handleDeleteDeduction(deduction.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`rate-${deduction.id}`}>Taux (%)</Label>
                        <Input 
                          id={`rate-${deduction.id}`} 
                          type="number" 
                          step="0.01"
                          value={deduction.defaultRate} 
                          onChange={(e) => handleDeductionChange(deduction.id, 'defaultRate', parseFloat(e.target.value))}
                        />
                      </div>
                      
                      <div className="flex items-end space-x-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`enabled-${deduction.id}`}
                            checked={deduction.isEnabled} 
                            onCheckedChange={(checked) => handleDeductionChange(deduction.id, 'isEnabled', checked)}
                          />
                          <Label htmlFor={`enabled-${deduction.id}`}>Activé</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation du modèle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-style">Style du modèle</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="detailed">Détaillé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Éléments à afficher</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="show-logo" defaultChecked />
                    <Label htmlFor="show-logo">Logo de l'entreprise</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="show-leave-balance" defaultChecked />
                    <Label htmlFor="show-leave-balance">Solde des congés</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="show-annual-cumulative" defaultChecked />
                    <Label htmlFor="show-annual-cumulative">Cumuls annuels</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="show-verification-footer" defaultChecked />
                    <Label htmlFor="show-verification-footer">Pied de page légal</Label>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label>Personnalisation des textes</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="header-title">Titre du bulletin</Label>
                    <Input id="header-title" defaultValue="BULLETIN DE PAIE" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="footer-text">Texte du pied de page</Label>
                    <Input id="footer-text" defaultValue="Document à conserver sans limitation de durée" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayslipConfiguration;
