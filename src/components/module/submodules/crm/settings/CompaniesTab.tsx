
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, PenLine, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Company {
  id: string;
  name: string;
  type: string;
  industry: string;
  isDefault: boolean;
}

const CompaniesTab: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([
    { id: '1', name: 'Société Principale', type: 'headquarters', industry: 'technology', isDefault: true },
    { id: '2', name: 'Filiale Nord', type: 'subsidiary', industry: 'consulting', isDefault: false },
    { id: '3', name: 'Filiale Sud', type: 'subsidiary', industry: 'manufacturing', isDefault: false },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'headquarters',
    industry: 'technology',
    isDefault: false,
  });
  
  // Gestion du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  // Actions sur les entreprises
  const openAddDialog = () => {
    setFormData({
      name: '',
      type: 'headquarters',
      industry: 'technology',
      isDefault: false,
    });
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      industry: company.industry,
      isDefault: company.isDefault,
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddCompany = () => {
    const newCompany: Company = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      industry: formData.industry,
      isDefault: formData.isDefault,
    };
    
    // Si la nouvelle entreprise est définie comme par défaut, mettre les autres à false
    let updatedCompanies = companies;
    if (formData.isDefault) {
      updatedCompanies = companies.map(company => ({
        ...company,
        isDefault: false,
      }));
    }
    
    setCompanies([...updatedCompanies, newCompany]);
    setIsAddDialogOpen(false);
    toast.success("Entreprise ajoutée avec succès");
  };
  
  const handleEditCompany = () => {
    if (!selectedCompany) return;
    
    // Si l'entreprise éditée est définie comme par défaut, mettre les autres à false
    let updatedCompanies = companies.map(company => {
      if (formData.isDefault) {
        return {
          ...company,
          isDefault: false,
        };
      }
      return company;
    });
    
    // Mise à jour de l'entreprise sélectionnée
    updatedCompanies = updatedCompanies.map(company => 
      company.id === selectedCompany.id 
        ? { 
            ...company, 
            name: formData.name,
            type: formData.type,
            industry: formData.industry,
            isDefault: formData.isDefault,
          } 
        : company
    );
    
    setCompanies(updatedCompanies);
    setIsEditDialogOpen(false);
    toast.success("Entreprise mise à jour avec succès");
  };
  
  const handleDeleteCompany = () => {
    if (!selectedCompany) return;
    
    // Vérifier si l'entreprise à supprimer est celle par défaut
    if (selectedCompany.isDefault) {
      toast.error("Impossible de supprimer l'entreprise par défaut");
      setIsDeleteDialogOpen(false);
      return;
    }
    
    const updatedCompanies = companies.filter(
      company => company.id !== selectedCompany.id
    );
    
    setCompanies(updatedCompanies);
    setIsDeleteDialogOpen(false);
    toast.success("Entreprise supprimée avec succès");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Configuration des entreprises</h3>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une entreprise
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-4">
            Configurez les entreprises utilisées dans votre CRM. L'entreprise définie par défaut sera utilisée pour les nouveaux clients et prospects.
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Industrie</TableHead>
                <TableHead>Par défaut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    {company.type === 'headquarters' ? 'Siège social' : 
                     company.type === 'subsidiary' ? 'Filiale' : 
                     company.type === 'branch' ? 'Succursale' : company.type}
                  </TableCell>
                  <TableCell>
                    {company.industry === 'technology' ? 'Technologie' : 
                     company.industry === 'consulting' ? 'Conseil' : 
                     company.industry === 'manufacturing' ? 'Fabrication' : 
                     company.industry === 'retail' ? 'Commerce de détail' : company.industry}
                  </TableCell>
                  <TableCell>
                    {company.isDefault ? '✓' : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(company)}>
                      <PenLine className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(company)} disabled={company.isDefault}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog d'ajout d'entreprise */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une entreprise</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle entreprise à votre CRM.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de l'entreprise</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type d'entreprise</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headquarters">Siège social</SelectItem>
                  <SelectItem value="subsidiary">Filiale</SelectItem>
                  <SelectItem value="branch">Succursale</SelectItem>
                  <SelectItem value="partner">Partenaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="industry">Industrie</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une industrie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technologie</SelectItem>
                  <SelectItem value="consulting">Conseil</SelectItem>
                  <SelectItem value="manufacturing">Fabrication</SelectItem>
                  <SelectItem value="retail">Commerce de détail</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={formData.isDefault}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="isDefault">Définir comme entreprise par défaut</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCompany}>
              <Save className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de modification d'entreprise */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier une entreprise</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'entreprise.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom de l'entreprise</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type d'entreprise</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headquarters">Siège social</SelectItem>
                  <SelectItem value="subsidiary">Filiale</SelectItem>
                  <SelectItem value="branch">Succursale</SelectItem>
                  <SelectItem value="partner">Partenaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-industry">Industrie</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une industrie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technologie</SelectItem>
                  <SelectItem value="consulting">Conseil</SelectItem>
                  <SelectItem value="manufacturing">Fabrication</SelectItem>
                  <SelectItem value="retail">Commerce de détail</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isDefault"
                name="isDefault"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={formData.isDefault}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="edit-isDefault">Définir comme entreprise par défaut</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditCompany}>
              <Save className="mr-2 h-4 w-4" />
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette entreprise sera définitivement supprimée du CRM.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompaniesTab;
