
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, UserPlus } from 'lucide-react';

interface ContactFormActionsProps {
  isSubmitting: boolean;
  isNewContact: boolean;
  onCancel: () => void;
}

const ContactFormActions: React.FC<ContactFormActionsProps> = ({
  isSubmitting,
  isNewContact,
  onCancel
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : isNewContact ? (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Créer le contact
          </>
        ) : (
          "Enregistrer les modifications"
        )}
      </Button>
    </DialogFooter>
  );
};

export default ContactFormActions;
