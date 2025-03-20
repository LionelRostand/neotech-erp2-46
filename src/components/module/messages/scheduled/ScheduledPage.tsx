
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, Contact } from '../types/message-types';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Search, Filter, MoreHorizontal, Calendar, Clock, Edit, Trash2, Send, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ScheduledPage: React.FC = () => {
  const { getAll, remove } = useFirestore(COLLECTIONS.MESSAGES.SCHEDULED);
  const contactsCollection = useFirestore(COLLECTIONS.CONTACTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Record<string, Contact>>({});
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [messageToCancel, setMessageToCancel] = useState<Message | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  // Récupérer les messages et les contacts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les contacts
        const contactsData = await contactsCollection.getAll();
        const contactsMap: Record<string, Contact> = {};
        contactsData.forEach(contact => {
          contactsMap[contact.id] = contact as Contact;
        });
        setContacts(contactsMap);
        
        // Récupérer les messages programmés
        const messagesData = await getAll();
        
        if (messagesData.length === 0) {
          // Créer des données fictives pour la démo
          const mockMessages: Message[] = Array.from({ length: 8 }, (_, i) => {
            const today = new Date();
            const scheduledDate = new Date();
            
            // Répartir les dates programmées sur les prochains jours
            scheduledDate.setDate(today.getDate() + i % 7 + 1);
            scheduledDate.setHours(9 + i % 8, (i * 15) % 60);
            
            return {
              id: `mock-scheduled-${i+1}`,
              subject: [
                'Proposition commerciale à envoyer',
                'Suivi de projet - Rapport hebdomadaire',
                'Invitation à la conférence annuelle',
                'Rappel: Échéance de paiement',
                'Lancement de produit - Annonce'
              ][i % 5],
              content: `<p>Bonjour,</p><p>Ce message est programmé pour être envoyé automatiquement. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Cordialement,<br />L'équipe NeoTech</p>`,
              sender: 'current-user-id',
              recipients: [Object.keys(contactsMap)[i % Object.keys(contactsMap).length]],
              status: 'scheduled' as any,
              priority: ['normal', 'high'][i % 2] as any,
              category: ['general', 'commercial', 'administrative'][i % 3] as any,
              tags: i % 3 === 0 ? ['automatique', 'important'] : i % 2 === 0 ? ['suivi'] : [],
              hasAttachments: i % 3 === 0,
              isScheduled: true,
              scheduledAt: scheduledDate as any,
              createdAt: today as any,
              updatedAt: today as any,
            };
          });
          
          setMessages(mockMessages);
          setFilteredMessages(mockMessages);
        } else {
          setMessages(messagesData as Message[]);
          setFilteredMessages(messagesData as Message[]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les messages programmés."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAll, contactsCollection.getAll, toast]);

  // Filtrer les messages selon les critères
  useEffect(() => {
    let filtered = [...messages];
    
    // Filtrage par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(message => 
        message.subject.toLowerCase().includes(term) ||
        message.recipients.some(recipientId => {
          const contact = contacts[recipientId];
          return (
            contact?.firstName.toLowerCase().includes(term) ||
            contact?.lastName.toLowerCase().includes(term) ||
            contact?.email.toLowerCase().includes(term)
          );
        }) ||
        message.content.toLowerCase().includes(term)
      );
    }
    
    // Filtrage par date
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);
    
    switch (filter) {
      case 'today':
        filtered = filtered.filter(message => {
          const scheduledDate = message.scheduledAt?.toDate();
          return scheduledDate && 
                 scheduledDate.getDate() === now.getDate() &&
                 scheduledDate.getMonth() === now.getMonth() && 
                 scheduledDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'tomorrow':
        filtered = filtered.filter(message => {
          const scheduledDate = message.scheduledAt?.toDate();
          const tomorrowDate = new Date(now);
          tomorrowDate.setDate(now.getDate() + 1);
          return scheduledDate && 
                 scheduledDate.getDate() === tomorrowDate.getDate() &&
                 scheduledDate.getMonth() === tomorrowDate.getMonth() && 
                 scheduledDate.getFullYear() === tomorrowDate.getFullYear();
        });
        break;
      case 'this-week':
        filtered = filtered.filter(message => {
          const scheduledDate = message.scheduledAt?.toDate();
          return scheduledDate && scheduledDate <= nextWeek;
        });
        break;
      case 'high-priority':
        filtered = filtered.filter(message => message.priority === 'high' || message.priority === 'urgent');
        break;
      case 'all':
      default:
        // Aucun filtrage supplémentaire
        break;
    }
    
    setFilteredMessages(filtered);
  }, [messages, searchTerm, filter, contacts]);

  const formatScheduledDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const formattedTime = format(date, 'HH:mm', { locale: fr });
    
    if (isToday) {
      return `Aujourd'hui à ${formattedTime}`;
    }
    
    if (isTomorrow) {
      return `Demain à ${formattedTime}`;
    }
    
    return format(date, "EEEE d MMMM 'à' HH:mm", { locale: fr });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRecipientsList = (recipientIds: string[]) => {
    return recipientIds.map(id => contacts[id])
                       .filter(Boolean)
                       .map(contact => `${contact.firstName} ${contact.lastName}`)
                       .join(', ');
  };

  const handleEditMessage = (messageId: string) => {
    // Rediriger vers la page de composition avec les données pré-remplies
    window.location.href = `/modules/messages/compose?edit=${messageId}`;
  };

  const handleCancelMessage = (message: Message) => {
    setMessageToCancel(message);
    setShowCancelDialog(true);
  };

  const confirmCancelMessage = async () => {
    if (!messageToCancel) return;
    
    try {
      await remove(messageToCancel.id);
      setMessages(prev => prev.filter(msg => msg.id !== messageToCancel.id));
      
      toast({
        title: "Envoi annulé",
        description: "Le message programmé a été annulé et supprimé."
      });
    } catch (error) {
      console.error("Erreur lors de l'annulation du message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler le message. Veuillez réessayer."
      });
    } finally {
      setShowCancelDialog(false);
      setMessageToCancel(null);
    }
  };

  const handleSendNow = (messageId: string) => {
    // Simuler l'envoi immédiat
    toast({
      title: "Message envoyé",
      description: "Le message a été envoyé immédiatement."
    });
    
    // Supprimer de la liste des messages programmés
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Messages programmés</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filtrer par date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Tous
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('today')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Aujourd'hui
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('tomorrow')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Demain
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('this-week')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Cette semaine
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter('high-priority')}>
                    <Badge variant="destructive" className="mr-2 px-1 py-0">!</Badge>
                    Haute priorité
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="default"
                onClick={() => window.location.href = '/modules/messages/compose'}
              >
                Nouveau message
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md divide-y">
            {isLoading ? (
              <div className="p-8 text-center">
                Chargement des messages programmés...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun message programmé</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Vous n'avez pas de messages programmés pour le moment. Vous pouvez créer un nouveau message et le programmer pour un envoi ultérieur.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => window.location.href = '/modules/messages/compose'}
                >
                  Créer un message programmé
                </Button>
              </div>
            ) : (
              filteredMessages.map(message => (
                <div key={message.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-amber-100 text-amber-800 rounded-full h-10 w-10 flex items-center justify-center">
                          <Clock className="h-5 w-5" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-base mb-1">
                          {message.subject}
                        </div>
                        
                        <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <span className="font-medium mr-1">À:</span>
                            {getRecipientsList(message.recipients) || 'Aucun destinataire'}
                          </div>
                          
                          <div className="flex items-center text-blue-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatScheduledDate(message.scheduledAt!)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.priority === 'high' && (
                            <Badge variant="destructive" className="px-1">
                              Priorité haute
                            </Badge>
                          )}
                          
                          {message.priority === 'urgent' && (
                            <Badge variant="destructive" className="px-1">
                              Urgent
                            </Badge>
                          )}
                          
                          {message.tags && message.tags.map(tag => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          
                          {message.hasAttachments && (
                            <Badge variant="secondary">
                              Pièces jointes
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditMessage(message.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendNow(message.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Envoyer maintenant
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCancelMessage(message)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-sm text-muted-foreground mt-4 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Les messages programmés sont envoyés automatiquement à la date et l'heure spécifiées.
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogue de confirmation d'annulation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler l'envoi du message ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler l'envoi de ce message programmé ? Cette action est irréversible.
              {messageToCancel && (
                <div className="mt-2 p-3 bg-gray-50 rounded border">
                  <div className="font-medium">{messageToCancel.subject}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Programmé pour: {messageToCancel.scheduledAt && formatScheduledDate(messageToCancel.scheduledAt)}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelMessage}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScheduledPage;
