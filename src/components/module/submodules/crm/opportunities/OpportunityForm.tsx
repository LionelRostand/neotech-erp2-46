
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

interface OpportunityFormProps {
  initialData?: Opportunity;
  onSubmit: (data: OpportunityFormData) => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  initialData,
  onSubmit
}) => {
  const { getAllStages } = useOpportunityUtils();
  const stageOptions = getAllStages();

  const [formData, setFormData] = useState<OpportunityFormData>({
    title: '',
    description: '',
    stage: OpportunityStage.LEAD,
    probability: 10,
    amount: 0,
    clientName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    assignedTo: '',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    closeDate: '',
    notes: ''
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        stage: initialData.stage || OpportunityStage.LEAD,
        clientId: initialData.clientId,
        probability: initialData.probability || 10,
        amount: initialData.amount || 0,
        value: initialData.value || 0,
        clientName: initialData.clientName || '',
        contactName: initialData.contactName || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
        assignedTo: initialData.assignedTo || '',
        startDate: new Date().toISOString().split('T')[0],
        closeDate: initialData.expectedCloseDate || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseFloat(value) : 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stage">Statut</Label>
          <Select
            value={formData.stage}
            onValueChange={(value) => handleSelectChange('stage', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Client Information */}
        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du client</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact</Label>
          <Input
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email du contact</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Téléphone du contact</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Financial Details */}
        <div className="space-y-2">
          <Label htmlFor="value">Valeur (€)</Label>
          <Input
            id="value"
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={handleNumberChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="probability">Probabilité (%)</Label>
          <Input
            id="probability"
            name="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability || 0}
            onChange={handleNumberChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigné à</Label>
          <Input
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Dates */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Non spécifié'}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="closeDate">Date de clôture prévue</Label>
          <Input
            id="closeDate"
            name="closeDate"
            type="date"
            value={formData.closeDate}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            {formData.closeDate ? new Date(formData.closeDate).toLocaleDateString() : 'Non spécifié'}
          </p>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
        />
      </div>
      
      <Button type="submit" className="w-full">
        {initialData ? 'Mettre à jour' : 'Ajouter'}
      </Button>
    </form>
  );
};

export default OpportunityForm;
