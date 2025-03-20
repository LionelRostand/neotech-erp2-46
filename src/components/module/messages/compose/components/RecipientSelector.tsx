
import React from 'react';
import { Contact } from '../../types/message-types';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecipientSelectorProps {
  selectedContacts: Contact[];
  filteredContacts: Contact[];
  searchTerm: string;
  showContactSearch: boolean;
  getInitials: (firstName: string, lastName: string) => string;
  onSearchChange: (value: string) => void;
  onShowContactSearch: (show: boolean) => void;
  onSelectContact: (contact: Contact) => void;
  onRemoveContact: (contactId: string) => void;
}

const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  selectedContacts,
  filteredContacts,
  searchTerm,
  showContactSearch,
  getInitials,
  onSearchChange,
  onShowContactSearch,
  onSelectContact,
  onRemoveContact
}) => {
  return (
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
              onClick={() => onRemoveContact(contact.id)}
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
            onClick={() => onShowContactSearch(true)}
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
                  onChange={(e) => onSearchChange(e.target.value)}
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
                        onClick={() => onSelectContact(contact)}
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
  );
};

export default RecipientSelector;
