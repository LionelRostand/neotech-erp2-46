
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock data pour les coiffeurs
const stylists = [
  {
    id: "1",
    firstName: "Sophie",
    lastName: "Martin",
    avatar: "",
    status: "available",
    workingHours: {
      monday: { isWorking: true, start: "09:00", end: "18:00" },
      tuesday: { isWorking: true, start: "09:00", end: "18:00" },
      wednesday: { isWorking: true, start: "09:00", end: "18:00" },
      thursday: { isWorking: true, start: "09:00", end: "18:00" },
      friday: { isWorking: true, start: "09:00", end: "18:00" },
      saturday: { isWorking: true, start: "09:00", end: "16:00" },
      sunday: { isWorking: false, start: "", end: "" }
    },
    absences: [
      { date: "2023-06-25", reason: "Congés annuels", type: "holiday" },
      { date: "2023-06-26", reason: "Congés annuels", type: "holiday" },
      { date: "2023-06-27", reason: "Congés annuels", type: "holiday" }
    ]
  },
  {
    id: "2",
    firstName: "Thomas",
    lastName: "Bernard",
    avatar: "",
    status: "busy",
    workingHours: {
      monday: { isWorking: true, start: "10:00", end: "19:00" },
      tuesday: { isWorking: true, start: "10:00", end: "19:00" },
      wednesday: { isWorking: false, start: "", end: "" },
      thursday: { isWorking: true, start: "10:00", end: "19:00" },
      friday: { isWorking: true, start: "10:00", end: "19:00" },
      saturday: { isWorking: true, start: "09:00", end: "16:00" },
      sunday: { isWorking: false, start: "", end: "" }
    },
    absences: [
      { date: "2023-07-10", reason: "Formation", type: "training" }
    ]
  },
  {
    id: "3",
    firstName: "Julie",
    lastName: "Dubois",
    avatar: "",
    status: "off",
    workingHours: {
      monday: { isWorking: true, start: "09:00", end: "18:00" },
      tuesday: { isWorking: true, start: "09:00", end: "18:00" },
      wednesday: { isWorking: true, start: "09:00", end: "18:00" },
      thursday: { isWorking: true, start: "09:00", end: "18:00" },
      friday: { isWorking: true, start: "09:00", end: "18:00" },
      saturday: { isWorking: false, start: "", end: "" },
      sunday: { isWorking: false, start: "", end: "" }
    },
    absences: [
      { date: "2023-06-15", reason: "Maladie", type: "sick" }
    ]
  },
  {
    id: "4",
    firstName: "Marc",
    lastName: "Leroy",
    avatar: "",
    status: "available",
    workingHours: {
      monday: { isWorking: true, start: "09:00", end: "18:00" },
      tuesday: { isWorking: true, start: "09:00", end: "18:00" },
      wednesday: { isWorking: true, start: "09:00", end: "18:00" },
      thursday: { isWorking: true, start: "09:00", end: "18:00" },
      friday: { isWorking: true, start: "09:00", end: "18:00" },
      saturday: { isWorking: true, start: "09:00", end: "16:00" },
      sunday: { isWorking: false, start: "", end: "" }
    },
    absences: []
  },
  {
    id: "5",
    firstName: "Lucie",
    lastName: "Blanc",
    avatar: "",
    status: "busy",
    workingHours: {
      monday: { isWorking: true, start: "09:00", end: "18:00" },
      tuesday: { isWorking: true, start: "09:00", end: "18:00" },
      wednesday: { isWorking: false, start: "", end: "" },
      thursday: { isWorking: true, start: "09:00", end: "18:00" },
      friday: { isWorking: true, start: "09:00", end: "18:00" },
      saturday: { isWorking: true, start: "09:00", end: "16:00" },
      sunday: { isWorking: false, start: "", end: "" }
    },
    absences: []
  }
];

