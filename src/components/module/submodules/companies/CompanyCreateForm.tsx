import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompanyService } from './services/companyService';
import { Company } from './types';
import { toast } from 'sonner';

interface FormState {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  siret: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
  size: string;
  status: 'active' | 'inactive' | 'pending';
}

const initialFormState: FormState = {
  name: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
  siret: '',
  phone: '',
  email: '',
  website: '',
  industry: '',
  size: '',
  status: 'active'
};

const CompanyCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const companyService = useCompanyService();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormState>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Le nom de l'entreprise est requis");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare company data omitting id, createdAt, and updatedAt
      const companyData: Omit<Company, "id" | "createdAt" | "updatedAt"> = {
        name: formData.name,
        address: {
          street: formData.street || '',
          city: formData.city || '',
          postalCode: formData.postalCode || '',
          country: formData.country || ''
        },
        siret: formData.siret || '',
        logo: '',
        logoUrl: '',
        phone: formData.phone || '',
        email: formData.email || '',
        website: formData.website || '',
        industry: formData.industry || '',
        size: formData.size || '',
        status: 'active',
        employeesCount: 0
      };
      
      const savedCompany = await companyService.createCompany(companyData);
      
      if (savedCompany) {
        toast.success("Entreprise créée avec succès");
        navigate('/modules/employees/companies');
      } else {
        toast.error("Erreur lors de la création de l'entreprise");
      }
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("Erreur lors de la création de l'entreprise");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une entreprise</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="address">Adresse</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="general">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de l'entreprise</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nom de l'entreprise" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input 
                    type="text" 
                    id="siret" 
                    name="siret"
                    value={formData.siret}
                    onChange={handleInputChange}
                    placeholder="Numéro SIRET" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Secteur d'activité</Label>
                  <Input 
                    type="text" 
                    id="industry" 
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="Secteur d'activité" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="size">Taille de l'entreprise</Label>
                  <Input 
                    type="text" 
                    id="size" 
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="Taille de l'entreprise" 
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="address">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="street">Rue</Label>
                  <Input 
                    type="text" 
                    id="street" 
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Rue" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    type="text" 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ville" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input 
                    type="text" 
                    id="postalCode" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Code postal" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input 
                    type="text" 
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Pays" 
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="contact">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Téléphone" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input 
                    type="url" 
                    id="website" 
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Site web" 
                  />
                </div>
              </div>
            </TabsContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" onClick={() => navigate('/modules/employees/companies')}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompanyCreateForm;
