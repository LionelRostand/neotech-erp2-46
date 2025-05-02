
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useCompaniesQuery } from './hooks/useCompaniesQuery';
import CompaniesTable from '../companies/CompaniesTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Company } from '../companies/types';
import ViewCompanyDialog from '../companies/dialogs/ViewCompanyDialog';
import EditCompanyDialog from '../companies/dialogs/EditCompanyDialog';
import DeleteCompanyDialog from '../companies/dialogs/DeleteCompanyDialog';

const EmployeesCompanies = () => {
  const { data: companies = [], isLoading, refetch } = useCompaniesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // État pour la gestion des dialogues et de l'entreprise sélectionnée
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const filteredCompanies = companies.filter(company => {
    // Add null checks to prevent the "toLowerCase of undefined" error
    const companyName = company.name || '';
    const companyIndustry = company.industry || '';
    
    return companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyIndustry.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateCompany = () => {
    navigate('/modules/companies/create');
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setViewDialogOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setEditDialogOpen(true);
  };

  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const handleUpdateSuccess = async () => {
    setEditDialogOpen(false);
    await refetch();
    toast.success('Entreprise mise à jour avec succès');
  };

  const handleDeleteSuccess = async () => {
    setDeleteDialogOpen(false);
    await refetch();
    toast.success('Entreprise supprimée avec succès');
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success('Liste des entreprises actualisée');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des entreprises</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleCreateCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entreprise
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Entreprises</CardTitle>
            <div className="w-72 relative">
              <Input
                type="search"
                placeholder="Rechercher une entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CompaniesTable 
            companies={filteredCompanies}
            isLoading={isLoading}
            onView={handleViewCompany}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
        </CardContent>
      </Card>

      {/* Dialogues pour afficher, modifier et supprimer des entreprises */}
      {selectedCompany && (
        <>
          <ViewCompanyDialog 
            company={selectedCompany} 
            open={viewDialogOpen} 
            onClose={() => setViewDialogOpen(false)} 
          />
          <EditCompanyDialog 
            company={selectedCompany} 
            open={editDialogOpen} 
            onClose={() => setEditDialogOpen(false)}
            onSuccess={handleUpdateSuccess}
          />
          <DeleteCompanyDialog 
            company={selectedCompany} 
            open={deleteDialogOpen} 
            onClose={() => setDeleteDialogOpen(false)}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesCompanies;
