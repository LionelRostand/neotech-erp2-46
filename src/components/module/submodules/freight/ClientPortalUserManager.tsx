
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';
import { fetchCollectionData } from '@/hooks/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Type pour les utilisateurs du portail
interface PortalUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: 'active' | 'pending' | 'disabled';
  lastLogin?: string;
}

const ClientPortalUserManager: React.FC = () => {
  const { toast } = useToast();
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        // Nous utilisons la collection "customers" pour récupérer les utilisateurs du portail
        const data = await fetchCollectionData<PortalUser>(COLLECTIONS.FREIGHT.CUSTOMERS);
        setUsers(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les utilisateurs du portail. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsLoading(false);
        
        // Utilisez des données de démonstration en cas d'erreur
        setUsers([
          {
            id: '1',
            name: 'Jean Dupont',
            email: 'jean.dupont@entreprise.fr',
            company: 'Entreprise SA',
            role: 'Admin',
            status: 'active',
            lastLogin: '2023-10-15 14:23'
          },
          {
            id: '2',
            name: 'Marie Martin',
            email: 'marie.martin@logistique.com',
            company: 'Logistique Express',
            role: 'Utilisateur',
            status: 'active',
            lastLogin: '2023-10-14 09:45'
          },
          {
            id: '3',
            name: 'Pierre Dubois',
            email: 'p.dubois@transport.fr',
            company: 'Transport International',
            role: 'Utilisateur',
            status: 'pending'
          },
          {
            id: '4',
            name: 'Sophie Legrand',
            email: 'sophie@fruittransport.com',
            company: 'FruitFresh SA',
            role: 'Viewer',
            status: 'disabled',
            lastLogin: '2023-09-28 16:10'
          }
        ]);
      }
    };
    
    loadUsers();
  }, [toast]);
  
  const handleManageUser = (user: PortalUser) => {
    setSelectedUser(user);
    setManageDialogOpen(true);
  };
  
  const handleSaveUser = () => {
    toast({
      title: "Utilisateur mis à jour",
      description: `Les paramètres de l'utilisateur ${selectedUser?.name} ont été mis à jour.`
    });
    setManageDialogOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-amber-500">En attente</Badge>;
      case 'disabled':
        return <Badge variant="default" className="bg-red-500">Désactivé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs du portail client</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-12">
            <p>Chargement des utilisateurs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs du portail client</CardTitle>
        <CardDescription>
          Gérez les accès des clients à votre portail
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.lastLogin || 'Jamais connecté'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageUser(user)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Gérer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Dialog to manage user settings */}
        {selectedUser && (
          <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gérer l'utilisateur</DialogTitle>
                <DialogDescription>
                  Configurez les paramètres d'accès pour {selectedUser.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <select
                    id="role"
                    className="w-full p-2 border rounded-md"
                    defaultValue={selectedUser.role}
                  >
                    <option value="Admin">Administrateur</option>
                    <option value="Utilisateur">Utilisateur</option>
                    <option value="Viewer">Lecteur seul</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded-md"
                    defaultValue={selectedUser.status}
                  >
                    <option value="active">Actif</option>
                    <option value="pending">En attente</option>
                    <option value="disabled">Désactivé</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="permissions">Autorisations</Label>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="view-shipments" defaultChecked />
                      <label htmlFor="view-shipments">Voir les expéditions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="track-shipments" defaultChecked />
                      <label htmlFor="track-shipments">Suivre les expéditions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="view-invoices" defaultChecked />
                      <label htmlFor="view-invoices">Consulter les factures</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="download-docs" defaultChecked />
                      <label htmlFor="download-docs">Télécharger les documents</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="create-booking" />
                      <label htmlFor="create-booking">Créer des réservations</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setManageDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveUser}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPortalUserManager;
