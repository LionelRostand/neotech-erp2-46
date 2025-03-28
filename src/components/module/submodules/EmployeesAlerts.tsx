
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Calendar, Clock, FileText, User, BadgeAlert, Building, CheckCircle, UserCheck, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Types for employee alerts
interface EmployeeAlert {
  id: string;
  type: 'contract' | 'absence' | 'badge' | 'evaluation' | 'training' | 'birthday';
  severity: 'high' | 'medium' | 'low';
  employeeId: string;
  employeeName: string;
  message: string;
  date: string; // ISO date string
  isRead: boolean;
  department?: string;
}

// Mock data for demonstration
const mockAlerts: EmployeeAlert[] = [
  {
    id: 'alert-1',
    type: 'contract',
    severity: 'high',
    employeeId: 'emp-123',
    employeeName: 'Thomas Dubois',
    message: 'Contrat à durée déterminée se termine dans 15 jours',
    date: '2023-06-05T10:00:00',
    isRead: false,
    department: 'Ventes'
  },
  {
    id: 'alert-2',
    type: 'absence',
    severity: 'medium',
    employeeId: 'emp-456',
    employeeName: 'Marie Laurent',
    message: 'Absence non justifiée depuis 2 jours',
    date: '2023-06-03T08:30:00',
    isRead: false,
    department: 'Marketing'
  },
  {
    id: 'alert-3',
    type: 'badge',
    severity: 'low',
    employeeId: 'emp-789',
    employeeName: 'Jean Martin',
    message: 'Badge d\'accès expiré',
    date: '2023-06-01T14:45:00',
    isRead: true,
    department: 'Technique'
  },
  {
    id: 'alert-4',
    type: 'evaluation',
    severity: 'medium',
    employeeId: 'emp-321',
    employeeName: 'Sophie Petit',
    message: 'Évaluation annuelle en retard de 30 jours',
    date: '2023-05-25T11:20:00',
    isRead: false,
    department: 'Ressources Humaines'
  },
  {
    id: 'alert-5',
    type: 'training',
    severity: 'high',
    employeeId: 'emp-654',
    employeeName: 'Pierre Leroy',
    message: 'Formation obligatoire sur la sécurité non complétée',
    date: '2023-05-20T09:15:00',
    isRead: false,
    department: 'Production'
  },
  {
    id: 'alert-6',
    type: 'birthday',
    severity: 'low',
    employeeId: 'emp-987',
    employeeName: 'Claire Dubois',
    message: 'Anniversaire aujourd\'hui',
    date: '2023-06-06T00:00:00',
    isRead: true,
    department: 'Finance'
  },
  {
    id: 'alert-7',
    type: 'contract',
    severity: 'high',
    employeeId: 'emp-246',
    employeeName: 'Lucas Bernard',
    message: 'Période d\'essai se termine dans 5 jours',
    date: '2023-06-04T10:30:00',
    isRead: false,
    department: 'Logistique'
  },
  {
    id: 'alert-8',
    type: 'absence',
    severity: 'medium',
    employeeId: 'emp-135',
    employeeName: 'Camille Roux',
    message: 'Congé maladie prolongé sans certificat médical à jour',
    date: '2023-05-28T08:00:00',
    isRead: false,
    department: 'Service Client'
  }
];

// Types pour les formulaires et les dialogs supplémentaires
interface TransferFormData {
  recipient: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface ReminderFormData {
  date: string;
  time: string;
  note: string;
}

const EmployeesAlerts = () => {
  const [alerts, setAlerts] = useState<EmployeeAlert[]>(mockAlerts);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showDialogId, setShowDialogId] = useState<string | null>(null);
  const [alertToManage, setAlertToManage] = useState<EmployeeAlert | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [transferForm, setTransferForm] = useState<TransferFormData>({
    recipient: '',
    message: '',
    priority: 'medium',
  });
  const [reminderForm, setReminderForm] = useState<ReminderFormData>({
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    note: '',
  });

  // Count unread alerts by type
  const unreadCount = {
    all: alerts.filter(a => !a.isRead).length,
    contract: alerts.filter(a => !a.isRead && a.type === 'contract').length,
    absence: alerts.filter(a => !a.isRead && a.type === 'absence').length,
    badge: alerts.filter(a => !a.isRead && a.type === 'badge').length,
    evaluation: alerts.filter(a => !a.isRead && a.type === 'evaluation').length,
    training: alerts.filter(a => !a.isRead && a.type === 'training').length,
    birthday: alerts.filter(a => !a.isRead && a.type === 'birthday').length,
  };

