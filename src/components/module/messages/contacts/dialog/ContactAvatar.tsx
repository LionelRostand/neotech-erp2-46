
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ContactAvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string;
}

const ContactAvatar: React.FC<ContactAvatarProps> = ({ 
  firstName, 
  lastName, 
  avatar 
}) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex justify-center mb-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatar} />
        <AvatarFallback className="text-xl">
          {firstName && lastName 
            ? getInitials(firstName, lastName)
            : <User className="h-10 w-10" />
          }
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ContactAvatar;