// Les jours de la semaine
const weekDays = [
  { id: "monday", name: "Lundi" },
  { id: "tuesday", name: "Mardi" },
  { id: "wednesday", name: "Mercredi" },
  { id: "thursday", name: "Jeudi" },
  { id: "friday", name: "Vendredi" },
  { id: "saturday", name: "Samedi" },
  { id: "sunday", name: "Dimanche" }
];

const StylistAvailability: React.FC = () => {
  const { toast } = useToast();
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showAbsenceDialog, setShowAbsenceDialog] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleEditSchedule = (stylist) => {
    setSelectedStylist(stylist);
    setShowScheduleDialog(true);
  };

  const handleAddAbsence = (stylist) => {
    setSelectedStylist(stylist);
    setShowAbsenceDialog(true);
  };

  const handleSaveSchedule = () => {
    toast({
      title: "Horaires mis à jour",
      description: `Les horaires de ${selectedStylist.firstName} ${selectedStylist.lastName} ont été mis à jour`
    });
    setShowScheduleDialog(false);
  };

  const handleSaveAbsence = () => {
    toast({
      title: "Absence ajoutée",
      description: `L'absence de ${selectedStylist.firstName} ${selectedStylist.lastName} a été enregistrée`
    });
    setShowAbsenceDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-blue-100 text-blue-800";
      case "off": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available": return "Disponible";
      case "busy": return "Occupé";
      case "off": return "Absent";
      default: return "Inconnu";
    }
  };

  const getAbsenceTypeColor = (type) => {
    switch (type) {
      case "holiday": return "bg-blue-100 text-blue-800";
      case "sick": return "bg-red-100 text-red-800";
      case "training": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAbsenceTypeText = (type) => {
    switch (type) {
      case "holiday": return "Congés";
      case "sick": return "Maladie";
      case "training": return "Formation";
      default: return "Autre";
    }
  };

  const filteredStylists = stylists.filter(stylist => {
    return filterStatus === "all" || stylist.status === filterStatus;
  });

  const renderTimeSlots = () => {
    const times = [];
    for (let i = 9; i <= 19; i++) {
      times.push(`${i}:00`);
    }

    return (
      <div className="grid grid-cols-[100px_1fr] gap-2">
        <div></div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day.id} className="text-center text-sm font-medium py-2 border-b">
              {day.name}
            </div>
          ))}
        </div>
        
        {times.map((time, timeIdx) => (
          <React.Fragment key={time}>
            <div className="text-right pr-2 py-1 text-sm text-muted-foreground">
              {time}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div 
                  key={`${day.id}-${time}`} 
                  className={`h-8 border ${timeIdx % 2 === 0 ? 'bg-gray-50' : ''}`}
                >
                  <div className="w-full h-full">
                    {filteredStylists.map(stylist => {
                      const dayHours = stylist.workingHours[day.id];
                      const isWorking = dayHours?.isWorking;
                      const startHour = isWorking ? parseInt(dayHours.start.split(':')[0]) : 0;
                      const endHour = isWorking ? parseInt(dayHours.end.split(':')[0]) : 0;
                      const timeHour = parseInt(time.split(':')[0]);
                      
                      if (isWorking && timeHour >= startHour && timeHour < endHour) {
                        return (
                          <div 
                            key={stylist.id} 
                            className="h-full w-full flex items-center justify-center"
                            style={{ opacity: stylist.status === 'off' ? 0.5 : 1 }}
                          >
                            <div 
                              className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs
                                ${stylist.status === 'available' ? 'bg-green-500' : 
                                  stylist.status === 'busy' ? 'bg-blue-500' : 'bg-orange-500'}`}
                              title={`${stylist.firstName} ${stylist.lastName}`}
                            >
                              {stylist.firstName.charAt(0)}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-2">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendrier hebdomadaire
            </TabsTrigger>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-2" />
              Liste des horaires
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="busy">Occupé</SelectItem>
                <SelectItem value="off">Absent</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </div>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Planning hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTimeSlots()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Absences programmées</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une absence
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coiffeur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stylists.flatMap(stylist => (
                    stylist.absences.map((absence, idx) => (
                      <TableRow key={`${stylist.id}-${idx}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{stylist.firstName.charAt(0)}{stylist.lastName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{stylist.firstName} {stylist.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{absence.date}</TableCell>
                        <TableCell>
                          <Badge className={getAbsenceTypeColor(absence.type)}>
                            {getAbsenceTypeText(absence.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>{absence.reason}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => toast({
                            title: "Fonctionnalité à venir",
                            description: "La modification des absences sera disponible prochainement"
                          })}>
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coiffeur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Lundi</TableHead>
                    <TableHead>Mardi</TableHead>
                    <TableHead>Mercredi</TableHead>
                    <TableHead>Jeudi</TableHead>
                    <TableHead>Vendredi</TableHead>
                    <TableHead>Samedi</TableHead>
                    <TableHead>Dimanche</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStylists.map((stylist) => (
                    <TableRow key={stylist.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{stylist.firstName.charAt(0)}{stylist.lastName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{stylist.firstName} {stylist.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(stylist.status)}>
                          {getStatusText(stylist.status)}
                        </Badge>
                      </TableCell>
                      {weekDays.map(day => {
                        const dayHours = stylist.workingHours[day.id];
                        return (
                          <TableCell key={day.id}>
                            {dayHours?.isWorking ? (
                              <div className="text-sm">{dayHours.start} - {dayHours.end}</div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Repos</div>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSchedule(stylist)}>
                            Horaires
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleAddAbsence(stylist)}>
                            Absence
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue d'édition des horaires */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStylist && `Horaires de ${selectedStylist.firstName} ${selectedStylist.lastName}`}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStylist && (
            <div className="space-y-4">
              {weekDays.map(day => (
                <div key={day.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`working-${day.id}`} 
                      defaultChecked={selectedStylist.workingHours[day.id]?.isWorking}
                    />
                    <Label htmlFor={`working-${day.id}`}>{day.name}</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pl-6">
                    <div className="space-y-1">
                      <Label htmlFor={`start-${day.id}`}>Début</Label>
                      <Input 
                        id={`start-${day.id}`} 
                        type="time" 
                        defaultValue={selectedStylist.workingHours[day.id]?.start || "09:00"}
                        disabled={!selectedStylist.workingHours[day.id]?.isWorking}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`end-${day.id}`}>Fin</Label>
                      <Input 
                        id={`end-${day.id}`} 
                        type="time" 
                        defaultValue={selectedStylist.workingHours[day.id]?.end || "18:00"}
                        disabled={!selectedStylist.workingHours[day.id]?.isWorking}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                </div>
              ))}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  Annuler
                </Button>
                <Button type="button" onClick={handleSaveSchedule}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'ajout d'absence */}
      <Dialog open={showAbsenceDialog} onOpenChange={setShowAbsenceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStylist && `Absence pour ${selectedStylist.firstName} ${selectedStylist.lastName}`}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStylist && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="absence-date">Date de début</Label>
                <Input id="absence-date" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="absence-end-date">Date de fin</Label>
                <Input id="absence-end-date" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="absence-type">Type d'absence</Label>
                <Select defaultValue="holiday">
                  <SelectTrigger id="absence-type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="holiday">Congés</SelectItem>
                    <SelectItem value="sick">Maladie</SelectItem>
                    <SelectItem value="training">Formation</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="absence-reason">Motif</Label>
                <Input id="absence-reason" placeholder="Motif de l'absence" />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAbsenceDialog(false)}>
                  Annuler
                </Button>
                <Button type="button" onClick={handleSaveAbsence}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component pour la table
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b">
    {children}
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">
    {children}
  </tbody>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    {children}
  </tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
    {children}
  </th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
    {children}
  </td>
);

export default StylistAvailability;