  // Mark an alert as read
  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
    
    toast({
      title: "Alerte marquée comme lue",
      description: "L'alerte a été marquée comme lue avec succès.",
    });
  };

  // Mark all alerts as read
  const markAllAsRead = () => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, isRead: true }))
    );
    
    toast({
      title: "Toutes les alertes marquées comme lues",
      description: "Toutes les alertes ont été marquées comme lues avec succès.",
    });
  };

  // Delete an alert
  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setShowDialogId(null);
    
    toast({
      title: "Alerte supprimée",
      description: "L'alerte a été supprimée avec succès.",
    });
  };

  // Filter alerts based on active tab
  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === activeTab);

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Get icon based on alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileText className="h-4 w-4" />;
      case 'absence': return <Calendar className="h-4 w-4" />;
      case 'badge': return <BadgeAlert className="h-4 w-4" />;
      case 'evaluation': return <AlertTriangle className="h-4 w-4" />;
      case 'training': return <Clock className="h-4 w-4" />;
      case 'birthday': return <User className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  // Format alert type label
  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'contract': return 'Contrat';
      case 'absence': return 'Absence';
      case 'badge': return 'Badge';
      case 'evaluation': return 'Évaluation';
      case 'training': return 'Formation';
      case 'birthday': return 'Anniversaire';
      default: return type;
    }
  };

  // Handle alert action
  const handleAction = (alert: EmployeeAlert) => {
    setAlertToManage(alert);
    setShowDialogId('action');
  };

  // Handle transfer action
  const handleTransfer = () => {
    if (!alertToManage) return;
    
    toast({
      title: "Alerte transférée",
      description: `L'alerte a été transférée à ${transferForm.recipient}.`,
    });
    
    setShowTransferDialog(false);
    setTransferForm({
      recipient: '',
      message: '',
      priority: 'medium',
    });
  };

  // Handle reminder action
  const handleReminder = () => {
    if (!alertToManage) return;
    
    toast({
      title: "Rappel programmé",
      description: `Un rappel a été programmé pour le ${reminderForm.date} à ${reminderForm.time}.`,
    });
    
    setShowReminderDialog(false);
    setReminderForm({
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      note: '',
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
      }
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays === 1) {
      return 'Hier';
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alertes employés</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={markAllAsRead}
        >
          <CheckCircle className="h-4 w-4" />
          Tout marquer comme lu
        </Button>
      </div>

      <Alert className="border-orange-300 bg-orange-50 text-orange-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Centre d'alertes RH</AlertTitle>
        <AlertDescription>
          Bienvenue dans le centre d'alertes RH. Vous recevez des notifications importantes concernant les employés, leurs contrats, 
          et d'autres événements nécessitant votre attention.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Alertes et notifications</span>
            {unreadCount.all > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount.all} non lu{unreadCount.all > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-7 mb-4">
              <TabsTrigger value="all" className="relative">
                Tous
                {unreadCount.all > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount.all}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="contract" className="relative">
                Contrats
                {unreadCount.contract > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount.contract}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="absence" className="relative">
                Absences
                {unreadCount.absence > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount.absence}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="badge" className="relative">
                Badges
                {unreadCount.badge > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount.badge}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="evaluation" className="relative">
                Évaluations
                {unreadCount.evaluation > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount.evaluation}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="training" className="relative">
                Formations
                {unreadCount.training > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount.training}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="birthday" className="relative">
                Anniversaires
                {unreadCount.birthday > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount.birthday}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-1">
                {filteredAlerts.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune alerte pour le moment</p>
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    {filteredAlerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`p-4 ${!alert.isRead ? 'bg-muted/30' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="mt-1">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{alert.employeeName}</span>
                                <Badge 
                                  className={`${getSeverityColor(alert.severity)} text-white`}
                                >
                                  {getAlertTypeLabel(alert.type)}
                                </Badge>
                                {!alert.isRead && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                    Nouveau
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {alert.department}
                                </div>
                                <div>
                                  {formatRelativeTime(alert.date)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!alert.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(alert.id)}
                              >
                                Marquer comme lu
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAction(alert)}
                            >
                              Gérer
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setShowDialogId(alert.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>

                        {/* Delete confirmation dialog */}
                        <AlertDialog 
                          open={showDialogId === alert.id} 
                          onOpenChange={() => setShowDialogId(null)}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action ne peut pas être annulée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteAlert(alert.id)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Alert Action Dialog */}
      <AlertDialog 
        open={showDialogId === 'action'} 
        onOpenChange={() => { 
          setShowDialogId(null);
          setAlertToManage(null);
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Gérer l'alerte
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertToManage && (
                <div className="space-y-4 pt-2">
                  <div className="border p-3 rounded-md bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alertToManage.employeeName}</span>
                      <Badge className={`${getSeverityColor(alertToManage.severity)} text-white`}>
                        {getAlertTypeLabel(alertToManage.type)}
                      </Badge>
                    </div>
                    <p className="text-sm">{alertToManage.message}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        setShowEmployeeDialog(true);
                        setShowDialogId(null);
                      }}
                    >
                      <User className="h-4 w-4" />
                      Voir l'employé
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        setShowReminderDialog(true);
                        setShowDialogId(null);
                      }}
                    >
                      <Clock className="h-4 w-4" />
                      Me rappeler
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        setShowTransferDialog(true);
                        setShowDialogId(null);
                      }}
                    >
                      <Send className="h-4 w-4" />
                      Transférer
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        if (alertToManage) {
                          markAsRead(alertToManage.id);
                          setShowDialogId(null);
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marquer comme lu
                    </Button>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fermer</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                toast({
                  title: "Alerte résolue",
                  description: "L'alerte a été marquée comme résolue",
                });
                if (alertToManage) {
                  deleteAlert(alertToManage.id);
                }
                setShowDialogId(null);
              }}
            >
              Marquer comme résolu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transférer l'alerte</DialogTitle>
            <DialogDescription>
              Transférez cette alerte à un autre membre du personnel.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Destinataire</Label>
              <Select
                value={transferForm.recipient}
                onValueChange={(value) => setTransferForm({ ...transferForm, recipient: value })}
              >
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Sélectionner un destinataire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="philippe.durand@example.com">Philippe Durand (RH)</SelectItem>
                  <SelectItem value="sophie.martin@example.com">Sophie Martin (Direction)</SelectItem>
                  <SelectItem value="eric.leroy@example.com">Eric Leroy (Technique)</SelectItem>
                  <SelectItem value="julie.blanc@example.com">Julie Blanc (Admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Input
                id="message"
                value={transferForm.message}
                onChange={(e) => setTransferForm({ ...transferForm, message: e.target.value })}
                placeholder="Ajoutez un message avec l'alerte..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={transferForm.priority}
                onValueChange={(value: any) => setTransferForm({ ...transferForm, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleTransfer}>Transférer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Programmer un rappel</DialogTitle>
            <DialogDescription>
              Définissez quand vous souhaitez être rappelé de cette alerte.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={reminderForm.date}
                onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={reminderForm.time}
                onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optionnel)</Label>
              <Input
                id="note"
                value={reminderForm.note}
                onChange={(e) => setReminderForm({ ...reminderForm, note: e.target.value })}
                placeholder="Ajoutez une note pour ce rappel..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleReminder}>Programmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de l'employé</DialogTitle>
          </DialogHeader>
          {alertToManage && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCheck className="h-12 w-12 text-gray-500" />
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Nom</Label>
                <p className="font-medium">{alertToManage.employeeName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">ID Employé</Label>
                <p className="font-medium">{alertToManage.employeeId}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Département</Label>
                <p className="font-medium">{alertToManage.department}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Statut</Label>
                <Badge className="mt-1">Actif</Badge>
              </div>
              <div className="col-span-2">
                <Label className="text-sm text-muted-foreground">Alerte actuelle</Label>
                <p className="font-medium">{alertToManage.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmployeeDialog(false)}>
              Fermer
            </Button>
            <Button onClick={() => {
              setShowEmployeeDialog(false);
              toast({
                title: "Navigation",
                description: "Redirection vers la fiche complète de l'employé",
              });
            }}>
              Voir fiche complète
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesAlerts;
