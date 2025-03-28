import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, FileCheck, FilePlus, FileText, Search, Users } from "lucide-react";
import SubmoduleHeader from '../SubmoduleHeader';
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/hooks/use-firestore";
import { COLLECTIONS } from "@/lib/firebase-collections";

// Types pour la facturation
interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  insuranceId?: string;
  insuranceName?: string;
  date: string;
  dueDate: string;
  description: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
}

// Données de test
const initialBillingRecords: BillingRecord[] = [
  {
    id: 'BILL-001',
    patientId: 'PAT-001',
    patientName: 'Jean Dupont',
    insuranceId: 'INS-001',
    insuranceName: 'Assurance Santé Plus',
    date: '2023-05-15',
    dueDate: '2023-06-15',
    description: 'Consultation générale',
    amount: 85.00,
    paidAmount: 85.00,
    remainingAmount: 0,
    status: 'paid',
    paymentMethod: 'Carte bancaire',
    notes: 'Paiement reçu le jour de la consultation'
  },
  {
    id: 'BILL-002',
    patientId: 'PAT-002',
    patientName: 'Marie Lambert',
    insuranceId: 'INS-002',
    insuranceName: 'MutuSanté',
    date: '2023-05-18',
    dueDate: '2023-06-18',
    description: 'Radiographie + consultation',
    amount: 150.00,
    paidAmount: 50.00,
    remainingAmount: 100.00,
    status: 'pending',
    paymentMethod: 'Espèces',
    notes: 'Paiement partiel, en attente du remboursement assurance'
  },
  {
    id: 'BILL-003',
    patientId: 'PAT-003',
    patientName: 'Paul Martin',
    date: '2023-04-10',
    dueDate: '2023-05-10',
    description: 'Consultation spécialiste',
    amount: 120.00,
    paidAmount: 0,
    remainingAmount: 120.00,
    status: 'overdue',
    notes: 'Rappel envoyé le 15/05'
  }
];

