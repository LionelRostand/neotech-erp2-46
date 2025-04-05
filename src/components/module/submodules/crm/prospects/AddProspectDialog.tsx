
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  // Local state to manage form data
  const [formData, setFormData] = useState<ProspectFormData>({
    name: '',
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    email: '',
    phone: '',
    status: 'new',
    source: 'Site web',
    lastContact: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (data: ProspectFormData) => {
    onAdd(data);
    // Reset form
    setFormData({
      name: '',
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      email: '',
      phone: '',
      status: 'new',
      source: 'Site web',
      lastContact: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un prospect</DialogTitle>
        </DialogHeader>
        
        <ProspectForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          onSubmit={handleSubmit}
          buttonText="Ajouter"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProspectDialog;
