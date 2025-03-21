
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, Calendar, Phone, Mail, MessageSquare, ListFilter, User } from "lucide-react";
import { toast } from "sonner";
import { getAllDocuments } from "@/hooks/firestore/read-operations";
import { useFirestore } from '@/hooks/use-firestore';

interface Interaction {
  id: string;
  clientName: string;
  clientId: string;
  channel: 'email' | 'phone' | 'chat';
  date: Date;
  subject?: string;
  duration?: string;
  status: 'completed' | 'pending' | 'ongoing';
  notes?: string;
}

const HistoryTab: React.FC = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const firestore = useFirestore('clients/interactions');

  useEffect(() => {
    // Simulate loading data from Firestore
    const loadInteractions = async () => {
      setLoading(true);
      try {
        // Simulated data for the prototype
        const mockInteractions: Interaction[] = [
          {
            id: "int-1",
            clientName: "Jean Dupont",
            clientId: "client-1",
            channel: "phone",
            date: new Date(2023, 9, 15, 14, 30),
            duration: "12:45",
            status: "completed",
            notes: "Client souhaite modifier sa réservation du 20 octobre. Changement effectué."
          },
          {
            id: "int-2",
            clientName: "Marie Lambert",
            clientId: "client-2",
            channel: "email",
            date: new Date(2023, 9, 15, 10, 15),
            subject: "Demande d'information sur vos services VIP",
            status: "completed",
            notes: "J'ai répondu avec notre brochure VIP et nos tarifs."
          },
          {
            id: "int-3",
            clientName: "Pierre Martin",
            clientId: "client-3",
            channel: "chat",
            date: new Date(2023, 9, 14, 16, 45),
            status: "completed",
            notes: "Questions sur le processus d'annulation. J'ai clarifié notre politique."
          },
          {
            id: "int-4",
            clientName: "Jean Dupont",
            clientId: "client-1",
            channel: "email",
            date: new Date(2023, 9, 13, 9, 30),
            subject: "Confirmation de réservation #RT-789",
            status: "completed",
            notes: "Confirmation de réservation envoyée."
          },
          {
            id: "int-5",
            clientName: "Sophie Moreau",
            clientId: "client-4",
            channel: "chat",
            date: new Date(2023, 9, 12, 11, 15),
            status: "completed",
            notes: "Demande de renseignements sur les horaires de service."
          }
        ];
        
        // Sort by date - most recent first
        mockInteractions.sort((a, b) => b.date.getTime() - a.date.getTime());
        setInteractions(mockInteractions);
        setFilteredInteractions(mockInteractions);
        setLoading(false);
      } catch (error) {
        console.error("Error loading interactions:", error);
        toast.error("Erreur lors du chargement des interactions");
        setLoading(false);
      }
    };

    loadInteractions();
  }, []);

  // Filter interactions when search term or filter changes
  useEffect(() => {
    const filtered = interactions.filter(interaction => {
      // Apply channel filter
      if (channelFilter !== 'all' && interaction.channel !== channelFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          interaction.clientName.toLowerCase().includes(searchLower) ||
          (interaction.subject && interaction.subject.toLowerCase().includes(searchLower)) ||
          (interaction.notes && interaction.notes.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
    
    setFilteredInteractions(filtered);
  }, [searchTerm, channelFilter, interactions]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Badge className="bg-blue-500">Email</Badge>;
      case 'phone':
        return <Badge className="bg-green-500">Téléphone</Badge>;
      case 'chat':
        return <Badge className="bg-purple-500">Chat</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleViewDetails = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsDetailsOpen(true);
  };
  
  const handleClientHistoryFilter = (clientId: string) => {
    const clientName = interactions.find(i => i.clientId === clientId)?.clientName || '';
    setSearchTerm(clientName);
    toast.success(`Filtre appliqué pour ${clientName}`);
  };

  const getClientInteractions = (clientId: string) => {
    return interactions.filter(i => i.clientId === clientId).length;
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ListFilter className="h-6 w-6 text-indigo-500" />
              <h2 className="text-xl font-semibold">Historique des Interactions</h2>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher un client, sujet..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-1/4">
              <Select 
                value={channelFilter}
                onValueChange={(value) => setChannelFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les canaux</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Téléphone</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </TableHead>
                  <TableHead>Sujet/Durée</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                        <p className="text-gray-500">Chargement des interactions...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredInteractions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Aucune interaction trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInteractions.map((interaction) => (
                    <TableRow 
                      key={interaction.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewDetails(interaction)}
                    >
                      <TableCell className="font-medium">{interaction.clientName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(interaction.channel)}
                          <span>{interaction.channel === 'email' ? 'Email' : interaction.channel === 'phone' ? 'Téléphone' : 'Chat'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(interaction.date)}</TableCell>
                      <TableCell>
                        {interaction.channel === 'email' ? interaction.subject : 
                         interaction.channel === 'phone' ? `Durée: ${interaction.duration}` : 
                         'Chat en ligne'}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          interaction.status === 'completed' ? 'bg-green-500' : 
                          interaction.status === 'pending' ? 'bg-yellow-500' : 
                          'bg-blue-500'
                        }>
                          {interaction.status === 'completed' ? 'Terminé' : 
                           interaction.status === 'pending' ? 'En attente' : 
                           'En cours'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Interaction Details Dialog */}
          {selectedInteraction && (
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Détails de l'interaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <User className="h-6 w-6 text-gray-500" />
                      <div>
                        <h3 className="text-lg font-medium">{selectedInteraction.clientName}</h3>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-blue-500" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClientHistoryFilter(selectedInteraction.clientId);
                            setIsDetailsOpen(false);
                          }}
                        >
                          Voir toutes les interactions ({getClientInteractions(selectedInteraction.clientId)})
                        </Button>
                      </div>
                    </div>
                    {getChannelBadge(selectedInteraction.channel)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date et heure</p>
                      <p>{formatDate(selectedInteraction.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {selectedInteraction.channel === 'phone' ? 'Durée de l\'appel' : 'Sujet'}
                      </p>
                      <p>
                        {selectedInteraction.channel === 'phone' ? selectedInteraction.duration : 
                         selectedInteraction.channel === 'email' ? selectedInteraction.subject : 
                         'Chat en ligne'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {selectedInteraction.notes || "Aucune note pour cette interaction."}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Tabs defaultValue="details">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Détails</TabsTrigger>
                        <TabsTrigger value="history">Historique Client</TabsTrigger>
                        <TabsTrigger value="reservations">Réservations</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4 pt-4">
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Actions effectuées</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Interaction enregistrée le {formatDate(selectedInteraction.date)}</li>
                            {selectedInteraction.notes && <li>Notes ajoutées par l'agent</li>}
                            {selectedInteraction.status === 'completed' && <li>Marquée comme terminée</li>}
                          </ul>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="history" className="pt-4">
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Interactions récentes</h4>
                          {interactions
                            .filter(i => i.clientId === selectedInteraction.clientId)
                            .slice(0, 3)
                            .map((interaction, index) => (
                              <div key={index} className="border-b pb-2 mb-2 last:border-0">
                                <div className="flex justify-between">
                                  <div className="flex items-center space-x-2">
                                    {getChannelIcon(interaction.channel)}
                                    <span className="text-sm">{formatDate(interaction.date)}</span>
                                  </div>
                                  <Badge className={
                                    interaction.status === 'completed' ? 'bg-green-500' : 
                                    interaction.status === 'pending' ? 'bg-yellow-500' : 
                                    'bg-blue-500'
                                  }>
                                    {interaction.status === 'completed' ? 'Terminé' : 
                                     interaction.status === 'pending' ? 'En attente' : 
                                     'En cours'}
                                  </Badge>
                                </div>
                                <p className="text-sm mt-1 text-gray-700 truncate">
                                  {interaction.notes?.substring(0, 60)}
                                  {interaction.notes && interaction.notes.length > 60 ? '...' : ''}
                                </p>
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="reservations" className="pt-4">
                        <div className="border-t pt-4">
                          <p className="text-gray-500 text-center py-4">
                            Les réservations du client seront affichées ici dans une version future.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={() => setIsDetailsOpen(false)}>
                    Fermer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
