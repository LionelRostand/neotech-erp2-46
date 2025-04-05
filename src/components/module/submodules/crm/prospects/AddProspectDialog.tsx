
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ProspectFormData } from '../types/crm-types';
import ProspectForm from './ProspectForm';

interface AddProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ProspectFormData) => void;
}

const AddProspectDialog: React.FC<AddProspectDialogProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProspectFormData>({
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    status: 'new',
    source: 'Site web',
    lastContact: new Date().toISOString().split('T')[0],
    notes: '',
    industry: '',
    website: '',
    address: '',
    size: 'small',
    estimatedValue: 0,
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onAdd(formData);
      // Reset form after successful submission
      setFormData({
        company: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        status: 'new',
        source: 'Site web',
        lastContact: new Date().toISOString().split('T')[0],
        notes: '',
        industry: '',
        website: '',
        address: '',
        size: 'small',
        estimatedValue: 0,
        name: '',
        email: '',
        phone: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourcesOptions = ['Site web', 'LinkedIn', 'Salon', 'Recommandation', 'Appel entrant', 'Email', 'Autre'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau prospect</DialogTitle>
        </DialogHeader>
        
        <ProspectForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          sourcesOptions={sourcesOptions}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          buttonText="Ajouter le prospect"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProspectDialog;
