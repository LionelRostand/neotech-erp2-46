
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  UserPlus, 
  Search, 
  UserCheck, 
  UserMinus, 
  FileText, 
  Calendar, 
  BedDouble,
  BadgeAlert,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types pour les hospitalisations
interface Admission {
  id: string;
  patientName: string;
  patientId: string;
  dateAdmitted: string;
  dateDischarged?: string;
  roomNumber: string;
  roomType: 'private' | 'shared' | 'intensive';
  diagnosis: string;
  doctor: string;
  status: 'active' | 'scheduled' | 'discharged' | 'transferred';
  notes?: string;
}

// Données de démonstration
const mockAdmissions: Admission[] = [
  {
    id: 'ADM-001',
    patientName: 'Jean Martin',
    patientId: 'PAT-4321',
    dateAdmitted: '2023-09-12',
    roomNumber: '205',
    roomType: 'private',
    diagnosis: 'Pneumonie',
    doctor: 'Dr. Sophie Laurent',
    status: 'active',
    notes: 'Patient sous antibiotiques, surveillance de la saturation en oxygène'
  },
  {
    id: 'ADM-002',
    patientName: 'Amélie Dubois',
    patientId: 'PAT-8765',
    dateAdmitted: '2023-09-14',
    dateDischarged: '2023-09-20',
    roomNumber: '110',
    roomType: 'shared',
    diagnosis: 'Post-opératoire - Appendicectomie',
    doctor: 'Dr. Thomas Petit',
    status: 'discharged',
    notes: 'Sortie avec prescription d\'antalgiques, suivi dans 10 jours'
  },
  {
    id: 'ADM-003',
    patientName: 'Marc Leroy',
    patientId: 'PAT-2468',
    dateAdmitted: '2023-09-15',
    roomNumber: '301',
    roomType: 'intensive',
    diagnosis: 'Insuffisance cardiaque aiguë',
    doctor: 'Dr. Marie Fournier',
    status: 'active',
    notes: 'Monitoring cardiaque continu, bilan quotidien'
  },
  {
    id: 'ADM-004',
    patientName: 'Claire Moreau',
    patientId: 'PAT-1357',
    dateAdmitted: '2023-09-22',
    roomNumber: '215',
    roomType: 'private',
    diagnosis: 'Fracture du fémur',
    doctor: 'Dr. Philippe Rousseau',
    status: 'active'
  },
  {
    id: 'ADM-005',
    patientName: 'Lucas Bernard',
    patientId: 'PAT-9753',
    dateAdmitted: '2023-09-25',
    roomNumber: 'N/A',
    roomType: 'shared',
    diagnosis: 'Chirurgie programmée - Hernie inguinale',
    doctor: 'Dr. Nathalie Dupont',
    status: 'scheduled'
  }
];

const AdmissionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [admissions, setAdmissions] = useState<Admission[]>(mockAdmissions);
  const [isAdmitting, setIsAdmitting] = useState(false);
  const [newAdmission, setNewAdmission] = useState<Partial<Admission>>({
    patientName: '',
    patientId: '',
    roomNumber: '',
    roomType: 'shared',
    diagnosis: '',
    doctor: '',
    status: 'scheduled',
    notes: ''
  });
  
  const { toast } = useToast();

  const filteredAdmissions = admissions.filter(admission => 
    admission.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admission.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admission.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeAdmissions = admissions.filter(admission => admission.status === 'active');
  const scheduledAdmissions = admissions.filter(admission => admission.status === 'scheduled');
  const dischargedAdmissions = admissions.filter(admission => admission.status === 'discharged');

  const handleNewAdmission = () => {
    if (!newAdmission.patientName || !newAdmission.patientId || !newAdmission.diagnosis || !newAdmission.doctor) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const newId = `ADM-${String(admissions.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const admissionRecord: Admission = {
      id: newId,
      patientName: newAdmission.patientName!,
      patientId: newAdmission.patientId!,
      dateAdmitted: today,
      roomNumber: newAdmission.roomNumber || 'À attribuer',
      roomType: (newAdmission.roomType as 'private' | 'shared' | 'intensive') || 'shared',
      diagnosis: newAdmission.diagnosis!,
      doctor: newAdmission.doctor!,
      status: newAdmission.status as 'active' | 'scheduled' | 'discharged' | 'transferred' || 'scheduled',
      notes: newAdmission.notes
    };
    
    setAdmissions([...admissions, admissionRecord]);
    setIsAdmitting(false);
    setNewAdmission({
      patientName: '',
      patientId: '',
      roomNumber: '',
      roomType: 'shared',
      diagnosis: '',
      doctor: '',
      status: 'scheduled',
      notes: ''
    });

    toast({
      title: "Admission créée",
      description: `L'admission ${newId} a été créée avec succès.`
    });
  };

  const handleDischarge = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setAdmissions(admissions.map(admission => 
      admission.id === id 
        ? { ...admission, status: 'discharged', dateDischarged: today } 
        : admission
    ));

    toast({
      title: "Patient sortant",
      description: `Le patient a été marqué comme sortant avec succès.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      case 'transferred': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hospitalisé';
      case 'scheduled': return 'Programmé';
      case 'discharged': return 'Sortie effectuée';
      case 'transferred': return 'Transféré';
      default: return status;
    }
  };

  const getRoomTypeText = (type: string) => {
    switch (type) {
      case 'private': return 'Privée';
      case 'shared': return 'Commune';
      case 'intensive': return 'Soins intensifs';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hospitalisations</h2>
        <Button 
          onClick={() => setIsAdmitting(!isAdmitting)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Nouvelle admission
        </Button>
      </div>

      {/* Statistiques d'hospitalisation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patients hospitalisés</p>
                <p className="text-2xl font-bold">{activeAdmissions.length}</p>
              </div>
              <BedDouble className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admissions programmées</p>
                <p className="text-2xl font-bold">{scheduledAdmissions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sorties ce mois</p>
                <p className="text-2xl font-bold">{dischargedAdmissions.length}</p>
              </div>
              <UserMinus className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdmitting && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nouvelle admission</CardTitle>
            <CardDescription>Renseignez les informations d'admission du patient</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nom du patient</Label>
                <Input 
                  id="patientName"
                  value={newAdmission.patientName}
                  onChange={(e) => setNewAdmission({...newAdmission, patientName: e.target.value})}
                  placeholder="Nom complet du patient"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientId">ID patient</Label>
                <Input 
                  id="patientId"
                  value={newAdmission.patientId}
                  onChange={(e) => setNewAdmission({...newAdmission, patientId: e.target.value})}
                  placeholder="ex: PAT-1234"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Médecin référent</Label>
                <Input 
                  id="doctor"
                  value={newAdmission.doctor}
                  onChange={(e) => setNewAdmission({...newAdmission, doctor: e.target.value})}
                  placeholder="Nom du médecin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roomType">Type de chambre</Label>
                <select 
                  id="roomType"
                  value={newAdmission.roomType}
                  onChange={(e) => setNewAdmission({...newAdmission, roomType: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="shared">Commune</option>
                  <option value="private">Privée</option>
                  <option value="intensive">Soins intensifs</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Numéro de chambre</Label>
                <Input 
                  id="roomNumber"
                  value={newAdmission.roomNumber}
                  onChange={(e) => setNewAdmission({...newAdmission, roomNumber: e.target.value})}
                  placeholder="ex: 205"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select 
                  id="status"
                  value={newAdmission.status}
                  onChange={(e) => setNewAdmission({...newAdmission, status: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="scheduled">Programmé</option>
                  <option value="active">Actif (immédiat)</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="diagnosis">Diagnostic / Raison d'admission</Label>
                <Input 
                  id="diagnosis"
                  value={newAdmission.diagnosis}
                  onChange={(e) => setNewAdmission({...newAdmission, diagnosis: e.target.value})}
                  placeholder="Diagnostic médical ou raison d'admission"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes médicales</Label>
                <Input 
                  id="notes"
                  value={newAdmission.notes}
                  onChange={(e) => setNewAdmission({...newAdmission, notes: e.target.value})}
                  placeholder="Notes supplémentaires, traitements, consignes particulières..."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdmitting(false)}>Annuler</Button>
            <Button onClick={handleNewAdmission}>Enregistrer</Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="active">Actuelles</TabsTrigger>
            <TabsTrigger value="scheduled">Programmées</TabsTrigger>
            <TabsTrigger value="discharged">Sorties</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Réf.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date d'admission</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Chambre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Diagnostic</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Médecin</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions.map((admission) => (
                      <tr key={admission.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{admission.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{admission.patientName}</div>
                            <div className="text-sm text-gray-500">{admission.patientId}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{admission.dateAdmitted}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div>{admission.roomNumber}</div>
                            <div className="text-sm text-gray-500">{getRoomTypeText(admission.roomType)}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{admission.diagnosis}</td>
                        <td className="py-3 px-4">{admission.doctor}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(admission.status)}`}>
                            {getStatusText(admission.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {admission.status === 'active' && (
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleDischarge(admission.id)}>
                              <UserMinus className="h-4 w-4 mr-1" />
                              Sortie
                            </Button>
                          )}
                          {admission.status === 'scheduled' && (
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                              setAdmissions(admissions.map(a => 
                                a.id === admission.id ? { ...a, status: 'active' } : a
                              ));
                              toast({
                                title: "Admission activée",
                                description: "Le patient a été admis avec succès."
                              });
                            }}>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Admettre
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Réf.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date d'admission</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Durée</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Chambre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Diagnostic</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions
                      .filter(admission => admission.status === 'active')
                      .map((admission) => {
                        // Calculer la durée du séjour
                        const admissionDate = new Date(admission.dateAdmitted);
                        const today = new Date();
                        const stayDuration = Math.floor((today.getTime() - admissionDate.getTime()) / (1000 * 3600 * 24));
                        
                        return (
                          <tr key={admission.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{admission.id}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{admission.patientName}</div>
                                <div className="text-sm text-gray-500">{admission.patientId}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{admission.dateAdmitted}</td>
                            <td className="py-3 px-4">{stayDuration} jours</td>
                            <td className="py-3 px-4">
                              <div>
                                <div>{admission.roomNumber}</div>
                                <div className="text-sm text-gray-500">{getRoomTypeText(admission.roomType)}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{admission.diagnosis}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <Button variant="outline" size="sm" className="mr-2" onClick={() => handleDischarge(admission.id)}>
                                <UserMinus className="h-4 w-4 mr-1" />
                                Sortie
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Dossier
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Réf.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date prévue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Chambre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Motif</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions
                      .filter(admission => admission.status === 'scheduled')
                      .map((admission) => (
                        <tr key={admission.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{admission.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{admission.patientName}</div>
                              <div className="text-sm text-gray-500">{admission.patientId}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{admission.dateAdmitted}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div>{admission.roomNumber !== 'À attribuer' ? admission.roomNumber : 'À attribuer'}</div>
                              <div className="text-sm text-gray-500">{getRoomTypeText(admission.roomType)}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{admission.diagnosis}</td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                              setAdmissions(admissions.map(a => 
                                a.id === admission.id ? { ...a, status: 'active' } : a
                              ));
                              toast({
                                title: "Admission activée",
                                description: "Le patient a été admis avec succès."
                              });
                            }}>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Admettre
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discharged" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Réf.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Admission</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Sortie</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Durée</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Diagnostic</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions
                      .filter(admission => admission.status === 'discharged')
                      .map((admission) => {
                        // Calculer la durée du séjour
                        const admissionDate = new Date(admission.dateAdmitted);
                        const dischargeDate = new Date(admission.dateDischarged || admissionDate);
                        const stayDuration = Math.floor((dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 3600 * 24));
                        
                        return (
                          <tr key={admission.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{admission.id}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{admission.patientName}</div>
                                <div className="text-sm text-gray-500">{admission.patientId}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{admission.dateAdmitted}</td>
                            <td className="py-3 px-4">{admission.dateDischarged}</td>
                            <td className="py-3 px-4">{stayDuration} jours</td>
                            <td className="py-3 px-4">{admission.diagnosis}</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Résumé
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdmissionsPage;
