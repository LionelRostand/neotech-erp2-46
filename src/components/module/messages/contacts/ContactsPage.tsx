
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Contact } from '../types/message-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, UserPlus, MoreHorizontal, Pencil, Trash2, Sync, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import ContactDialog from './ContactDialog';
import DeleteContactDialog from './DeleteContactDialog';

const ContactsPage: React.FC = () => {
  const { getAll, remove } = useFirestore(COLLECTIONS.CONTACTS);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const contactsData = await getAll();
        
        if (contactsData.length === 0) {
          // Si pas de contacts, créer des données fictives pour la démo
          const mockContacts: Contact[] = Array.from({ length: 10 }, (_, i) => ({
            id: `mock-${i+1}`,
            firstName: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Philippe', 'Anne', 'Thomas', 'Claire', 'Paul', 'Julie'][i],
            lastName: ['Dupont', 'Martin', 'Durand', 'Bernard', 'Petit', 'Robert', 'Richard', 'Dubois', 'Moreau', 'Laurent'][i],
            email: `contact${i+1}@example.com`,
            phone: `+33 6 12 34 56 ${i+1}${i+1}`,
            company: ['NeoTech', 'EcoCorp', 'DataSoft', 'MegaSolutions', 'TechInnovate'][i % 5],
            position: ['Directeur', 'Chef de projet', 'Développeur', 'Designer', 'Commercial'][i % 5],
            isActive: true,
            tags: [['client', 'VIP'], ['prospect', 'intéressé'], ['partenaire'], ['fournisseur'], ['client']][i % 5],
            createdAt: new Date() as any,
            updatedAt: new Date() as any,
            messagesCount: Math.floor(Math.random() * 50)
          }));
          setContacts(mockContacts);
          setFilteredContacts(mockContacts);
        } else {
          setContacts(contactsData as Contact[]);
          setFilteredContacts(contactsData as Contact[]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les contacts."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [getAll, toast]);

  // Filtrer les contacts en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = contacts.filter(contact => 
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.company?.toLowerCase().includes(term) ||
        contact.position?.toLowerCase().includes(term)
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  const handleCreateContact = () => {
    setCurrentContact(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!currentContact) return;
    
    try {
      await remove(currentContact.id);
      setContacts(prev => prev.filter(c => c.id !== currentContact.id));
      toast({
        title: "Contact supprimé",
        description: `${currentContact.firstName} ${currentContact.lastName} a été supprimé.`
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le contact."
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSyncContacts = () => {
    toast({
      title: "Synchronisation en cours",
      description: "Synchronisation avec le CRM externe..."
    });
    
    // Simuler une synchronisation réussie après 2 secondes
    setTimeout(() => {
      toast({
        title: "Synchronisation terminée",
        description: "Tous les contacts ont été synchronisés avec succès."
      });
    }, 2000);
  };

  const handleContactSaved = (contact: Contact, isNew: boolean) => {
    if (isNew) {
      setContacts(prev => [...prev, contact]);
      toast({
        title: "Contact créé",
        description: `${contact.firstName} ${contact.lastName} a été ajouté avec succès.`
      });
    } else {
      setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
      toast({
        title: "Contact mis à jour",
        description: `Les informations de ${contact.firstName} ${contact.lastName} ont été mises à jour.`
      });
    }
  };

  const handleComposeEmail = (contact: Contact) => {
    // Rediriger vers la page de composition avec le contact pré-rempli
    window.location.href = `/modules/messages/compose?to=${contact.id}`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>
              Gérez vos contacts pour l'envoi de messages
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un contact..."
                className="pl-8 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleSyncContacts}>
              <Sync className="mr-2 h-4 w-4" />
              Synchroniser
            </Button>
            <Button onClick={handleCreateContact}>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau contact
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                <TableHead className="hidden md:table-cell">Entreprise</TableHead>
                <TableHead className="hidden md:table-cell">Fonction</TableHead>
                <TableHead className="hidden lg:table-cell">Tags</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Chargement des contacts...
                  </TableCell>
                </TableRow>
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Aucun contact trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{getInitials(contact.firstName, contact.lastName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{`${contact.firstName} ${contact.lastName}`}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{contact.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{contact.phone || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{contact.company || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{contact.position || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {contact.tags?.map(tag => (
                        <span key={tag} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-1 mb-1">
                          {tag}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleComposeEmail(contact)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer un message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteContact(contact)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ContactDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        contact={null}
        onSave={handleContactSaved}
      />

      <ContactDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        contact={currentContact}
        onSave={handleContactSaved}
      />

      <DeleteContactDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        contact={currentContact}
        onConfirm={confirmDeleteContact}
      />
    </Card>
  );
};

export default ContactsPage;
