
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  onCancel: () => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { getStageLabel } = useOpportunityUtils();
  
  const [formData, setFormData] = useState<OpportunityFormData>(
    initialData || {
      title: '',
      clientName: '',
      clientId: '',
      amount: 0,
      probability: 50,
      stage: 'new',
      expectedCloseDate: new Date().toISOString().split('T')[0],
      assignedTo: '',
      notes: '',
      products: []
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' || name === 'probability' ? Number(value) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const stages: OpportunityStage[] = ['new', 'negotiation', 'quote_sent', 'pending', 'won', 'lost'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de l'opportunité *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Projet d'implémentation CRM"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du client *</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Ex: Société ABC"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Montant (€) *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="100"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="probability">Probabilité de succès (%)</Label>
          <Input
            id="probability"
            name="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage">Étape *</Label>
          <Select
            value={formData.stage || "new"}
            onValueChange={(value) => handleSelectChange('stage', value)}
          >
            <SelectTrigger id="stage">
              <SelectValue placeholder="Sélectionner une étape" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {getStageLabel(stage)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedCloseDate">Date de clôture prévue *</Label>
          <Input
            id="expectedCloseDate"
            name="expectedCloseDate"
            type="date"
            value={formData.expectedCloseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Commercial assigné</Label>
          <Input
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo || ''}
            onChange={handleChange}
            placeholder="Ex: Jean Dupont"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={4}
          placeholder="Informations supplémentaires sur cette opportunité..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Mettre à jour' : 'Créer l\'opportunité'}
        </button>
      </div>
    </form>
  );
};

export default OpportunityForm;
