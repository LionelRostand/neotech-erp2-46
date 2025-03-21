
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, Plus, Save, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ScheduleSettingsProps {
  onSave: () => void;
}

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche"
];

const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({ onSave }) => {
  const [regularHours, setRegularHours] = useState([
    { day: "Lundi", open: "09:00", close: "19:00", isOpen: true },
    { day: "Mardi", open: "09:00", close: "19:00", isOpen: true },
    { day: "Mercredi", open: "09:00", close: "19:00", isOpen: true },
    { day: "Jeudi", open: "09:00", close: "19:00", isOpen: true },
    { day: "Vendredi", open: "09:00", close: "20:00", isOpen: true },
    { day: "Samedi", open: "09:00", close: "18:00", isOpen: true },
    { day: "Dimanche", open: "10:00", close: "16:00", isOpen: false }
  ]);

  const [specialDates, setSpecialDates] = useState([
    { date: "2023-12-24", name: "Veille de Noël", open: "09:00", close: "16:00", isOpen: true },
    { date: "2023-12-25", name: "Jour de Noël", open: "00:00", close: "00:00", isOpen: false },
    { date: "2023-12-31", name: "Réveillon du Nouvel An", open: "09:00", close: "16:00", isOpen: true },
    { date: "2024-01-01", name: "Jour de l'An", open: "00:00", close: "00:00", isOpen: false }
  ]);

  const [timeSlotDuration, setTimeSlotDuration] = useState("30");
  const [maxBookingsPerSlot, setMaxBookingsPerSlot] = useState("3");
  const [maxAdvanceBookingDays, setMaxAdvanceBookingDays] = useState("30");
  const [minCancellationHours, setMinCancellationHours] = useState("24");

  const toggleDayOpen = (index: number) => {
    const newHours = [...regularHours];
    newHours[index].isOpen = !newHours[index].isOpen;
    setRegularHours(newHours);
  };

  const updateHours = (index: number, field: 'open' | 'close', value: string) => {
    const newHours = [...regularHours];
    newHours[index][field] = value;
    setRegularHours(newHours);
  };

  const toggleSpecialDateOpen = (index: number) => {
    const newDates = [...specialDates];
    newDates[index].isOpen = !newDates[index].isOpen;
    setSpecialDates(newDates);
  };

  const updateSpecialDate = (index: number, field: keyof typeof specialDates[0], value: string) => {
    const newDates = [...specialDates];
    newDates[index][field] = value;
    setSpecialDates(newDates);
  };

  const addSpecialDate = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSpecialDates([...specialDates, {
      date: formattedDate,
      name: "Jour spécial",
      open: "09:00",
      close: "18:00",
      isOpen: true
    }]);
  };

  const removeSpecialDate = (index: number) => {
    const newDates = [...specialDates];
    newDates.splice(index, 1);
    setSpecialDates(newDates);
  };

  return (
    <div className="space-y-6">
      {/* Horaires réguliers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Horaires d'Ouverture Réguliers</span>
          </CardTitle>
          <CardDescription>
            Définissez les heures d'ouverture habituelles de votre salon pour chaque jour de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jour</TableHead>
                <TableHead>Ouvert</TableHead>
                <TableHead>Heure d'ouverture</TableHead>
                <TableHead>Heure de fermeture</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regularHours.map((day, index) => (
                <TableRow key={day.day}>
                  <TableCell>{day.day}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={day.isOpen} 
                      onCheckedChange={() => toggleDayOpen(index)} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="time" 
                      value={day.open} 
                      onChange={(e) => updateHours(index, 'open', e.target.value)}
                      disabled={!day.isOpen}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="time" 
                      value={day.close} 
                      onChange={(e) => updateHours(index, 'close', e.target.value)}
                      disabled={!day.isOpen}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Jours spéciaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Jours Spéciaux et Vacances</span>
          </CardTitle>
          <CardDescription>
            Configurez des horaires spécifiques pour les jours fériés ou périodes particulières
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              {specialDates.map((date, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-md">
                  <div className="grid grid-cols-5 gap-4 flex-1">
                    <div>
                      <Label htmlFor={`date-${index}`}>Date</Label>
                      <Input 
                        id={`date-${index}`}
                        type="date" 
                        value={date.date} 
                        onChange={(e) => updateSpecialDate(index, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`name-${index}`}>Description</Label>
                      <Input 
                        id={`name-${index}`}
                        value={date.name} 
                        onChange={(e) => updateSpecialDate(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center space-x-2 h-10">
                        <Switch 
                          id={`open-${index}`}
                          checked={date.isOpen} 
                          onCheckedChange={() => toggleSpecialDateOpen(index)} 
                        />
                        <Label htmlFor={`open-${index}`}>{date.isOpen ? 'Ouvert' : 'Fermé'}</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`open-time-${index}`}>Ouverture</Label>
                      <Input 
                        id={`open-time-${index}`}
                        type="time" 
                        value={date.open} 
                        onChange={(e) => updateSpecialDate(index, 'open', e.target.value)}
                        disabled={!date.isOpen}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`close-time-${index}`}>Fermeture</Label>
                      <Input 
                        id={`close-time-${index}`}
                        type="time" 
                        value={date.close} 
                        onChange={(e) => updateSpecialDate(index, 'close', e.target.value)}
                        disabled={!date.isOpen}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSpecialDate(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={addSpecialDate}
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un jour spécial</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de réservation */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de Réservation</CardTitle>
          <CardDescription>
            Configurez les règles pour la prise de rendez-vous dans votre salon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="time-slot">Durée des créneaux de réservation</Label>
              <Select value={timeSlotDuration} onValueChange={setTimeSlotDuration}>
                <SelectTrigger id="time-slot">
                  <SelectValue placeholder="Sélectionner une durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-bookings">Rendez-vous maximum par créneau</Label>
              <Input 
                id="max-bookings" 
                type="number" 
                min="1"
                value={maxBookingsPerSlot}
                onChange={(e) => setMaxBookingsPerSlot(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="advance-booking">Réservation possible jusqu'à (jours)</Label>
              <Input 
                id="advance-booking" 
                type="number" 
                min="1"
                value={maxAdvanceBookingDays}
                onChange={(e) => setMaxAdvanceBookingDays(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cancel-hours">Délai minimum d'annulation (heures)</Label>
              <Input 
                id="cancel-hours" 
                type="number" 
                min="0"
                value={minCancellationHours}
                onChange={(e) => setMinCancellationHours(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Enregistrer les paramètres d'horaires</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleSettings;
