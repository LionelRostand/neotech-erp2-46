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
  Receipt, 
  CreditCard, 
  PlusCircle, 
  Search, 
  FileText, 
  BadgePercent, 
  Calendar, 
  ArrowUpDown, 
  Euro 
} from 'lucide-react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useToast } from '@/hooks/use-toast';

interface BillingRecord {
  id: string;
  patientName: string;
  patientId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  insuranceCoverage: number;
  remainingAmount: number;
  description: string;
  serviceType: string;
}

const mockBillingData: BillingRecord[] = [
  {
    id: 'BILL-001',
    patientName: 'Marie Dupont',
    patientId: 'PAT-1234',
    amount: 145.50,
    date: '2023-09-15',
    status: 'paid',
    insuranceCoverage: 100.00,
    remainingAmount: 45.50,
    description: 'Consultation généraliste + analyses',
    serviceType: 'Consultation'
  },
  {
    id: 'BILL-002',
    patientName: 'Thomas Martin',
    patientId: 'PAT-5678',
    amount: 320.75,
    date: '2023-09-18',
    status: 'pending',
    insuranceCoverage: 220.00,
    remainingAmount: 100.75,
    description: 'Radiographie + consultation spécialiste',
    serviceType: 'Radiologie'
  },
  {
    id: 'BILL-003',
    patientName: 'Léa Bernard',
    patientId: 'PAT-9012',
    amount: 1250.00,
    date: '2023-09-10',
    status: 'overdue',
    insuranceCoverage: 800.00,
    remainingAmount: 450.00,
    description: 'Procédure chirurgicale ambulatoire',
    serviceType: 'Chirurgie'
  },
  {
    id: 'BILL-004',
    patientName: 'Pierre Moreau',
    patientId: 'PAT-3456',
    amount: 75.00,
    date: '2023-09-20',
    status: 'pending',
    insuranceCoverage: 50.00,
    remainingAmount: 25.00,
    description: 'Consultation de suivi',
    serviceType: 'Consultation'
  },
  {
    id: 'BILL-005',
    patientName: 'Sophie Lambert',
    patientId: 'PAT-7890',
    amount: 450.25,
    date: '2023-09-05',
    status: 'paid',
    insuranceCoverage: 350.00,
    remainingAmount: 100.25,
    description: 'Séance de kinésithérapie + matériel',
    serviceType: 'Rééducation'
  }
];

const BillingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(mockBillingData);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    patientName: '',
    patientId: '',
    amount: 0,
    serviceType: '',
    description: '',
    insuranceCoverage: 0
  });
  
  const { toast } = useToast();
  const { add, loading } = useFirestore(COLLECTIONS.HEALTH.BILLING);

  const filteredRecords = billingRecords.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = () => {
    if (!newInvoice.patientName || !newInvoice.patientId || newInvoice.amount <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const remainingAmount = newInvoice.amount - newInvoice.insuranceCoverage;
    
    const invoice: Omit<BillingRecord, 'id'> = {
      ...newInvoice,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      remainingAmount: remainingAmount > 0 ? remainingAmount : 0
    };

    const newId = `BILL-${String(billingRecords.length + 1).padStart(3, '0')}`;
    const newRecord = { ...invoice, id: newId } as BillingRecord;
    
    setBillingRecords([...billingRecords, newRecord]);
    setIsCreatingInvoice(false);
    setNewInvoice({
      patientName: '',
      patientId: '',
      amount: 0,
      serviceType: '',
      description: '',
      insuranceCoverage: 0
    });

    toast({
      title: "Facture créée",
      description: `La facture ${newId} a été créée avec succès.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };
  
  const totalBilled = billingRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalPaid = billingRecords
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);
  const totalPending = billingRecords
    .filter(record => record.status === 'pending')
    .reduce((sum, record) => sum + record.amount, 0);
  const totalOverdue = billingRecords
    .filter(record => record.status === 'overdue')
    .reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Facturation</h2>
        <Button 
          onClick={() => setIsCreatingInvoice(!isCreatingInvoice)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total facturé</p>
                <p className="text-2xl font-bold">{totalBilled.toFixed(2)} €</p>
              </div>
              <Euro className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payé</p>
                <p className="text-2xl font-bold">{totalPaid.toFixed(2)} €</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{totalPending.toFixed(2)} €</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold">{totalOverdue.toFixed(2)} €</p>
              </div>
              <Receipt className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {isCreatingInvoice && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Créer une nouvelle facture</CardTitle>
            <CardDescription>Renseignez les informations de facturation du patient</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nom du patient</Label>
                <Input 
                  id="patientName"
                  value={newInvoice.patientName}
                  onChange={(e) => setNewInvoice({...newInvoice, patientName: e.target.value})}
                  placeholder="Nom complet du patient"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientId">ID patient</Label>
                <Input 
                  id="patientId"
                  value={newInvoice.patientId}
                  onChange={(e) => setNewInvoice({...newInvoice, patientId: e.target.value})}
                  placeholder="ex: PAT-1234"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Montant total (€)</Label>
                <Input 
                  id="amount"
                  type="number"
                  value={newInvoice.amount || ''}
                  onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceCoverage">Prise en charge assurance (€)</Label>
                <Input 
                  id="insuranceCoverage"
                  type="number"
                  value={newInvoice.insuranceCoverage || ''}
                  onChange={(e) => setNewInvoice({...newInvoice, insuranceCoverage: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceType">Type de service</Label>
                <Input 
                  id="serviceType"
                  value={newInvoice.serviceType}
                  onChange={(e) => setNewInvoice({...newInvoice, serviceType: e.target.value})}
                  placeholder="ex: Consultation, Radiologie, etc."
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                  placeholder="Description détaillée des services facturés"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreatingInvoice(false)}>Annuler</Button>
            <Button onClick={handleCreateInvoice} disabled={loading}>Créer la facture</Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="paid">Payées</TabsTrigger>
            <TabsTrigger value="overdue">En retard</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une facture..."
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
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reste à payer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{record.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{record.patientName}</div>
                            <div className="text-sm text-gray-500">{record.patientId}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{record.serviceType}</td>
                        <td className="py-3 px-4">{record.date}</td>
                        <td className="py-3 px-4">{record.amount.toFixed(2)} €</td>
                        <td className="py-3 px-4">{record.remainingAmount.toFixed(2)} €</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                            {getStatusText(record.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
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
        
        <TabsContent value="pending" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Réf.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reste à payer</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords
                      .filter(record => record.status === 'pending')
                      .map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{record.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{record.patientName}</div>
                              <div className="text-sm text-gray-500">{record.patientId}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{record.serviceType}</td>
                          <td className="py-3 px-4">{record.date}</td>
                          <td className="py-3 px-4">{record.amount.toFixed(2)} €</td>
                          <td className="py-3 px-4">{record.remainingAmount.toFixed(2)} €</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="outline" size="sm" className="mr-2">
                              <CreditCard className="h-4 w-4 mr-1" />
                              Payer
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
        
        <TabsContent value="paid" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Réf.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords
                      .filter(record => record.status === 'paid')
                      .map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{record.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{record.patientName}</div>
                              <div className="text-sm text-gray-500">{record.patientId}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{record.serviceType}</td>
                          <td className="py-3 px-4">{record.date}</td>
                          <td className="py-3 px-4">{record.amount.toFixed(2)} €</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Reçu
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
        
        <TabsContent value="overdue" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Réf.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Jours de retard</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords
                      .filter(record => record.status === 'overdue')
                      .map((record) => {
                        const invoiceDate = new Date(record.date);
                        const today = new Date();
                        const daysLate = Math.floor((today.getTime() - invoiceDate.getTime()) / (1000 * 3600 * 24));
                        
                        return (
                          <tr key={record.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{record.id}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{record.patientName}</div>
                                <div className="text-sm text-gray-500">{record.patientId}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{record.serviceType}</td>
                            <td className="py-3 px-4">{record.date}</td>
                            <td className="py-3 px-4">{record.amount.toFixed(2)} €</td>
                            <td className="py-3 px-4 text-red-500 font-medium">{daysLate} jours</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="outline" size="sm" className="mr-2">
                                <CreditCard className="h-4 w-4 mr-1" />
                                Payer
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Détails
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

export default BillingPage;
