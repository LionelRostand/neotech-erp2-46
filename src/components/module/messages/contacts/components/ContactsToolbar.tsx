
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserPlus, 
  RefreshCw,
  Filter
} from 'lucide-react';

interface ContactsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateContact: () => void;
}

const ContactsToolbar: React.FC<ContactsToolbarProps> = ({
  search,
  onSearchChange,
  onCreateContact
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Input
        type="search"
        placeholder="Rechercher un contact..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
        <Button onClick={onCreateContact}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau contact
        </Button>
      </div>
    </div>
  );
};

export default ContactsToolbar;
