import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, Contact } from '../types/message-types';
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
import { Search, Filter, MoreHorizontal, Archive, Star, Trash2, Reply, Mail, Tag, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MessagesList from './MessagesList';
import MessageView from './MessageView';

const InboxPage: React.FC = () => {
  const { getAll } = useFirestore(COLLECTIONS.MESSAGES.INBOX);
  const contactsCollection = useFirestore(COLLECTIONS.CONTACTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Record<string, Contact>>({});
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const { toast } = useToast();

  // Récupérer les messages et les contacts
  useEffect(() => {
    // Éviter la récupération répétée des données
    if (dataFetched) return;
    
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
        
        // Récupérer les messages
        const messagesData = await getAll();
        
        if (messagesData.length === 0) {
          // Créer des données fictives pour la démo
          const mockMessages: Message[] = Array.from({ length: 15 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i % 7);
            
            return {
              id: `mock-message-${i+1}`,
              subject: [
                'Proposition commerciale - Projet NeoTech',
                'Réunion de planification - Jeudi prochain',
                'Demande d\'information sur vos services',
                'Facture #F-2023-156',
                'Invitation à l\'événement Tech Summit'
              ][i % 5],
              content: `<p>Bonjour,</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget.</p><p>Cordialement,<br />L'équipe NeoTech</p>`,
              sender: Object.keys(contactsMap)[i % Object.keys(contactsMap).length],
              recipients: ['current-user-id'],
              status: ['read', 'unread', 'unread'][i % 3] as any,
              priority: ['normal', 'high', 'low', 'urgent'][i % 4] as any,
              category: ['general', 'commercial', 'support', 'technical'][i % 4] as any,
              tags: i % 3 === 0 ? ['important', 'suivi'] : i % 2 === 0 ? ['client'] : [],
              hasAttachments: i % 4 === 0,
              isFavorite: i % 5 === 0,
              createdAt: date as any,
              updatedAt: date as any,
            };
          });
          
          setMessages(mockMessages);
          setFilteredMessages(mockMessages);
        } else {
          setMessages(messagesData as Message[]);
          setFilteredMessages(messagesData as Message[]);
        }
        
        setDataFetched(true);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les messages."
        });
        
        setDataFetched(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAll, contactsCollection, toast, dataFetched]);

  // Filtrer les messages selon les critères
  useEffect(() => {
    let filtered = [...messages];
    
    // Filtrage par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(message => 
        message.subject.toLowerCase().includes(term) ||
        (contacts[message.sender]?.firstName.toLowerCase().includes(term)) ||
        (contacts[message.sender]?.lastName.toLowerCase().includes(term)) ||
        (contacts[message.sender]?.email.toLowerCase().includes(term)) ||
        message.content.toLowerCase().includes(term)
      );
    }
    
    // Filtrage par catégorie/statut
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(message => message.status === 'unread');
        break;
      case 'favorites':
        filtered = filtered.filter(message => message.isFavorite);
        break;
      case 'attachments':
        filtered = filtered.filter(message => message.hasAttachments);
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

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // Marquer le message comme lu s'il est non lu
    if (message.status === 'unread') {
      markMessageAsRead(message.id);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    // Pour la démo, mettre à jour uniquement le state local
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'read' as any, readAt: new Date() as any } 
          : msg
      )
    );
  };

  const handleArchiveMessage = (messageId: string) => {
    // Pour la démo, retirer le message de la liste
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setSelectedMessage(null);
    
    toast({
      title: "Message archivé",
      description: "Le message a été déplacé vers les archives."
    });
  };

  const handleToggleFavorite = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isFavorite: !msg.isFavorite } 
          : msg
      )
    );
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(prev => 
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    // Pour la démo, retirer le message de la liste
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setSelectedMessage(null);
    
    toast({
      title: "Message supprimé",
      description: "Le message a été supprimé définitivement."
    });
  };

  const handleReplyToMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      // Rediriger vers la page de composition avec le contact préselectionné
      window.location.href = `/modules/messages/compose?to=${message.sender}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Boîte de réception</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les messages..."
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
                  <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    <Mail className="mr-2 h-4 w-4" />
                    Tous les messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('unread')}>
                    <Badge variant="secondary" className="mr-2 px-1 py-0">
                      !
                    </Badge>
                    Non lus
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('favorites')}>
                    <Star className="mr-2 h-4 w-4" />
                    Favoris
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('attachments')}>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Avec pièces jointes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('high-priority')}>
                    <Badge variant="destructive" className="mr-2 px-1 py-0">
                      !
                    </Badge>
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
          <div className="flex flex-col lg:flex-row h-[calc(100vh-260px)] min-h-[500px] overflow-hidden border rounded-md">
            {/* Liste des messages */}
            <div className={`w-full ${selectedMessage ? 'lg:w-1/3 xl:w-2/5 hidden lg:block' : 'lg:w-full'} border-r overflow-hidden`}>
              <MessagesList
                messages={filteredMessages}
                contacts={contacts}
                selectedMessageId={selectedMessage?.id}
                onSelectMessage={handleSelectMessage}
                onToggleFavorite={handleToggleFavorite}
                onArchiveMessage={handleArchiveMessage}
                isLoading={isLoading}
              />
            </div>
            
            {/* Affichage d'un message */}
            <div className={`w-full ${selectedMessage ? 'block' : 'hidden lg:block lg:w-2/3 xl:w-3/5'}`}>
              {selectedMessage ? (
                <MessageView
                  message={selectedMessage}
                  contact={contacts[selectedMessage.sender]}
                  onArchive={() => handleArchiveMessage(selectedMessage.id)}
                  onToggleFavorite={() => handleToggleFavorite(selectedMessage.id)}
                  onDelete={() => handleDeleteMessage(selectedMessage.id)}
                  onReply={() => handleReplyToMessage(selectedMessage.id)}
                  onBack={() => setSelectedMessage(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Mail className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Sélectionnez un message
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Cliquez sur un message dans la liste pour afficher son contenu ici.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InboxPage;
