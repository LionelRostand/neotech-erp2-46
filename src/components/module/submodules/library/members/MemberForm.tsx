
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Member, MemberWithLoans } from '../types/library-types';
import { useMemberForm } from './form/useMemberForm';
import { MemberFormValues } from './form/memberFormSchema';
import PersonalInfoFields from './form/PersonalInfoFields';
import SubscriptionFields from './form/SubscriptionFields';
import NotesField from './form/NotesField';
import FormActions from './form/FormActions';

interface MemberFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member | MemberWithLoans;
  onSubmit: (data: MemberFormValues) => void;
  mode: 'add' | 'edit';
}

const MemberForm: React.FC<MemberFormProps> = ({
  isOpen,
  onOpenChange,
  member,
  onSubmit,
  mode
}) => {
  const { form, handleSubmit, isSubmitting } = useMemberForm({
    member,
    onSubmit,
    mode
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Ajouter un adhérent' : 'Modifier un adhérent'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PersonalInfoFields form={form} />
            <SubscriptionFields form={form} />
            <NotesField form={form} />
            <FormActions 
              onCancel={() => onOpenChange(false)} 
              isSubmitting={isSubmitting}
              mode={mode}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberForm;
