
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Member, MemberWithLoans } from '../../types/library-types';
import { memberFormSchema, MemberFormValues } from './memberFormSchema';

interface UseMemberFormProps {
  member?: Member | MemberWithLoans;
  onSubmit: (data: MemberFormValues) => void;
  mode: 'add' | 'edit';
}

export const useMemberForm = ({ member, onSubmit, mode }: UseMemberFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      firstName: member?.firstName || '',
      lastName: member?.lastName || '',
      email: member?.email || '',
      phone: member?.phone || '',
      address: member?.address || '',
      subscriptionType: member?.subscriptionType || 'free',
      status: member?.status || 'active',
      notes: member?.notes || '',
    },
  });

  // Reset form when member changes
  useEffect(() => {
    if (member) {
      form.reset({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        subscriptionType: member.subscriptionType || 'free',
        status: member.status || 'active',
        notes: member.notes || '',
      });
    }
  }, [member, form]);

  const handleSubmit = async (values: MemberFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting
  };
};
