import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Contact } from '../types/message-types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserPlus, 
  Search,
  RefreshCw,
  Filter, 
  MoreHorizontal 
} from 'lucide-react';
import ContactDialog from './ContactDialog';
import DeleteContactDialog from './DeleteContactDialog';
import { DataTable } from '@/components/DataTable';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface ContactsPageProps {
  // Props if needed
}

const ContactsPage: React.FC<ContactsPageProps> = () => {
  const { getAll } = useFirestore(COLLECTIONS.CONTACTS);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const contactsData = await getAll();
        if (contactsData.length > 0) {
          setContacts(contactsData as Contact[]);
        } else {
          // Créer des données fictives pour la démo
          const mockContacts: Contact[] = Array.from({ length: 15 }, (_, i) => ({
            id: `mock-${i+1}`,
            firstName: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Philippe', 'Anne', 'Thomas', 'Claire', 'Paul', 'Julie', 'Lucas', 'Emma', 'Gabriel', 'Chloé', 'Arthur'][i],
            lastName: ['Dupont', 'Martin', 'Durand', 'Bernard', 'Petit', 'Robert', 'Richard', 'Dubois', 'Moreau', 'Laurent', 'Garcia', 'Roux', 'Leroy', 'Morel', 'Chevalier'][i],
            email: `contact${i+1}@example.com`,
            phone: `+33 6 12 34 56 ${i+1}${i+1}`,
            company: ['NeoTech', 'EcoCorp', 'DataSoft', 'MegaSolutions', 'TechInnovate', 'GlobalCom', 'Innovision', 'StarLink', 'QuantumLeap', 'FutureNet', 'ApexTech', 'BrightSol', 'ClearView', 'DynamicSys', 'EliteGroup'][i % 15],
            position: ['Directeur', 'Chef de projet', 'Développeur', 'Designer', 'Commercial', 'Analyste', 'Consultant', 'Ingénieur', 'Manager', 'Assistant', 'Stagiaire', 'Responsable', 'Coordinateur', 'Technicien', 'Expert'][i % 15],
            isActive: true,
            createdAt: new Date() as any,
            updatedAt: new Date() as any
          }));
          setContacts(mockContacts);
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des contacts:", err);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les contacts."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [getAll, toast]);

  const columns = [
    {
      accessorKey: 'firstName',
      header: 'Prénom',
    },
    {
      accessorKey: 'lastName',
      header: 'Nom',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
    },
    {
      accessorKey: 'company',
      header: 'Entreprise',
    },
    {
      accessorKey: 'position',
      header: 'Poste',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                // Naviguer vers la page de composition avec l'email pré-rempli
                navigate(`/modules/messages/compose?to=${contact.id}`);
              }}>
                Envoyer un message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setSelectedContact(contact);
                setOpenDeleteDialog(true);
              }}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredContacts = React.useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(lowerSearch) ||
      contact.lastName.toLowerCase().includes(lowerSearch) ||
      contact.email.toLowerCase().includes(lowerSearch) ||
      (contact.company?.toLowerCase().includes(lowerSearch) ?? false)
    );
  }, [contacts, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <Input
              type="search"
              placeholder="Rechercher un contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button onClick={() => setOpenCreateDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Nouveau contact
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={filteredContacts} />
        </CardContent>
      </Card>

      <ContactDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />
      <DeleteContactDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        contact={selectedContact}
        setContacts={setContacts}
      />
    </div>
  );
};

export default ContactsPage;
