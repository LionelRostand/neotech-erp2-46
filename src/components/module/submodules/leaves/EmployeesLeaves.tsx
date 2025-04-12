
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Filter,
  Plus,
  Check,
  X,
  Clock,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLeaveData, Leave } from '@/hooks/useLeaveData';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

const EmployeesLeaves: React.FC = () => {
  const { leaves, stats, isLoading } = useLeaveData();
  const { employees } = useEmployeeData();
  const [leaveRequests, setLeaveRequests] = useState<Leave[]>(leaves || []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for new leave request
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveType, setLeaveType] = useState('congés payés');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  
  const handleApprove = (id: string) => {
    const updatedRequests = leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'approved', approvedBy: 'Vous' } : request
    );
    setLeaveRequests(updatedRequests);
    toast.success('Demande de congés approuvée');
  };

  const handleReject = (id: string) => {
    const updatedRequests = leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'rejected', approvedBy: 'Vous' } : request
    );
    setLeaveRequests(updatedRequests);
    toast.success('Demande de congés refusée');
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'approuvé':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
      case 'refusé':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      case 'pending':
      case 'en attente':
      default:
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
    }
  };
  
  const calculateDays = (start?: Date, end?: Date): number => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
  };
  
  const handleAddLeaveRequest = async () => {
    if (!selectedEmployee || !startDate || !endDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      const days = calculateDays(startDate, endDate);
      
      // Format dates to ISO strings for storage
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const requestDateStr = new Date().toISOString();
      
      // Create the new leave request
      const newLeave = {
        employeeId: selectedEmployee,
        type: leaveType,
        startDate: startDateStr,
        endDate: endDateStr,
        days,
        status: 'pending',
        reason,
        requestDate: requestDateStr,
        createdAt: requestDateStr,
        updatedAt: requestDateStr
      };
      
      // Add to Firestore
      const addedLeave = await addDocument(COLLECTIONS.HR.LEAVES, newLeave);
      
      // Format for display
      const formattedLeave = {
        id: addedLeave.id,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        department: employee?.department || 'Non spécifié',
        type: leaveType,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        days,
        status: 'pending',
        reason,
        employeeId: selectedEmployee,
        requestDate: new Date().toLocaleDateString(),
        approvedBy: '',
        employeePhoto: employee?.photoURL || employee?.photo || '',
      };
      
      // Update state
      setLeaveRequests([...leaveRequests, formattedLeave]);
      
      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();
      
      toast.success('Demande de congés ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la demande de congés:', error);
      toast.error('Erreur lors de l\'ajout de la demande');
    }
  };
  
  const resetForm = () => {
    setSelectedEmployee('');
    setLeaveType('congés payés');
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Congés</h2>
          <p className="text-gray-500">Gestion des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">En attente</h3>
              <p className="text-2xl font-bold text-blue-700">
                {stats?.pending || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Approuvés</h3>
              <p className="text-2xl font-bold text-green-700">
                {stats?.approved || 0}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Refusés</h3>
              <p className="text-2xl font-bold text-red-700">
                {stats?.rejected || 0}
              </p>
            </div>
            <X className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">
                {stats?.total || 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type de congé</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Date de la demande</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Approuvé par</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>{request.employeeName}</TableCell>
                  <TableCell>
                    <span className="capitalize">{request.type}</span>
                  </TableCell>
                  <TableCell>
                    {request.startDate} au {request.endDate}
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.approvedBy || '-'}</TableCell>
                  <TableCell className="text-right">
                    {(request.status.toLowerCase() === 'pending' || 
                      request.status.toLowerCase() === 'en attente') ? (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4 mr-1" /> Approuver
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" /> Refuser
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> Détails
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog for adding new leave request */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouvelle demande de congés</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employé</Label>
              <Select 
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                    >
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type de congés</Label>
              <Select 
                value={leaveType}
                onValueChange={setLeaveType}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="congés payés">Congés payés</SelectItem>
                  <SelectItem value="maladie">Maladie</SelectItem>
                  <SelectItem value="RTT">RTT</SelectItem>
                  <SelectItem value="sans solde">Sans solde</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="start-date">Date de début</Label>
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Sélectionner une date de début"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder="Sélectionner une date de fin"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="reason">Motif (optionnel)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Précisez le motif de votre demande"
              />
            </div>
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddLeaveRequest}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default EmployeesLeaves;
