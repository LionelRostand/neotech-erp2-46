
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

interface ProspectFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  sourcesOptions: string[];
  onSubmit: () => void;
  isSubmitting?: boolean;
  buttonText?: string;
}

const ProspectForm: React.FC<ProspectFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  sourcesOptions,
  onSubmit,
  isSubmitting = false,
  buttonText = "Enregistrer"
}) => {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const lastContact = date.toISOString().split('T')[0];
      handleSelectChange('lastContact', lastContact);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactName">Nom du contact</Label>
          <Input
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Téléphone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select 
            value={formData.source} 
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une source" />
            </SelectTrigger>
            <SelectContent>
              {sourcesOptions.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="contacted">Contacté</SelectItem>
              <SelectItem value="qualified">Qualifié</SelectItem>
              <SelectItem value="unqualified">Non qualifié</SelectItem>
              <SelectItem value="hot">Chaud</SelectItem>
              <SelectItem value="warm">Tiède</SelectItem>
              <SelectItem value="cold">Froid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Secteur d'activité</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            name="website"
            value={formData.website || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastContact">Dernier contact</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.lastContact && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.lastContact ? (
                  format(new Date(formData.lastContact), "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.lastContact ? new Date(formData.lastContact) : undefined}
                onSelect={handleDateChange}
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

export default ProspectForm;
