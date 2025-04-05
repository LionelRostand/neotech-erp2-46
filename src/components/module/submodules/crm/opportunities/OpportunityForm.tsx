
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Opportunity, OpportunityFormData } from '../types/crm-types';

interface OpportunityFormProps {
  onSubmit: (data: OpportunityFormData) => void;
  initialData?: Partial<OpportunityFormData>;
  buttonText?: string;
  isSubmitting?: boolean;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  onSubmit,
  initialData,
  buttonText = "Enregistrer",
  isSubmitting = false
}) => {
  const [formData, setFormData] = React.useState<OpportunityFormData>({
    name: '',
    clientName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    value: 0,
    probability: 50,
    stage: 'lead',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      setFormData(prev => ({ ...prev, [name]: numberValue }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date.toISOString().split('T')[0] }));
    }
  };

  const stages = ['lead', 'qualified', 'needs-analysis', 'proposal', 'negotiation', 'closed-won', 'closed-lost', 'new', 'quote_sent', 'pending', 'won', 'lost'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'opportunité</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="contactName">Nom du contact</Label>
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
            value={formData.contactEmail || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Téléphone du contact</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Montant</Label>
          <Input
            id="value"
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value || (formData as any).amount || 0}
            onChange={handleNumberChange}
            required
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
            value={formData.probability || 50}
            onChange={handleNumberChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage">Étape</Label>
          <Select
            value={formData.stage}
            onValueChange={(value) => handleSelectChange('stage', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une étape" />
            </SelectTrigger>
            <SelectContent>
              {stages.map(stage => (
                <SelectItem key={stage} value={stage}>
                  {stage === 'lead' ? 'Lead' : 
                  stage === 'qualified' ? 'Qualifié' : 
                  stage === 'needs-analysis' ? 'Analyse des besoins' : 
                  stage === 'proposal' ? 'Proposition' : 
                  stage === 'negotiation' ? 'Négociation' : 
                  stage === 'closed-won' ? 'Gagné' : 
                  stage === 'closed-lost' ? 'Perdu' : 
                  stage === 'new' ? 'Nouveau' :
                  stage === 'quote_sent' ? 'Devis envoyé' :
                  stage === 'pending' ? 'En attente' :
                  stage === 'won' ? 'Gagné' :
                  stage === 'lost' ? 'Perdu' : stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(new Date(formData.startDate), "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                onSelect={(date) => handleDateChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="closeDate">Date de clôture prévue</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.closeDate && !formData.expectedCloseDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.closeDate || formData.expectedCloseDate ? (
                  format(new Date(formData.closeDate || formData.expectedCloseDate || ''), "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.closeDate ? new Date(formData.closeDate) : 
                         formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : undefined}
                onSelect={(date) => {
                  handleDateChange('closeDate', date);
                  if (formData.expectedCloseDate) {
                    handleDateChange('expectedCloseDate', date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleInputChange}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Enregistrement..." : buttonText}
      </Button>
    </form>
  );
};

export default OpportunityForm;
