
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Star, 
  Pencil, 
  Trash, 
  X 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { CompanyContact } from './types';
import { toast } from 'sonner';
// Import the service - for mock purposes we're not calling real methods
import { companyService } from './services/companyService';

const CompaniesContacts: React.FC = () => {
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<CompanyContact | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    phone: '',
    isMainContact: false
  });
  
  // Mock implementations of service methods since they don't exist
  const getCompanyContacts = async () => {
    // Return mock data
    return [
      {
        id: '1',
        companyId: '1',
        firstName: 'John',
        lastName: 'Doe',
        position: 'CEO',
        email: 'john.doe@example.com',
        phone: '+33123456789',
        isMainContact: true,
        isMain: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        companyId: '1',
        firstName: 'Jane',
        lastName: 'Smith',
        position: 'CTO',
        email: 'jane.smith@example.com',
        phone: '+33987654321',
        isMainContact: false,
        isMain: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ] as CompanyContact[];
  };
  
  const createContact = async (contact: Omit<CompanyContact, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Mock implementation - in a real app this would call an API
    return {
      ...contact,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as CompanyContact;
  };
  
  const updateContact = async (id: string, contact: Partial<CompanyContact>) => {
    // Mock implementation
    return true;
  };
  
  const deleteContact = async (id: string) => {
    // Mock implementation
    return true;
  };
  
  // Function to load contacts
  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const contactsList = await getCompanyContacts();
      setContacts(contactsList);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      position: '',
      email: '',
      phone: '',
      isMainContact: false
    });
  };
  
  // Handle adding a new contact
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newContact = await createContact({
        companyId: '1', // In a real app, you'd get the actual company ID
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        isMainContact: formData.isMainContact,
        isMain: formData.isMainContact,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      setContacts([...contacts, newContact]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Contact ajouté avec succès');
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    }
  };
  
  // Handle editing a contact
  const handleEditContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContact) return;
    
    try {
      const success = await updateContact(selectedContact.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        isMainContact: formData.isMainContact,
        isMain: formData.isMainContact,
        updatedAt: new Date().toISOString()
      });
      
      if (success) {
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === selectedContact.id
              ? {
                  ...contact,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  position: formData.position,
                  email: formData.email,
                  phone: formData.phone,
                  isMainContact: formData.isMainContact,
                  isMain: formData.isMainContact,
                  updatedAt: new Date().toISOString()
                }
              : contact
          )
        );
        
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedContact(null);
        toast.success('Contact mis à jour avec succès');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  };
  
  // Handle deleting a contact
  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    
    try {
      const success = await deleteContact(selectedContact.id);
      
      if (success) {
        setContacts(prevContacts => 
          prevContacts.filter(contact => contact.id !== selectedContact.id)
        );
        
        setIsDeleteDialogOpen(false);
        setSelectedContact(null);
        toast.success('Contact supprimé avec succès');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };
  
  // Open edit dialog with contact data
  const openEditDialog = (contact: CompanyContact) => {
    setSelectedContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      position: contact.position || '',
      email: contact.email || '',
      phone: contact.phone || '',
      isMainContact: contact.isMainContact || contact.isMain || false
    });
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Contacts d'entreprise</h1>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un contact..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-10">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-semibold">Aucun contact trouvé</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Essayez une autre recherche.' : 'Commencez par ajouter un contact.'}
              </p>
              {searchTerm && (
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
                  Effacer la recherche
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact principal</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      {(contact.isMainContact || contact.isMain) && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <Star className="mr-1 h-3 w-3" />
                          Principal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell>{contact.position || '-'}</TableCell>
                    <TableCell>
                      {contact.email ? (
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Mail className="mr-1 h-3 w-3" />
                          {contact.email}
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.phone ? (
                        <a 
                          href={`tel:${contact.phone}`} 
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Phone className="mr-1 h-3 w-3" />
                          {contact.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(contact)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un contact</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau contact pour cette entreprise.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddContact} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">
                Poste
              </label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Téléphone
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="isMainContact"
                name="isMainContact"
                type="checkbox"
                checked={formData.isMainContact}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isMainContact" className="text-sm font-medium">
                Contact principal
              </label>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le contact</DialogTitle>
            <DialogDescription>
              Modifiez les informations du contact.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditContact} className="space-y-4">
            {/* Same form fields as add dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-firstName" className="text-sm font-medium">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  id="edit-firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-lastName" className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  id="edit-lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-position" className="text-sm font-medium">
                Poste
              </label>
              <Input
                id="edit-position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-phone" className="text-sm font-medium">
                Téléphone
              </label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="edit-isMainContact"
                name="isMainContact"
                type="checkbox"
                checked={formData.isMainContact}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="edit-isMainContact" className="text-sm font-medium">
                Contact principal
              </label>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                  setSelectedContact(null);
                }}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedContact(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteContact}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesContacts;
