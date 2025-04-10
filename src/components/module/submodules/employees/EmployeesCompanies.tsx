
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
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { companyService } from '../companies/services/companyService';

const EmployeesCompanies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOffline } = useAuth();
  
  // Utiliser useFirebaseCompanies au lieu de useCompaniesData pour avoir des données à jour
  const { companies, isLoading, error, refetch } = useFirebaseCompanies();

  // Rafraîchir les données filtrées lorsque les entreprises ou la recherche changent
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

  const handleViewCompany = (company: Company) => {
    console.log('Affichage des détails de l\'entreprise:', company);
  };

  const handleEditCompany = (company: Company) => {
    setCurrentCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCompany = async (companyData: Partial<Company>) => {
    if (!currentCompany) return;

    try {
      // Mettre à jour l'entreprise dans Firestore
      await companyService.updateCompany(currentCompany.id, {
        ...companyData,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Entreprise mise à jour avec succès');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Échec de la mise à jour de l\'entreprise');
    }
  };

  const handleDeleteClick = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentCompany) return;

    try {
      // Supprimer réellement l'entreprise dans Firestore
      await companyService.deleteCompany(currentCompany.id);
      toast.success('Entreprise supprimée avec succès');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Échec de la suppression de l\'entreprise');
    }
  };

  const handleAddCompany = async (companyData: Partial<Company>) => {
    try {
      console.log('Tentative d\'ajout d\'une entreprise avec les données:', companyData);
      
      // Créer réellement l'entreprise dans Firestore
      const newCompany = await companyService.createCompany({
        ...companyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' as const,
        employeesCount: 0
      } as any); // Cast as any pour éviter les erreurs de type
      
      console.log('Entreprise ajoutée avec succès:', newCompany);
      toast.success('Entreprise ajoutée avec succès');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Échec de l\'ajout de l\'entreprise');
    }
  };

  // Fonction pour actualiser manuellement les données
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) {
        await refetch();
        toast.success('Données actualisées avec succès');
      } else {
        // Fallback si refetch n'est pas disponible
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de l\'actualisation des données:', error);
      toast.error('Échec de l\'actualisation des données');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Entreprises</h2>
          <p className="text-gray-500">Gérez les entreprises associées à vos employés</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Nouvelle entreprise
          </Button>
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
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualisation...' : 'Actualiser'}
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
            isLoading={isLoading || isRefreshing} 
            onView={handleViewCompany}
            onEdit={handleEditCompany}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle entreprise</DialogTitle>
          </DialogHeader>
          <CompanyForm
            onClose={() => setIsAddDialogOpen(false)}
            onSave={handleAddCompany}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'entreprise</DialogTitle>
          </DialogHeader>
          {currentCompany && (
            <CompanyForm
              company={currentCompany}
              isEditing={true}
              onClose={() => setIsEditDialogOpen(false)}
              onSave={handleUpdateCompany}
            />
          )}
        </DialogContent>
      </Dialog>

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
