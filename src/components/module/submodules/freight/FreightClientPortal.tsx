
import React, { useState } from 'react';
import { 
  UserPlus, User, Mail, Clock, Shield, UsersRound, 
  Check, Plus, Settings, Eye, MessageSquare, LogOut 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ClientInviteDialog } from './helpers/FreightActionHelpers';

const FreightClientPortal: React.FC = () => {
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  // Sample users data
  const users = [
    { 
      id: 1, 
      name: "Julien Dubois", 
      email: "julien.dubois@acmecorp.com", 
      company: "Acme Corp", 
      role: "admin", 
      lastLogin: "2023-10-15 14:32", 
      status: "active" 
    },
    { 
      id: 2, 
      name: "Sophie Martin", 
      email: "s.martin@techsolutions.com", 
      company: "Tech Solutions", 
      role: "client", 
      lastLogin: "2023-10-14 09:15", 
      status: "active" 
    },
    { 
      id: 3, 
      name: "Thomas Lefebvre", 
      email: "t.lefebvre@globallogistics.com", 
      company: "Global Logistics", 
      role: "client", 
      lastLogin: "2023-10-10 16:48", 
      status: "inactive" 
    },
    { 
      id: 4, 
      name: "Marie Legrand", 
      email: "m.legrand@rapiddelivery.com", 
      company: "Rapid Delivery", 
      role: "readonly", 
      lastLogin: "2023-10-12 11:22", 
      status: "active" 
    },
    { 
      id: 5, 
      name: "Pierre Moreau", 
      email: "p.moreau@expressshipping.com", 
      company: "Express Shipping", 
      role: "client", 
      lastLogin: "-", 
      status: "pending" 
    }
  ];
  
  // Sample activity logs
  const activityLogs = [
    { 
      id: 1, 
      user: "Julien Dubois", 
      action: "Consultation du document", 
      details: "Facture EXP-1030", 
      timestamp: "2023-10-15 14:35" 
    },
    { 
      id: 2, 
      user: "Sophie Martin", 
      action: "Téléchargement", 
      details: "Connaissement #BL-4582", 
      timestamp: "2023-10-14 09:20" 
    },
    { 
      id: 3, 
      user: "Julien Dubois", 
      action: "Connexion au portail", 
      details: "", 
      timestamp: "2023-10-15 14:32" 
    },
    { 
      id: 4, 
      user: "Marie Legrand", 
      action: "Consultation des expéditions", 
      details: "", 
      timestamp: "2023-10-12 11:25" 
    },
    { 
      id: 5, 
      user: "Sophie Martin", 
      action: "Génération du rapport", 
      details: "Rapport d'expéditions mensuel", 
      timestamp: "2023-10-14 09:45" 
    }
  ];
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-500">Administrateur</Badge>;
      case 'client':
        return <Badge>Client</Badge>;
      case 'readonly':
        return <Badge variant="outline">Lecture seule</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleManageUser = (user: any) => {
    toast({
      title: "Gestion des accès",
      description: `Les options de gestion pour ${user.name} sont affichées.`,
    });
  };
  
  const handleInviteClient = (clientData: any) => {
    toast({
      title: "Client invité",
      description: "Un email d'invitation a été envoyé au client.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portail Client</h1>
        <Button onClick={() => setShowInviteDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un client
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UsersRound className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-muted-foreground">Comptes actifs</div>
                </div>
              </div>
              <Badge className="ml-auto" variant="outline">+12% ce mois</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connexions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LogOut className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold">52</div>
                  <div className="text-xs text-muted-foreground">Dernières 24h</div>
                </div>
              </div>
              <Badge className="ml-auto" variant="outline">+8% vs hier</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documents consultés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-amber-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold">187</div>
                  <div className="text-xs text-muted-foreground">Cette semaine</div>
                </div>
              </div>
              <Badge className="ml-auto" variant="outline">+22% vs sem. précédente</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold">9</div>
                  <div className="text-xs text-muted-foreground">Non lus</div>
                </div>
              </div>
              <Badge className="ml-auto" variant="outline">3 nouveaux aujourd'hui</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Utilisateurs du portail</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Journal d'activité</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <CardTitle>Utilisateurs du portail client</CardTitle>
                  <CardDescription>
                    Gérez les accès des clients au portail de suivi des expéditions
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="relative w-64">
                  <Input placeholder="Rechercher un utilisateur..." />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary-foreground">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleManageUser(user)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Gérer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <CardTitle>Journal d'activité</CardTitle>
                  <CardDescription>
                    Historique des actions réalisées par les utilisateurs du portail
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Paramètres d'audit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap font-medium">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Client invitation dialog */}
      {showInviteDialog && (
        <ClientInviteDialog
          isOpen={showInviteDialog}
          onClose={() => setShowInviteDialog(false)}
          onInvite={handleInviteClient}
        />
      )}
    </div>
  );
};

export default FreightClientPortal;
