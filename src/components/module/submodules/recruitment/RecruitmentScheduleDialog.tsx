
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RecruitmentPost } from '@/types/recruitment';

interface RecruitmentScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruitment: RecruitmentPost | null;
  onSuccess?: () => void;
}

const RecruitmentScheduleDialog: React.FC<RecruitmentScheduleDialogProps> = ({
  open,
  onOpenChange,
  recruitment,
  onSuccess
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    time: "09:00",
    duration: "30",
    type: "Premier entretien",
    participants: "",
    location: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSchedule = () => {
    if (!date) {
      toast({
        title: "Date manquante",
        description: "Veuillez sélectionner une date pour l'entretien.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.time || !formData.type) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Implement the scheduling logic here
    console.log("Scheduling interview:", {
      recruitmentId: recruitment?.id,
      recruitmentPosition: recruitment?.position,
      date: date,
      ...formData
    });

    toast({
      title: "Entretien planifié",
      description: `L'entretien a été planifié pour le ${format(date, 'P', { locale: fr })} à ${formData.time}.`,
    });

    if (onSuccess) onSuccess();
    onOpenChange(false);
  };

  if (!recruitment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Planifier un entretien</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Poste concerné</Label>
            <div className="font-medium text-md">{recruitment.position}</div>
            <div className="text-sm text-gray-500">{recruitment.department} • {recruitment.location}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de l'entretien *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "P", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type d'entretien *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premier entretien">Premier entretien</SelectItem>
                  <SelectItem value="Deuxième entretien">Deuxième entretien</SelectItem>
                  <SelectItem value="Entretien technique">Entretien technique</SelectItem>
                  <SelectItem value="Entretien final">Entretien final</SelectItem>
                  <SelectItem value="Test pratique">Test pratique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Durée de l'entretien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1 heure 30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                placeholder="ex: Marie Dupont, Jean Martin"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="ex: Salle de réunion 3, Visioconférence"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Informations supplémentaires"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSchedule}>
            Planifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecruitmentScheduleDialog;
