
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  Save,
  ShieldCheck
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Insurance } from '../../types/health-types';
import { Separator } from "@/components/ui/separator";

interface InsuranceCompanyDetailProps {
  insurance: Insurance | null;
  onBack: () => void;
  onSave: (data: Insurance) => void;
}

const InsuranceCompanyDetail: React.FC<InsuranceCompanyDetailProps> = ({
  insurance,
  onBack,
  onSave
}) => {
  const [formData, setFormData] = useState<Insurance>(
    insurance || {
      id: '',
      name: '',
      type: 'private',
      coverageLevel: 'basic',
      contact: {
        address: '',
        phone: '',
        email: ''
      },
      coverageDetails: {
        consultations: 0,
        medications: 0,
        hospitalization: 0,
        specialistVisits: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleCoverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({
      ...formData,
      coverageDetails: {
        ...formData.coverageDetails,
        [e.target.name]: value
      }
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {insurance ? `${insurance.name}` : 'Nouvelle assurance'}
          </h2>
          <p className="text-gray-500">
            {insurance ? 'Modifier les informations de l\'assurance' : 'Ajouter une nouvelle assurance'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList>
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="coverage">Couverture</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de l'assurance</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Publique</SelectItem>
                        <SelectItem value="mutual">Mutuelle</SelectItem>
                        <SelectItem value="private">Privée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverageLevel">Niveau de couverture</Label>
                    <Select 
                      value={formData.coverageLevel} 
                      onValueChange={(value) => handleSelectChange('coverageLevel', value)}
                    >
                      <SelectTrigger id="coverageLevel">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="coverage" className="space-y-4 mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="consultations">Consultations (%)</Label>
                      <Input
                        id="consultations"
                        name="consultations"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.coverageDetails.consultations}
                        onChange={handleCoverageChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medications">Médicaments (%)</Label>
                      <Input
                        id="medications"
                        name="medications"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.coverageDetails.medications}
                        onChange={handleCoverageChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hospitalization">Hospitalisation (%)</Label>
                      <Input
                        id="hospitalization"
                        name="hospitalization"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.coverageDetails.hospitalization}
                        onChange={handleCoverageChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialistVisits">Visites spécialistes (%)</Label>
                      <Input
                        id="specialistVisits"
                        name="specialistVisits"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.coverageDetails.specialistVisits}
                        onChange={handleCoverageChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-gray-400" />
                    <h3 className="text-md font-medium">Coordonnées</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.contact.address}
                      onChange={handleContactChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.contact.phone}
                        onChange={handleContactChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.contact.email}
                        onChange={handleContactChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" type="button" onClick={onBack}>
            Annuler
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceCompanyDetail;
