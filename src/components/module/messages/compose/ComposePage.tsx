
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Contact, MessageFormData, MessagePriority, MessageCategory } from '../types/message-types';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Paperclip, 
  Send, 
  Tag, 
  ChevronDown, 
  Search,
  X,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MessageEditor from './MessageEditor';
import ScheduleSelector from './ScheduleSelector';

const ComposePage: React.FC = () => {
  const { getAll, add } = useFirestore(COLLECTIONS.CONTACTS);
  const messageCollection = useFirestore(COLLECTIONS.MESSAGES.INBOX);
  const scheduledCollection = useFirestore(COLLECTIONS.MESSAGES.SCHEDULED);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedContactId = searchParams.get('to');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [category, setCategory] = useState<MessageCategory | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);

  // Récupérer tous les contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsData = await getAll();
        if (contactsData.length > 0) {
          setContacts(contactsData as Contact[]);
          setFilteredContacts(contactsData as Contact[]);
          
          // Si un ID de contact est spécifié dans l'URL, le préselectionner
          if (preSelectedContactId) {
            const selectedContact = contactsData.find(c => c.id === preSelectedContactId);
            if (selectedContact) {
              setSelectedContacts([selectedContact as Contact]);
            }
          }
        } else {
          // Créer des données fictives pour la démo
          const mockContacts: Contact[] = Array.from({ length: 10 }, (_, i) => ({
            id: `mock-${i+1}`,
            firstName: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Philippe', 'Anne', 'Thomas', 'Claire', 'Paul', 'Julie'][i],
            lastName: ['Dupont', 'Martin', 'Durand', 'Bernard', 'Petit', 'Robert', 'Richard', 'Dubois', 'Moreau', 'Laurent'][i],
            email: `contact${i+1}@example.com`,
            phone: `+33 6 12 34 56 ${i+1}${i+1}`,
            company: ['NeoTech', 'EcoCorp', 'DataSoft', 'MegaSolutions', 'TechInnovate'][i % 5],
            position: ['Directeur', 'Chef de projet', 'Développeur', 'Designer', 'Commercial'][i % 5],
            isActive: true,
            createdAt: new Date() as any,
            updatedAt: new Date() as any
          }));
          setContacts(mockContacts);
          setFilteredContacts(mockContacts);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les contacts."
        });
      }
    };

    fetchContacts();
  }, [getAll, preSelectedContactId, toast]);

  // Filtrer les contacts en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = contacts.filter(contact => 
        !selectedContacts.some(sc => sc.id === contact.id) && (
          contact.firstName.toLowerCase().includes(term) ||
          contact.lastName.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.company?.toLowerCase().includes(term)
        )
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts, selectedContacts]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContacts(prev => [...prev, contact]);
    setSearchTerm('');
    setShowContactSearch(false);
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachments(prev => prev.filter(file => file.name !== fileName));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSendMessage = async () => {
    // Validation de base
    if (selectedContacts.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins un destinataire."
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir un objet pour le message."
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le contenu du message ne peut pas être vide."
      });
      return;
    }

    if (isScheduled && !scheduledDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une date d'envoi programmé."
      });
      return;
    }

    setIsSending(true);

    try {
      const now = Timestamp.now();
      const messageData = {
        subject,
        content,
        sender: 'current-user-id', // Remplacer par l'ID de l'utilisateur connecté
        recipients: selectedContacts.map(c => c.id),
        status: isScheduled ? 'scheduled' as MessageStatus : 'unread' as MessageStatus,
        priority,
        category,
        tags,
        hasAttachments: attachments.length > 0,
        isArchived: false,
        isScheduled,
        scheduledAt: isScheduled && scheduledDate ? Timestamp.fromDate(scheduledDate) : undefined,
        createdAt: now,
        updatedAt: now
      };

      // Choisir la collection en fonction de si le message est programmé ou non
      const collection = isScheduled ? scheduledCollection : messageCollection;
      
      // Pour la démo, simuler l'envoi avec un délai
      setTimeout(async () => {
        await collection.add(messageData);
        
        toast({
          title: isScheduled ? "Message programmé" : "Message envoyé",
          description: isScheduled 
            ? `Le message sera envoyé le ${scheduledDate?.toLocaleDateString()}` 
            : "Votre message a été envoyé avec succès."
        });
        
        // Rediriger vers la boîte de réception ou les messages programmés
        navigate(isScheduled ? '/modules/messages/scheduled' : '/modules/messages/inbox');
        
        setIsSending(false);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer."
      });
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Destinataires */}
            <div className="space-y-2">
              <Label htmlFor="recipients">Destinataires</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                {selectedContacts.map(contact => (
                  <Badge key={contact.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(contact.firstName, contact.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {`${contact.firstName} ${contact.lastName}`}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => setShowContactSearch(true)}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Ajouter un destinataire...
                  </Button>
                  
                  {showContactSearch && (
                    <div className="absolute z-10 mt-1 w-80 bg-white rounded-md shadow-lg border">
                      <div className="p-2">
                        <Input
                          placeholder="Rechercher un contact..."
                          className="mb-2"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                        <div className="max-h-60 overflow-y-auto">
                          {filteredContacts.length === 0 ? (
                            <div className="text-center py-2 text-sm text-muted-foreground">
                              Aucun contact trouvé
                            </div>
                          ) : (
                            filteredContacts.map(contact => (
                              <div 
                                key={contact.id}
                                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => handleSelectContact(contact)}
                              >
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={contact.avatar} />
                                  <AvatarFallback>
                                    {getInitials(contact.firstName, contact.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{`${contact.firstName} ${contact.lastName}`}</div>
                                  <div className="text-xs text-muted-foreground">{contact.email}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Objet */}
            <div className="space-y-2">
              <Label htmlFor="subject">Objet</Label>
              <Input 
                id="subject"
                placeholder="Objet du message" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Éditeur de message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <MessageEditor value={content} onChange={setContent} />
            </div>

            {/* Métadonnées supplémentaires */}
            <Tabs defaultValue="attachments">
              <TabsList>
                <TabsTrigger value="attachments">Pièces jointes</TabsTrigger>
                <TabsTrigger value="properties">Propriétés</TabsTrigger>
                <TabsTrigger value="schedule">Programmation</TabsTrigger>
              </TabsList>
              
              {/* Pièces jointes */}
              <TabsContent value="attachments" className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6">
                  <div className="flex flex-col items-center text-center">
                    <Paperclip className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Ajouter des pièces jointes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Glissez-déposez vos fichiers ici ou cliquez pour parcourir
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Parcourir les fichiers
                    </Button>
                  </div>
                </div>

                {/* Liste des fichiers ajoutés */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      Fichiers ajoutés ({attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveFile(file.name)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Propriétés */}
              <TabsContent value="properties" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priorité */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select 
                      value={priority} 
                      onValueChange={(value) => setPriority(value as MessagePriority)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Catégorie */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select 
                      value={category || ""} 
                      onValueChange={(value) => setCategory(value as MessageCategory || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Non catégorisé</SelectItem>
                        <SelectItem value="general">Général</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="technical">Technique</SelectItem>
                        <SelectItem value="administrative">Administratif</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Ajouter un tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 ml-1 p-0"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        Aucun tag ajouté
                      </span>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Programmation */}
              <TabsContent value="schedule" className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="schedule-checkbox"
                    className="mt-1"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                  />
                  <div>
                    <Label 
                      htmlFor="schedule-checkbox" 
                      className="font-medium"
                    >
                      Programmer l'envoi
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Le message sera envoyé automatiquement à la date et l'heure spécifiées
                    </p>
                  </div>
                </div>
                
                {isScheduled && (
                  <ScheduleSelector 
                    date={scheduledDate}
                    onDateChange={setScheduledDate}
                  />
                )}
                
                <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded border border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">
                      Les messages programmés peuvent être modifiés ou annulés avant leur envoi depuis l'onglet "Programmés".
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/modules/messages/inbox')}
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isScheduled ? "Programmation en cours..." : "Envoi en cours..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {isScheduled ? "Programmer" : "Envoyer"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComposePage;
