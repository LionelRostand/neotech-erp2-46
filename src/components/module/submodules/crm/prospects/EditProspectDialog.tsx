
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Prospect, ProspectFormData } from '../types/crm-types';
import ProspectForm from './ProspectForm';

interface EditProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  onUpdate: (data: ProspectFormData) => void;
}

const EditProspectDialog: React.FC<EditProspectDialogProps> = ({
  isOpen,
  onClose,
  prospect,
  onUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProspectFormData>({
    company: prospect.company,
    contactName: prospect.contactName || '',
    contactEmail: prospect.contactEmail || '',
    contactPhone: prospect.contactPhone || '',
    source: prospect.source || 'Site web',
    status: prospect.status || 'new',
    notes: prospect.notes || '',
    industry: prospect.industry || '',
    website: prospect.website || '',
    address: prospect.address || '',
    size: prospect.size || 'small',
    estimatedValue: prospect.estimatedValue || 0,
    name: prospect.name || '',
    email: prospect.email || '',
    phone: prospect.phone || '',
    lastContact: prospect.lastContact || new Date().toISOString().split('T')[0]
  });

  // Update form data when prospect changes
  useEffect(() => {
    setFormData({
      company: prospect.company,
      contactName: prospect.contactName || '',
      contactEmail: prospect.contactEmail || '',
      contactPhone: prospect.contactPhone || '',
      source: prospect.source || 'Site web',
      status: prospect.status || 'new',
      notes: prospect.notes || '',
      industry: prospect.industry || '',
      website: prospect.website || '',
      address: prospect.address || '',
      size: prospect.size || 'small',
      estimatedValue: prospect.estimatedValue || 0,
      name: prospect.name || '',
      email: prospect.email || '',
      phone: prospect.phone || '',
      lastContact: prospect.lastContact || new Date().toISOString().split('T')[0]
    });
  }, [prospect]);

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
      await onUpdate(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourcesOptions = ['Site web', 'LinkedIn', 'Salon', 'Recommandation', 'Appel entrant', 'Email', 'Autre'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le prospect</DialogTitle>
          <DialogDescription>
            Modification de {prospect.company} - {prospect.contactName || prospect.name}
          </DialogDescription>
        </DialogHeader>
        
        <ProspectForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          sourcesOptions={sourcesOptions}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          buttonText="Enregistrer les modifications"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProspectDialog;
