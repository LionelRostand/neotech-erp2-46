
import React from 'react';
import { Message, Contact } from '../types/message-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  Reply, 
  ReplyAll, 
  Forward, 
  Archive, 
  Star, 
  Trash2, 
  MoreHorizontal,
  Paperclip, 
  Download,
  Calendar,
  Tag,
  Printer
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MessageViewProps {
  message: Message;
  contact: Contact | undefined;
  onArchive: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onReply: () => void;
  onBack: () => void;
}

const MessageView: React.FC<MessageViewProps> = ({
  message,
  contact,
  onArchive,
  onToggleFavorite,
  onDelete,
  onReply,
  onBack
}) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getPriorityBadge = () => {
    switch (message.priority) {
      case 'low':
        return <Badge variant="outline" className="bg-gray-100">Basse</Badge>;
      case 'normal':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Normale</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Haute</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-3 flex justify-between items-center bg-gray-50">
        <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onReply}>
            <Reply className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Forward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <Archive className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFavorite}
          >
            <Star 
              className={`h-5 w-5 ${message.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`} 
            />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="h-4 w-4 mr-2" />
                Ajouter un tag
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Créer un événement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-4">{message.subject}</h1>
          
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="mt-1">
              <AvatarImage src={contact?.avatar} />
              <AvatarFallback>
                {contact 
                  ? getInitials(contact.firstName, contact.lastName)
                  : '?'
                }
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-wrap justify-between">
                <div>
                  <div className="font-medium">
                    {contact 
                      ? `${contact.firstName} ${contact.lastName}`
                      : 'Contact inconnu'
                    }
                  </div>
                  {contact && (
                    <div className="text-sm text-muted-foreground">
                      {contact.email}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {formatDate(message.createdAt)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {getPriorityBadge()}
                
                {message.category && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {message.category}
                  </Badge>
                )}
                
                {message.tags && message.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenu du message */}
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        
        {/* Pièces jointes */}
        {message.hasAttachments && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Paperclip className="h-4 w-4 mr-2" />
              Pièces jointes (2)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2].map((_, i) => (
                <div 
                  key={i}
                  className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-3 text-xs uppercase font-medium">
                      {i === 0 ? 'PDF' : 'DOCX'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {i === 0 ? 'Document-presentation.pdf' : 'Contrat-type.docx'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {i === 0 ? '1.2 MB' : '568 KB'}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t p-3 bg-gray-50">
        <Button variant="default" onClick={onReply} className="w-full sm:w-auto">
          <Reply className="mr-2 h-4 w-4" />
          Répondre
        </Button>
      </div>
    </div>
  );
};

export default MessageView;
