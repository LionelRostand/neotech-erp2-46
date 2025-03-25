
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Calendar, Clock, FileText, Download, Filter, Plus, Search, Check, X } from 'lucide-react';
import { employees } from '@/data/employees';
import { Employee } from '@/types/employee';

interface TimeEntry {
  id: string;
  employee: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  activity: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
}

const EmployeesTimesheet: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  
  // Form state for new report
  const [newReportData, setNewReportData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    project: '',
    activity: '',
    description: ''
  });
  
  // Sample timesheet data
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      employee: 'Martin Dupont',
      employeeId: 'EMP001',
      date: '2023-05-10',
      startTime: '09:00',
      endTime: '17:30',
      project: 'Développement CRM',
      activity: 'Codage',
      duration: '8h30',
      status: 'approved'
    },
    {
      id: '2',
      employee: 'Sophie Martin',
      employeeId: 'EMP003',
      date: '2023-05-10',
      startTime: '08:30',
      endTime: '16:30',
      project: 'Marketing Digital',
      activity: 'Création contenu',
      duration: '8h00',
      status: 'approved'
    },
    {
      id: '3',
      employee: 'Jean Lefebvre',
      employeeId: 'EMP005',
      date: '2023-05-11',
      startTime: '09:00',
      endTime: '18:00',
      project: 'Support Client',
      activity: 'Assistance technique',
      duration: '9h00',
      status: 'pending'
    }
  ]);
  
  // Handle input change in the new report form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReportData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select change in the new report form
  const handleSelectChange = (name: string, value: string) => {
    setNewReportData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission for new report
  const handleSubmitReport = () => {
    // Validate form
    if (!newReportData.employeeId || !newReportData.date || !newReportData.startTime || !newReportData.endTime || !newReportData.project || !newReportData.activity) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Calculate duration
    const start = new Date(`2000-01-01T${newReportData.startTime}`);
    const end = new Date(`2000-01-01T${newReportData.endTime}`);
    
    if (end <= start) {
      toast.error("L'heure de fin doit être postérieure à l'heure de début");
      return;
    }
    
    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationFormatted = `${durationHours}h${durationMinutes.toString().padStart(2, '0')}`;
    
    // Get employee name from ID
    const employee = employees.find(emp => emp.id === newReportData.employeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    
    // Create new entry
    const newEntry: TimeEntry = {
      id: `${timeEntries.length + 1}`,
      employee: employeeName,
      employeeId: newReportData.employeeId,
      date: newReportData.date,
      startTime: newReportData.startTime,
      endTime: newReportData.endTime,
      project: newReportData.project,
      activity: newReportData.activity,
      duration: durationFormatted,
      status: 'pending'
    };
    
    // Add to entries
    setTimeEntries([...timeEntries, newEntry]);
    
    // Reset form and close dialog
    setNewReportData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      project: '',
      activity: '',
      description: ''
    });
    
    setIsNewReportOpen(false);
    toast.success("Rapport de temps ajouté avec succès");
  };
  
  // Filter time entries based on search query
  const filteredEntries = timeEntries.filter(entry => 
    entry.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.activity.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Feuilles de temps</h2>
          <p className="text-gray-500">Suivi du temps de travail des employés</p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsFiltersOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button size="sm" onClick={() => setIsNewReportOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rapport
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher par employé, projet ou activité..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="daily">Quotidien</TabsTrigger>
          <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
          <TabsTrigger value="monthly">Mensuel</TabsTrigger>
        </TabsList>
        
        {/* Daily Tab */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md font-medium">Entrées de temps - Quotidien</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Activité</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.employee}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.project}</TableCell>
                      <TableCell>{entry.activity}</TableCell>
                      <TableCell>{entry.startTime}</TableCell>
                      <TableCell>{entry.endTime}</TableCell>
                      <TableCell>{entry.duration}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                          entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status === 'approved' ? 'Approuvé' :
                           entry.status === 'rejected' ? 'Rejeté' :
                           'En attente'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                const updatedEntries = timeEntries.map(item => 
                                  item.id === entry.id ? {...item, status: 'approved'} : item
                                );
                                setTimeEntries(updatedEntries);
                                toast.success(`Entrée approuvée pour ${entry.employee}`);
                              }}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                const updatedEntries = timeEntries.map(item => 
                                  item.id === entry.id ? {...item, status: 'rejected'} : item
                                );
                                setTimeEntries(updatedEntries);
                                toast.success(`Entrée rejetée pour ${entry.employee}`);
                              }}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredEntries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                        Aucune entrée de temps trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Weekly Tab */}
        <TabsContent value="weekly">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md font-medium">Résumé hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-12">
                Vue résumée hebdomadaire des heures travaillées à implémenter
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Monthly Tab */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md font-medium">Résumé mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-12">
                Vue résumée mensuelle des heures travaillées à implémenter
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* New Time Report Dialog */}
      <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau rapport de temps</DialogTitle>
            <DialogDescription>
              Enregistrez le temps passé sur un projet ou une activité
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="employeeId" className="text-right text-sm font-medium">
                Employé
              </label>
              <div className="col-span-3">
                <Select 
                  value={newReportData.employeeId} 
                  onValueChange={(value) => handleSelectChange('employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-sm font-medium">
                Date
              </label>
              <div className="col-span-3">
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newReportData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startTime" className="text-right text-sm font-medium">
                Heure début
              </label>
              <div className="col-span-3">
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={newReportData.startTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endTime" className="text-right text-sm font-medium">
                Heure fin
              </label>
              <div className="col-span-3">
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={newReportData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="project" className="text-right text-sm font-medium">
                Projet
              </label>
              <div className="col-span-3">
                <Input
                  id="project"
                  name="project"
                  placeholder="Nom du projet"
                  value={newReportData.project}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="activity" className="text-right text-sm font-medium">
                Activité
              </label>
              <div className="col-span-3">
                <Input
                  id="activity"
                  name="activity"
                  placeholder="Type d'activité"
                  value={newReportData.activity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">
                Description
              </label>
              <div className="col-span-3">
                <Input
                  id="description"
                  name="description"
                  placeholder="Description optionnelle"
                  value={newReportData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewReportOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleSubmitReport}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Filters Dialog */}
      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les feuilles de temps</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="filter-employee" className="text-sm font-medium">
                Employé
              </label>
              <Select>
                <SelectTrigger id="filter-employee">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="filter-status" className="text-sm font-medium">
                Statut
              </label>
              <Select>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="filter-start-date" className="text-sm font-medium">
                  Date début
                </label>
                <Input
                  id="filter-start-date"
                  type="date"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="filter-end-date" className="text-sm font-medium">
                  Date fin
                </label>
                <Input
                  id="filter-end-date"
                  type="date"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFiltersOpen(false)}>
              Réinitialiser
            </Button>
            <Button onClick={() => setIsFiltersOpen(false)}>
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesTimesheet;
