
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Plus, Building } from 'lucide-react';
import { toast } from 'sonner';
import CompaniesTable from '../companies/CompaniesTable';
import { Company } from '../companies/types';
import CompanyForm from '../CompanyForm';
import { useAuth } from '@/hooks/useAuth';
import { useCompaniesData } from '@/hooks/useCompaniesData';

const EmployeesCompanies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const { isOffline } = useAuth();
  
  // Utiliser le hook useCompaniesData pour récupérer les données des entreprises
  const { companies, isLoading, error } = useCompaniesData();

  // Filtrer les entreprises en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.industry?.toLowerCase().includes(query) ||
        company.address?.city?.toLowerCase().includes(query)
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  // Gérer l'affichage des détails d'une entreprise
  const handleViewCompany = (company: Company) => {
    console.log('Affichage des détails de l\'entreprise:', company);
    // Implémentation future: navigation vers une vue détaillée
  };

  // Gérer la modification d'une entreprise
  const handleEditCompany = (company: Company) => {
    setCurrentCompany(company);
    setIsEditDialogOpen(true);
  };

  // Gérer la mise à jour d'une entreprise
  const handleUpdateCompany = (companyData: Partial<Company>) => {
    if (!currentCompany) return;

    const updatedCompany = {
      ...currentCompany,
      ...companyData,
      updatedAt: new Date().toISOString()
    };

    // Mettre à jour l'entreprise dans la liste
    const updatedCompanies = companies.map(c => 
      c.id === currentCompany.id ? updatedCompany as Company : c
    );
    
    // Mise à jour simulée (à remplacer par un appel API réel)
    toast.success('Entreprise mise à jour avec succès');
    setIsEditDialogOpen(false);
  };

  // Gérer la suppression d'une entreprise
  const handleDeleteClick = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };

  // Confirmer la suppression d'une entreprise
  const handleDeleteConfirm = () => {
    if (!currentCompany) return;

    // Suppression simulée (à remplacer par un appel API réel)
    toast.success('Entreprise supprimée avec succès');
    setIsDeleteDialogOpen(false);
  };

  // Gérer l'ajout d'une nouvelle entreprise
  const handleAddCompany = (companyData: Partial<Company>) => {
    // Création simulée (à remplacer par un appel API réel)
    const newCompany = {
      ...companyData,
      id: `COMP${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active' as const
    } as Company;

    toast.success('Entreprise ajoutée avec succès');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Entreprises</h2>
          <p className="text-gray-500">Gérez les entreprises associées à vos employés</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle entreprise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle entreprise</DialogTitle>
              </DialogHeader>
              <CompanyForm
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddCompany}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une entreprise..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
              Une erreur est survenue lors du chargement des entreprises
            </div>
          )}

          {isOffline && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-amber-800 text-sm flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Mode hors-ligne actif. Les données affichées peuvent ne pas être à jour.
              </p>
            </div>
          )}

          <CompaniesTable 
            companies={filteredCompanies} 
            isLoading={isLoading} 
            onView={handleViewCompany}
            onEdit={handleEditCompany}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Boîte de dialogue pour modifier une entreprise */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'entreprise</DialogTitle>
          </DialogHeader>
          {currentCompany && (
            <CompanyForm
              isOpen={isEditDialogOpen}
              company={currentCompany}
              isEditing={true}
              onClose={() => setIsEditDialogOpen(false)}
              onSave={handleUpdateCompany}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour confirmer la suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement l'entreprise {currentCompany?.name} et ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesCompanies;
