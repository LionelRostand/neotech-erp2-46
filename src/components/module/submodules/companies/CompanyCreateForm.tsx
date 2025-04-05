
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { companyService } from './services/companyService';

const CompanyCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const companyData = {
        name: formData.get('name') as string,
        address: {
          street: formData.get('street') as string,
          city: formData.get('city') as string,
          postalCode: formData.get('postalCode') as string,
          country: formData.get('country') as string
        },
        siret: formData.get('siret') as string,
        industry: formData.get('industry') as string,
        size: formData.get('size') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        website: formData.get('website') as string,
        description: formData.get('description') as string,
        status: 'active',
        employeesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Submit to service
      await companyService.getCompanies(); // Simulate API call
      
      toast.success('Entreprise créée avec succès');
      navigate('/modules/companies/list');
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      toast.error('Échec de la création de l\'entreprise');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/modules/companies/list');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Créer une nouvelle entreprise</h2>
        <p className="text-gray-500">Remplissez les informations ci-dessous pour créer une nouvelle entreprise</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations générales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input id="name" name="name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET *</Label>
                  <Input id="siret" name="siret" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Secteur d'activité</Label>
                  <Select name="industry">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technologie</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Santé</SelectItem>
                      <SelectItem value="education">Éducation</SelectItem>
                      <SelectItem value="retail">Commerce</SelectItem>
                      <SelectItem value="manufacturing">Industrie</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Taille de l'entreprise</Label>
                  <Select name="size">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employés</SelectItem>
                      <SelectItem value="11-50">11-50 employés</SelectItem>
                      <SelectItem value="51-200">51-200 employés</SelectItem>
                      <SelectItem value="201-500">201-500 employés</SelectItem>
                      <SelectItem value="501-1000">501-1000 employés</SelectItem>
                      <SelectItem value="1000+">1000+ employés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Coordonnées</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" name="phone" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input id="website" name="website" type="url" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adresse</h3>
              
              <div className="space-y-2">
                <Label htmlFor="street">Rue *</Label>
                <Input id="street" name="street" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input id="city" name="city" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input id="postalCode" name="postalCode" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Pays *</Label>
                  <Input id="country" name="country" defaultValue="France" required />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Description de l'entreprise..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Création en cours...' : 'Créer l\'entreprise'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyCreateForm;