const BillingPage = () => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(initialBillingRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInvoiceDialogOpen, setNewInvoiceDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    patientId: '',
    patientName: '',
    insuranceId: '',
    insuranceName: '',
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: '',
    amount: 0,
    paidAmount: 0,
    notes: ''
  });
  
  const { toast } = useToast();
  const { add, loading } = useFirestore(COLLECTIONS.HEALTH.BILLING);

  const filteredRecords = billingRecords.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = () => {
    if (!newInvoice.patientName || !newInvoice.patientId || newInvoice.amount <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const remainingAmount = newInvoice.amount - newInvoice.paidAmount;
    const status = newInvoice.paidAmount >= newInvoice.amount 
      ? 'paid' 
      : newInvoice.paidAmount > 0 
        ? 'pending' 
        : new Date(newInvoice.dueDate) < new Date() ? 'overdue' : 'pending';
        
    const invoice = {
      ...newInvoice,
      status,
      remainingAmount: remainingAmount > 0 ? remainingAmount : 0
    };

    const newId = `BILL-${String(billingRecords.length + 1).padStart(3, '0')}`;
    const newRecord = { ...invoice, id: newId } as BillingRecord;
    
    add(newRecord)
      .then(() => {
        setBillingRecords([...billingRecords, newRecord]);
        setNewInvoiceDialogOpen(false);
        setNewInvoice({
          patientId: '',
          patientName: '',
          insuranceId: '',
          insuranceName: '',
          date: new Date().toISOString().slice(0, 10),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          description: '',
          amount: 0,
          paidAmount: 0,
          notes: ''
        });
        toast({
          title: "Facture créée",
          description: `La facture #${newId} a été créée avec succès`
        });
      })
      .catch(error => {
        console.error("Erreur lors de la création de la facture:", error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la facture",
          variant: "destructive"
        });
      });
  };
  
  const totalBilled = billingRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalPaid = billingRecords
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);
  const totalOutstanding = billingRecords
    .filter(record => record.status === 'pending' || record.status === 'overdue')
    .reduce((sum, record) => sum + record.remainingAmount, 0);
  const overdueCount = billingRecords.filter(record => record.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        module={{
          id: 8,
          name: "Health",
          description: "Gestion des patients, rendez-vous et suivi médical",
          href: "/modules/health",
          icon: null,
          category: 'services',
          submodules: []
        }}
        submodule={{
          id: "health-billing",
          name: "Facturation",
          href: "/modules/health/billing",
          icon: null,
          description: "Gérez les factures et les paiements"
        }}
      />
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une facture..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setNewInvoiceDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total facturé</p>
                <h3 className="text-2xl font-bold">{totalBilled.toFixed(2)} €</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <FileCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total payé</p>
                <h3 className="text-2xl font-bold">{totalPaid.toFixed(2)} €</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Montant en attente</p>
                <h3 className="text-2xl font-bold">{totalOutstanding.toFixed(2)} €</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-full">
                <CalendarDays className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Factures en retard</p>
                <h3 className="text-2xl font-bold">{overdueCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">En attente</TabsTrigger>
          <TabsTrigger value="paid" className="flex-1">Payées</TabsTrigger>
          <TabsTrigger value="overdue" className="flex-1">En retard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les factures</CardTitle>
              <CardDescription>Liste de toutes les factures du système</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        Aucune facture trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.patientName}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.amount.toFixed(2)} €</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === 'paid'
                                ? 'success'
                                : record.status === 'pending'
                                ? 'default'
                                : record.status === 'overdue'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {record.status === 'paid'
                              ? 'Payée'
                              : record.status === 'pending'
                              ? 'En attente'
                              : record.status === 'overdue'
                              ? 'En retard'
                              : 'Annulée'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Factures en attente</CardTitle>
              <CardDescription>Liste des factures en attente de paiement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.filter(record => record.status === 'pending').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        Aucune facture en attente
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords
                      .filter(record => record.status === 'pending')
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{record.patientName}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.amount.toFixed(2)} €</TableCell>
                          <TableCell>
                            <Badge variant="default">En attente</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paid" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Factures payées</CardTitle>
              <CardDescription>Liste des factures payées</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.filter(record => record.status === 'paid').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        Aucune facture payée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords
                      .filter(record => record.status === 'paid')
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{record.patientName}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.amount.toFixed(2)} €</TableCell>
                          <TableCell>
                            <Badge variant="success">Payée</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overdue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Factures en retard</CardTitle>
              <CardDescription>Liste des factures en retard de paiement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.filter(record => record.status === 'overdue').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        Aucune facture en retard
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords
                      .filter(record => record.status === 'overdue')
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{record.patientName}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.amount.toFixed(2)} €</TableCell>
                          <TableCell>
                            <Badge variant="destructive">En retard</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={newInvoiceDialogOpen} onOpenChange={setNewInvoiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle facture</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">ID Patient</Label>
                <Input
                  id="patientId"
                  value={newInvoice.patientId}
                  onChange={(e) => setNewInvoice({...newInvoice, patientId: e.target.value})}
                  placeholder="PAT-000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Nom du patient</Label>
                <Input
                  id="patientName"
                  value={newInvoice.patientName}
                  onChange={(e) => setNewInvoice({...newInvoice, patientName: e.target.value})}
                  placeholder="Nom complet"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceId">ID Assurance</Label>
                <Input
                  id="insuranceId"
                  value={newInvoice.insuranceId}
                  onChange={(e) => setNewInvoice({...newInvoice, insuranceId: e.target.value})}
                  placeholder="INS-000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceName">Nom de l'assurance</Label>
                <Input
                  id="insuranceName"
                  value={newInvoice.insuranceName}
                  onChange={(e) => setNewInvoice({...newInvoice, insuranceName: e.target.value})}
                  placeholder="Nom de l'assurance"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date de facturation</Label>
                <Input
                  id="date"
                  type="date"
                  value={newInvoice.date}
                  onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newInvoice.description}
                onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                placeholder="Description des services"
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant total (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value)})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paidAmount">Montant payé (€)</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={newInvoice.paidAmount}
                  onChange={(e) => setNewInvoice({...newInvoice, paidAmount: parseFloat(e.target.value)})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  max={newInvoice.amount}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newInvoice.notes}
                onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                placeholder="Notes additionnelles"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewInvoiceDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleCreateInvoice} disabled={loading}>
              {loading ? "Création..." : "Créer la facture"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingPage;
