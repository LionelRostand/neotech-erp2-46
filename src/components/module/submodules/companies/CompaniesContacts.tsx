
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  X,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CompanyContact } from './types';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { Switch } from '@/components/ui/switch';

const CompaniesContacts: React.FC = () => {
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<CompanyContact | null>(null);
  const [filteredContacts, setFilteredContacts] = useState<CompanyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { companies, isLoading } = useCompaniesData();

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = contacts.filter(
        contact =>
          contact.firstName.toLowerCase().includes(lowerCaseSearch) ||
          contact.lastName.toLowerCase().includes(lowerCaseSearch) ||
          contact.email.toLowerCase().includes(lowerCaseSearch) ||
          contact.position.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      // Mock data for now - in a real app, you would fetch from an API
      const mockContacts: CompanyContact[] = [
        {
          id: '1',
          companyId: 'enterprise1',
          firstName: 'Pierre',
          lastName: 'Dupont',
          position: 'Directeur Commercial',
          email: 'pierre.dupont@enterprise.fr',
          phone: '+33 1 23 45 67 89',
          isMain: true,
          isMainContact: true,
          createdAt: '2023-05-12T08:30:00Z',
          updatedAt: '2023-05-12T08:30:00Z'
        },
        {
          id: '2',
          companyId: 'techinno',
          firstName: 'Marie',
          lastName: 'Laurent',
          position: 'Responsable RH',
          email: 'm.laurent@techinnovation.fr',
          phone: '+33 6 12 34 56 78',
          isMain: false,
          isMainContact: false,
          createdAt: '2023-06-05T10:15:00Z',
          updatedAt: '2023-06-05T10:15:00Z'
        }
      ];
      
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      toast.error('Impossible de charger les contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle search - already implemented through the useEffect above
  };

  const handleAddContact = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditContact = (contact: CompanyContact) => {
    setCurrentContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (contact: CompanyContact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitNewContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newContact: Omit<CompanyContact, 'id' | 'createdAt' | 'updatedAt'> = {
      companyId: formData.get('companyId') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      position: formData.get('position') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      isMain: formData.get('isMain') === 'on',
      isMainContact: formData.get('isMain') === 'on'
    };
    
    // In a real app, would call an API here
    const contactWithId: CompanyContact = {
      ...newContact,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as CompanyContact;
    
    setContacts([...contacts, contactWithId]);
    toast.success('Contact ajouté avec succès');
    setIsAddDialogOpen(false);
  };

  const handleUpdateContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentContact) return;
    
    const formData = new FormData(e.currentTarget);
    
    const updatedContact: Partial<CompanyContact> = {
      companyId: formData.get('companyId') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      position: formData.get('position') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      isMain: formData.get('isMain') === 'on',
      isMainContact: formData.get('isMain') === 'on',
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, would call an API here
    setContacts(contacts.map(c => 
      c.id === currentContact.id ? { ...currentContact, ...updatedContact } : c
    ));
    
    toast.success('Contact mis à jour avec succès');
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!currentContact) return;
    
    // In a real app, would call an API here
    setContacts(contacts.filter(c => c.id !== currentContact.id));
    
    toast.success('Contact supprimé avec succès');
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Contacts</h2>
          <p className="text-gray-500">Gérez les contacts de vos entreprises</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadContacts} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleAddContact}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contact
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un contact..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit">Rechercher</Button>
          </form>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.firstName} {contact.lastName}
                        </TableCell>
                        <TableCell>{contact.position}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          {contact.isMainContact && (
                            <Badge variant="secondary">Principal</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(contact)}
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
                        {searchTerm 
                          ? 'Aucun contact trouvé avec ces critères' 
                          : 'Aucun contact disponible'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau contact</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitNewContact}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyId" className="text-right">
                  Entreprise
                </Label>
                <div className="col-span-3">
                  <select
                    id="companyId"
                    name="companyId"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    required
                  >
                    {isLoading ? (
                      <option value="">Chargement...</option>
                    ) : (
                      companies?.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Prénom
                </Label>
                <div className="col-span-3">
                  <Input id="firstName" name="firstName" required />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Nom
                </Label>
                <div className="col-span-3">
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Fonction
                </Label>
                <div className="col-span-3">
                  <Input id="position" name="position" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3">
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Téléphone
                </Label>
                <div className="col-span-3">
                  <Input id="phone" name="phone" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isMain" className="text-right">
                  Contact principal
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch id="isMain" name="isMain" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le contact</DialogTitle>
          </DialogHeader>
          {currentContact && (
            <form onSubmit={handleUpdateContact}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyId" className="text-right">
                    Entreprise
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="companyId"
                      name="companyId"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      defaultValue={currentContact.companyId}
                      required
                    >
                      {isLoading ? (
                        <option value="">Chargement...</option>
                      ) : (
                        companies?.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    Prénom
                  </Label>
                  <div className="col-span-3">
                    <Input id="firstName" name="firstName" defaultValue={currentContact.firstName} required />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Nom
                  </Label>
                  <div className="col-span-3">
                    <Input id="lastName" name="lastName" defaultValue={currentContact.lastName} required />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Fonction
                  </Label>
                  <div className="col-span-3">
                    <Input id="position" name="position" defaultValue={currentContact.position} />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input id="email" name="email" type="email" defaultValue={currentContact.email} required />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Téléphone
                  </Label>
                  <div className="col-span-3">
                    <Input id="phone" name="phone" defaultValue={currentContact.phone} />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isMain" className="text-right">
                    Contact principal
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <Switch id="isMain" name="isMain" defaultChecked={currentContact.isMainContact} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le contact {currentContact?.firstName} {currentContact?.lastName}.
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompaniesContacts;
