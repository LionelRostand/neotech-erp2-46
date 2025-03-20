import React, { useState, useEffect } from 'react';
import { useCompanyService } from './services/companyService';
import { Company, CompanyContact } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  Building2, 
  Edit, 
  Trash2,
  UserPlus
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const CompaniesContacts: React.FC = () => {
  const { 
    getCompanies, 
    getCompanyContacts, 
    createContact, 
    updateContact, 
    deleteContact 
  } = useCompanyService();
  
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [filteredContacts, setFilteredContacts] = useState<CompanyContact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<CompanyContact | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyId: '',
    isMain: false
  });
  
  const contactsPerPage = 10;
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { companies: companiesData } = await getCompanies(1, 100);
        setCompanies(companiesData);
        
        const allContacts: CompanyContact[] = [];
        for (const company of companiesData) {
          const companyContacts = await getCompanyContacts(company.id);
          allContacts.push(...companyContacts);
        }
        
        setContacts(allContacts);
        setFilteredContacts(allContacts);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    let filtered = contacts;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.phone?.includes(term) ||
        contact.position?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCompany) {
      filtered = filtered.filter(contact => contact.companyId === selectedCompany);
    }
    
    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCompany, contacts]);
  
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
  
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyId: value }));
  };
  
  const handleMainContactChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isMain: checked }));
  };
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      companyId: '',
      isMain: false
    });
  };
  
  const handleCreateContact = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.companyId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      await createContact(formData);
      
      if (formData.companyId) {
        const newContacts = await getCompanyContacts(formData.companyId);
        
        setContacts(prev => {
          const filteredPrev = prev.filter(c => c.companyId !== formData.companyId);
          return [...filteredPrev, ...newContacts];
        });
      }
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };
  
  const handleEditContact = (contact: CompanyContact) => {
    setSelectedContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email || '',
      phone: contact.phone || '',
      position: contact.position || '',
      companyId: contact.companyId,
      isMain: contact.isMain || false
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    
    try {
      await updateContact(selectedContact.id, formData);
      
      if (formData.companyId) {
        const updatedContacts = await getCompanyContacts(formData.companyId);
        
        setContacts(prev => {
          const filteredPrev = prev.filter(c => c.companyId !== formData.companyId);
          return [...filteredPrev, ...updatedContacts];
        });
      }
      
      setIsEditDialogOpen(false);
      setSelectedContact(null);
      resetForm();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };
  
  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;
    
    try {
      await deleteContact(contactId);
      
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Entreprise inconnue';
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        
        <Card>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contacts des entreprises</h2>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un contact
        </Button>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select
            value={selectedCompany || ''}
            onValueChange={(value) => setSelectedCompany(value || null)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrer par entreprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les entreprises</SelectItem>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Fonction</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContacts.length > 0 ? (
              paginatedContacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.firstName} {contact.lastName}
                    {contact.isMain && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Principal
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="flex items-center text-blue-600 hover:underline">
                        <Mail className="mr-1 h-4 w-4" />
                        {contact.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="flex items-center text-blue-600 hover:underline">
                        <Phone className="mr-1 h-4 w-4" />
                        {contact.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{contact.position || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="mr-1 h-4 w-4 text-gray-500" />
                      {getCompanyName(contact.companyId)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditContact(contact)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Aucun contact trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau contact</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">Prénom *</label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">Nom *</label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email *</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">Fonction</label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="companyId" className="text-sm font-medium">Entreprise *</label>
              <Select 
                value={formData.companyId} 
                onValueChange={handleCompanyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isMain"
                checked={formData.isMain}
                onChange={(e) => handleMainContactChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="isMain" className="text-sm font-medium">
                Contact principal
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateContact}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le contact</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-firstName" className="text-sm font-medium">Prénom *</label>
              <Input
                id="edit-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-lastName" className="text-sm font-medium">Nom *</label>
              <Input
                id="edit-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-email" className="text-sm font-medium">Email *</label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-phone" className="text-sm font-medium">Téléphone</label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-position" className="text-sm font-medium">Fonction</label>
              <Input
                id="edit-position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-companyId" className="text-sm font-medium">Entreprise *</label>
              <Select 
                value={formData.companyId} 
                onValueChange={handleCompanyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="edit-isMain"
                checked={formData.isMain}
                onChange={(e) => handleMainContactChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="edit-isMain" className="text-sm font-medium">
                Contact principal
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateContact}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesContacts;
