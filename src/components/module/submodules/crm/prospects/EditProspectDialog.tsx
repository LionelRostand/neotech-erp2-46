
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prospect, ProspectFormData } from '../types/crm-types';
import ProspectForm from './ProspectForm';

interface EditProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  onUpdate: (data: ProspectFormData) => void;
  sourceOptions: { value: string; label: string; }[];
  statusOptions: { value: string; label: string; }[];
}

const EditProspectDialog: React.FC<EditProspectDialogProps> = ({
  isOpen,
  onClose,
  prospect,
  onUpdate,
  sourceOptions,
  statusOptions
}) => {
  // Convert Prospect to ProspectFormData
  const [formData, setFormData] = useState<ProspectFormData>({
    name: prospect.name,
    company: prospect.company,
    contactName: prospect.contactName,
    contactEmail: prospect.contactEmail,
    contactPhone: prospect.contactPhone,
    email: prospect.email,
    phone: prospect.phone,
    status: prospect.status,
    source: prospect.source,
    industry: prospect.industry,
    website: prospect.website,
    address: prospect.address,
    size: prospect.size,
    estimatedValue: prospect.estimatedValue,
    notes: prospect.notes,
    lastContact: prospect.lastContact
  });

  // Update form data when prospect changes
  useEffect(() => {
    setFormData({
      name: prospect.name,
      company: prospect.company,
      contactName: prospect.contactName,
      contactEmail: prospect.contactEmail,
      contactPhone: prospect.contactPhone,
      email: prospect.email,
      phone: prospect.phone,
      status: prospect.status,
      source: prospect.source,
      industry: prospect.industry,
      website: prospect.website,
      address: prospect.address,
      size: prospect.size,
      estimatedValue: prospect.estimatedValue,
      notes: prospect.notes,
      lastContact: prospect.lastContact
    });
  }, [prospect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (data: ProspectFormData) => {
    onUpdate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le prospect</DialogTitle>
        </DialogHeader>
        
        <ProspectForm 
          initialData={prospect}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          onSubmit={handleSubmit}
          buttonText="Mettre à jour"
          sourceOptions={sourceOptions}
          statusOptions={statusOptions}
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

export default EditProspectDialog;
