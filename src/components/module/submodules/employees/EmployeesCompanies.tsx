
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { MoreHorizontal, Plus, Search, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CompanyForm } from './CompanyForm';
import { useAuth } from '@/hooks/useAuth';

// Define Company type
export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: string;
  sector: string;
  size: string;
  status: 'active' | 'inactive';
  description: string;
  createdAt: string;
}

const EmployeesCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOffline } = useAuth();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.sector.toLowerCase().includes(query) ||
        company.contactPerson.toLowerCase().includes(query) ||
        company.city.toLowerCase().includes(query)
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'TechInnovation',
          address: '123 Tech Avenue',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
          phone: '+33 1 23 45 67 89',
          email: 'contact@techinnovation.fr',
          website: 'www.techinnovation.fr',
          contactPerson: 'Jean Dupont',
          sector: 'IT',
          size: 'medium',
          status: 'active',
          description: 'Société spécialisée en développement de logiciels',
          createdAt: '2023-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'GreenCo',
          address: '45 Rue Verte',
          city: 'Lyon',
          postalCode: '69002',
          country: 'France',
          phone: '+33 4 56 78 90 12',
          email: 'info@greenco.fr',
          website: 'www.greenco.fr',
          contactPerson: 'Marie Laurent',
          sector: 'Environnement',
          size: 'small',
          status: 'active',
          description: 'Solutions écologiques pour entreprises',
          createdAt: '2023-03-22T14:15:00Z'
        }
      ];
      
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      
      // In a real application, you would fetch from your API
      // const response = await fetch('/api/companies');
      // const data = await response.json();
      // setCompanies(data);
      // setFilteredCompanies(data);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
      toast.error('Impossible de charger les entreprises');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = (companyData: Partial<Company>) => {
    const newCompany = {
      ...companyData,
      id: `COMP${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    } as Company;

    setCompanies(prev => [newCompany, ...prev]);
    toast.success('Entreprise ajoutée avec succès');
    setIsAddDialogOpen(false);
  };

  const handleEditCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateCompany = (companyData: Partial<Company>) => {
    if (!currentCompany) return;

    const updatedCompany = {
      ...currentCompany,
      ...companyData
    };

    setCompanies(prev => prev.map(c => c.id === currentCompany.id ? updatedCompany as Company : c));
    toast.success('Entreprise mise à jour avec succès');
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!currentCompany) return;

    setCompanies(prev => prev.filter(c => c.id !== currentCompany.id));
    toast.success('Entreprise supprimée avec succès');
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Entreprises</h2>
          <p className="text-gray-500">Gérez les entreprises et leurs informations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchCompanies} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
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
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-4 py-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Secteur</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.sector}</TableCell>
                        <TableCell>{company.contactPerson}</TableCell>
                        <TableCell>{company.city}</TableCell>
                        <TableCell>
                          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                            {company.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditCompany(company.id)}
                              >
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(company.id)}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Aucune entreprise trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <span></span> {/* Empty trigger for controlled dialog */}
        </DialogTrigger>
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

      {/* Delete Confirmation Dialog */}
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
