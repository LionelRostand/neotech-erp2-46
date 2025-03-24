
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, Mail, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AbsentEmployee {
  id: number;
  name: string;
  department: string;
  lastPresence: string;
  status: string;
  email: string;
}

const EmployeesAbsences: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<AbsentEmployee | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample absences data - employees who haven't validated their presence
  const [absentEmployees, setAbsentEmployees] = useState<AbsentEmployee[]>([
    { id: 1, name: 'Thomas Martin', department: 'Marketing', lastPresence: '2025-03-10', status: 'Non validé', email: 'thomas.martin@example.com' },
    { id: 2, name: 'Sophie Dubois', department: 'Développement', lastPresence: '2025-03-12', status: 'Non validé', email: 'sophie.dubois@example.com' },
    { id: 3, name: 'Jean Dupont', department: 'Finance', lastPresence: '2025-03-08', status: 'Non validé', email: 'jean.dupont@example.com' },
    { id: 4, name: 'Marie Lambert', department: 'Ressources Humaines', lastPresence: '2025-03-11', status: 'Non validé', email: 'marie.lambert@example.com' },
    { id: 5, name: 'Pierre Durand', department: 'Développement', lastPresence: '2025-03-09', status: 'Non validé', email: 'pierre.durand@example.com' },
  ]);
  
  // Filter employees based on search query
  const filteredEmployees = absentEmployees.filter(
    employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendEmail = () => {
    if (!selectedEmployee) return;
    
    setIsLoading(true);
    
    // Simulation d'envoi d'email
    setTimeout(() => {
      toast.success(`Email de rappel envoyé à ${selectedEmployee.name}`);
      setIsLoading(false);
      setIsEmailDialogOpen(false);
      setMessageContent('');
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!selectedEmployee || !messageContent.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'envoi de message interne
    setTimeout(() => {
      toast.success(`Message envoyé à ${selectedEmployee.name}`);
      setIsLoading(false);
      setIsContactDialogOpen(false);
      setMessageContent('');
    }, 1500);
  };

  const handleSendBulkEmail = () => {
    setIsLoading(true);
    
    // Simulation d'envoi d'emails en masse
    setTimeout(() => {
      toast.success(`Emails de rappel envoyés à ${filteredEmployees.length} employés`);
      setIsLoading(false);
    }, 2000);
  };

  const handleValidateManually = (employee: AbsentEmployee) => {
    const updatedEmployees = absentEmployees.map(emp => 
      emp.id === employee.id ? { ...emp, status: 'Validé manuellement' } : emp
    );
    
    setAbsentEmployees(updatedEmployees);
    toast.success(`Présence de ${employee.name} validée manuellement`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Employés sans validation de présence</CardTitle>
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Liste des employés qui n'ont pas validé leur présence dans le module "Présences".
          </p>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un employé..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">Filtrer</Button>
            <Button onClick={() => {
              if (filteredEmployees.length === 0) {
                toast.error("Aucun employé à notifier");
                return;
              }
              handleSendBulkEmail();
            }}>
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2"></span>
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Envoyer rappel
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Dernière présence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{new Date(employee.lastPresence).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          employee.status === 'Validé manuellement'
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsContactDialogOpen(true);
                          }}
                        >
                          Contacter
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleValidateManually(employee)}
                          disabled={employee.status === 'Validé manuellement'}
                        >
                          Valider manuellement
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Aucun employé trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for email reminder */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un email de rappel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm text-gray-500">Destinataire</Label>
              <p className="font-medium">{selectedEmployee?.name} - {selectedEmployee?.email}</p>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Objet</Label>
              <p className="font-medium">Rappel : Validation de présence requise</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-message">Message</Label>
              <Textarea 
                id="email-message" 
                rows={6}
                value={messageContent || `Bonjour ${selectedEmployee?.name},\n\nNous vous rappelons que vous n'avez pas validé votre présence depuis le ${selectedEmployee ? new Date(selectedEmployee.lastPresence).toLocaleDateString('fr-FR') : ''}.\n\nMerci de vous connecter au module "Présences" pour régulariser votre situation.\n\nCordialement,\nLe service RH`}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSendEmail} disabled={isLoading}>
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2"></span>
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Envoyer l'email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for contact options */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter {selectedEmployee?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24"
                onClick={() => {
                  setIsContactDialogOpen(false);
                  setIsEmailDialogOpen(true);
                }}
              >
                <Mail className="h-8 w-8 mb-2" />
                <span>Email</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24"
                onClick={() => {
                  // On garde la boîte de dialogue ouverte mais on change son contenu
                  setMessageContent(`Bonjour ${selectedEmployee?.name},\n\nNous avons remarqué que vous n'avez pas validé votre présence depuis le ${selectedEmployee ? new Date(selectedEmployee.lastPresence).toLocaleDateString('fr-FR') : ''}.\n\nMerci de régulariser votre situation.\n\nCordialement.`);
                }}
              >
                <MessageSquare className="h-8 w-8 mb-2" />
                <span>Message interne</span>
              </Button>
            </div>
            
            {messageContent && (
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea 
                  id="contact-message" 
                  rows={6}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    {isLoading ? (
                      <span className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2"></span>
                    ) : (
                      <MessageSquare className="mr-2 h-4 w-4" />
                    )}
                    Envoyer le message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesAbsences;
