
import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Phone, Mail, Building2, Plus, Search, Edit, Trash2, UserPlus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyId: string;
  createdAt: any;
}

interface Company {
  id: string;
  name: string;
}

const CONTACTS_PER_PAGE = 10;

const CompaniesContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form data for new/edit contact
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyId: '',
  });

  const contactsDb = useFirestore(COLLECTIONS.DOCUMENTS);
  const companiesDb = useFirestore(COLLECTIONS.COMPANIES);

  // Fetch contacts and companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get companies first
        const companiesData = await companiesDb.getAll() as Company[];
        setCompanies(companiesData);

        // Get contacts
        const contactsData = await contactsDb.getAll([
          where('type', '==', 'company_contact'),
          orderBy('lastName')
        ]) as Contact[];
        
        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when searchTerm or selectedCompany changes
  useEffect(() => {
    let filtered = contacts;
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.firstName.toLowerCase().includes(lowerSearch) ||
        contact.lastName.toLowerCase().includes(lowerSearch) ||
        contact.email.toLowerCase().includes(lowerSearch) ||
        contact.phone.includes(searchTerm)
      );
    }
    
    if (selectedCompany) {
      filtered = filtered.filter(contact => contact.companyId === selectedCompany);
    }
    
    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCompany, contacts]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / CONTACTS_PER_PAGE);
  const currentContacts = filteredContacts.slice(
    (currentPage - 1) * CONTACTS_PER_PAGE,
    currentPage * CONTACTS_PER_PAGE
  );

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle company selection in form
  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyId: value }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      companyId: '',
    });
  };

  // Edit contact - prepare form
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      position: contact.position,
      companyId: contact.companyId,
    });
    setIsEditDialogOpen(true);
  };

  // Add contact
  const handleAddContact = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.companyId) {
      // This would be replaced with proper form validation
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await contactsDb.add({
        ...formData,
        type: 'company_contact',
      });

      // Refresh contacts
      const contactsData = await contactsDb.getAll([
        where('type', '==', 'company_contact'),
        orderBy('lastName')
      ]) as Contact[];
      
      setContacts(contactsData);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  // Update contact
  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    
    try {
      await contactsDb.update(selectedContact.id, {
        ...formData,
        type: 'company_contact',
      });

      // Refresh contacts
      const contactsData = await contactsDb.getAll([
        where('type', '==', 'company_contact'),
        orderBy('lastName')
      ]) as Contact[];
      
      setContacts(contactsData);
      setIsEditDialogOpen(false);
      setSelectedContact(null);
      resetForm();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // Delete contact
  const handleDeleteContact = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;
    
    try {
      await contactsDb.remove(id);
      
      // Update contacts list
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Get company name by ID
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Add Contact button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contacts des entreprises</h2>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un contact
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un contact..."
            className="pl-8 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select 
          value={selectedCompany || ''} 
          onValueChange={(value) => setSelectedCompany(value || null)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrer par entreprise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les entreprises</SelectItem>
            {companies.map(company => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Contacts grid */}
      {currentContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentContacts.map(contact => (
            <Card key={contact.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between mb-3">
                <h3 className="font-medium text-lg">
                  {contact.firstName} {contact.lastName}
                </h3>
                <div className="flex space-x-1">
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
              </div>
              
              <div className="text-gray-500 text-sm">{contact.position}</div>
              
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                </div>
                
                {contact.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center pt-1">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{getCompanyName(contact.companyId)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucun contact trouvé avec les critères sélectionnés.
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
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
      )}
      
      {/* Add Contact Dialog */}
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
              <label htmlFor="position" className="text-sm font-medium">Poste</label>
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddContact}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Contact Dialog */}
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
              <label htmlFor="edit-position" className="text-sm font-medium">Poste</label>
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
