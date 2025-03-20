
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Calendar, ClipboardList, UserCog, ArrowUpDown, X, Check, CalendarDays } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { StaffMember, StaffRole } from './types/health-types';
import { toast } from 'sonner';

const NursesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personnel');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Mock data for staff members
  const staffMembers: StaffMember[] = [
    {
      id: '1',
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'nurse',
      department: 'Cardiologie',
      email: 'marie.dupont@example.com',
      phone: '0612345678',
      dateHired: '2020-03-15',
      status: 'active',
      permissions: ['view_patients', 'edit_medical_records', 'schedule_appointments'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      firstName: 'Pierre',
      lastName: 'Martin',
      role: 'doctor',
      department: 'Neurologie',
      email: 'pierre.martin@example.com',
      phone: '0623456789',
      dateHired: '2018-06-10',
      status: 'active',
      permissions: ['view_patients', 'edit_medical_records', 'prescribe_medication', 'view_lab_results'],
      specialization: 'Neurologie',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      firstName: 'Sophie',
      lastName: 'Laurent',
      role: 'secretary',
      email: 'sophie.laurent@example.com',
      phone: '0634567890',
      dateHired: '2021-01-20',
      status: 'active',
      permissions: ['schedule_appointments', 'view_patients'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      firstName: 'Thomas',
      lastName: 'Bernard',
      role: 'technician',
      department: 'Radiologie',
      email: 'thomas.bernard@example.com',
      phone: '0645678901',
      dateHired: '2019-09-05',
      status: 'on-leave',
      permissions: ['operate_equipment', 'view_patients'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      firstName: 'Jeanne',
      lastName: 'Moreau',
      role: 'director',
      email: 'jeanne.moreau@example.com',
      phone: '0656789012',
      dateHired: '2015-11-30',
      status: 'active',
      permissions: ['admin', 'manage_staff', 'view_finances'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Role to French translation
  const getRoleName = (role: StaffRole) => {
    const roleMap: Record<StaffRole, string> = {
      doctor: 'Médecin',
      nurse: 'Infirmier',
      secretary: 'Secrétaire',
      technician: 'Technicien',
      director: 'Directeur',
      pharmacist: 'Pharmacien',
      lab_technician: 'Technicien de laboratoire'
    };
    return roleMap[role] || role;
  };

  // Status badge styling
  const getStatusBadge = (status: 'active' | 'on-leave' | 'terminated') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'on-leave':
        return <Badge className="bg-amber-100 text-amber-800">En congé</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800">Terminé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Add staff form
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      role: 'nurse' as StaffRole,
      department: '',
      email: '',
      phone: '',
      dateHired: new Date().toISOString().split('T')[0]
    }
  });

  const handleAddStaff = (data: any) => {
    console.log('New staff data:', data);
    toast.success(`${data.firstName} ${data.lastName} a été ajouté au personnel`);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleScheduleManagement = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsScheduleDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personnel">
            <UserCog className="h-4 w-4 mr-2" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="planning">
            <Calendar className="h-4 w-4 mr-2" />
            Plannings
          </TabsTrigger>
          <TabsTrigger value="absences">
            <ClipboardList className="h-4 w-4 mr-2" />
            Absences
          </TabsTrigger>
        </TabsList>

        {/* Personnel Tab */}
        <TabsContent value="personnel">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Liste du personnel médical et administratif</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Nom</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.firstName} {staff.lastName}</TableCell>
                      <TableCell>{getRoleName(staff.role)}</TableCell>
                      <TableCell>{staff.department || '-'}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{getStatusBadge(staff.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleScheduleManagement(staff)}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Planning Tab */}
        <TabsContent value="planning">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Plannings du personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                  <div key={day} className="bg-muted p-2 text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="text-center text-muted-foreground">
                Sélectionnez un membre du personnel pour voir ou modifier son planning.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Absences Tab */}
        <TabsContent value="absences">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Gestion des absences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Absences en cours</h3>
                  <Button variant="outline" size="sm">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Déclarer une absence
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Personnel</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Début</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Thomas Bernard</TableCell>
                      <TableCell>Congé maladie</TableCell>
                      <TableCell>15/05/2023</TableCell>
                      <TableCell>30/05/2023</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Approuvé</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Marie Dupont</TableCell>
                      <TableCell>Congé personnel</TableCell>
                      <TableCell>20/05/2023</TableCell>
                      <TableCell>22/05/2023</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800">En attente</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un membre du personnel</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonction</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une fonction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="doctor">Médecin</SelectItem>
                        <SelectItem value="nurse">Infirmier</SelectItem>
                        <SelectItem value="secretary">Secrétaire</SelectItem>
                        <SelectItem value="technician">Technicien</SelectItem>
                        <SelectItem value="director">Directeur</SelectItem>
                        <SelectItem value="pharmacist">Pharmacien</SelectItem>
                        <SelectItem value="lab_technician">Technicien de laboratoire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département</FormLabel>
                    <FormControl>
                      <Input placeholder="Département (optionnel)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateHired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'embauche</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Schedule Management Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Planning de {selectedStaff?.firstName} {selectedStaff?.lastName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="bg-muted p-2 text-center font-medium">
                  {day}
                </div>
              ))}
              {['8h-12h', '8h-12h', '8h-12h', '8h-12h', '8h-12h', '-', '-'].map((hours, idx) => (
                <div key={idx} className={`p-2 text-center border ${hours === '-' ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  {hours}
                </div>
              ))}
              {['13h-17h', '13h-17h', '13h-17h', '13h-17h', '-', '-', '-'].map((hours, idx) => (
                <div key={idx} className={`p-2 text-center border ${hours === '-' ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  {hours}
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Cliquez sur une cellule pour modifier les horaires.
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Fermer
              </Button>
              <Button>Enregistrer les modifications</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NursesPage;
