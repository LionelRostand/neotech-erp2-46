import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCompanyService } from './services/companyService';
import { Company, CompanyFilters } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const CompaniesList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCompanies } = useCompanyService();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CompanyFilters>({
    status: undefined,
    startDate: undefined,
    endDate: undefined
  });
  
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching companies...');
      const { companies: fetchedCompanies, hasMore: more } = await getCompanies(
        page, 
        10, 
        filters, 
        searchTerm
      );
      console.log('Companies fetched:', fetchedCompanies);
      setCompanies(fetchedCompanies);
      setHasMore(more);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }, [getCompanies, page, filters, searchTerm]);
  
  useEffect(() => {
    console.log('CompaniesList mounted or dependencies changed');
    fetchCompanies();
  }, [fetchCompanies]);
  
  const handleSearch = () => {
    setPage(1); // Reset to first page
    fetchCompanies();
  };
  
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      // Ensure status is a valid value or undefined
      const statusValue = value === 'all' ? undefined : value as 'active' | 'inactive' | 'pending';
      setFilters(prev => ({
        ...prev,
        [key]: statusValue
      }));
    } else if (key === 'startDate' || key === 'endDate') {
      // Convert date strings to Date objects
      const dateValue = value === '' ? undefined : new Date(value);
      setFilters(prev => ({
        ...prev,
        [key]: dateValue
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };
  
  const resetFilters = () => {
    setFilters({
      status: undefined,
      startDate: undefined,
      endDate: undefined
    });
    setPage(1);
  };
  
  const nextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };
  
  const handleRefresh = () => {
    fetchCompanies();
  };
  
  const handleCreateCompany = () => {
    navigate('/modules/companies/create');
  };

  const handleRowClick = (company: Company) => {
    // Idéalement, naviguer vers la page de détails de l'entreprise
    // navigate(`/modules/companies/details/${company.id}`);
    console.log('Company clicked:', company);
  };
  
  return (
    <div className="space-y-4">
      {/* Header section with search and filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Rechercher par nom, SIRET..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              title="Rafraîchir la liste"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreateCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entreprise
          </Button>
        </div>
        
        {/* Filters section */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date début</label>
              <Input
                type="date"
                value={filters.startDate ? filters.startDate.toISOString().slice(0, 10) : ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date fin</label>
              <Input
                type="date"
                value={filters.endDate ? filters.endDate.toISOString().slice(0, 10) : ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Companies table */}
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>SIRET/Numéro</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <TableRow 
                    key={company.id} 
                    onClick={() => handleRowClick(company)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.siret || company.registrationNumber || "—"}</TableCell>
                    <TableCell>{company.contactEmail || company.contactName || "—"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        company.status === 'active' ? 'bg-green-100 text-green-800' :
                        company.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {company.status === 'active' ? 'Actif' :
                         company.status === 'inactive' ? 'Inactif' :
                         company.status === 'pending' ? 'En attente' : '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {company.createdAt ? 
                        typeof company.createdAt.toDate === 'function' ? 
                          format(company.createdAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 
                          format(company.createdAt, 'dd MMM yyyy', { locale: fr })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucune entreprise trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {companies.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div>
              <p className="text-sm text-gray-500">
                Page {page} {hasMore ? '...' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevPage} 
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextPage} 
                disabled={!hasMore}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CompaniesList;
