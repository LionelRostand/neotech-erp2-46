
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  History, 
  FileEdit, 
  Download, 
  Search,
  Plus,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Mock data for salaries
const MOCK_SALARIES = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Martin Dupont",
    position: "Chef de Projet Digital",
    baseSalary: 3800,
    currency: "EUR",
    lastModified: "05/01/2025",
    paymentStatus: "Payé",
    paymentMethod: "Virement bancaire",
    leaveBalance: {
      paidLeave: 18,
      sickLeave: 5,
      rtt: 4  // RTT (Réduction du Temps de Travail)
    },
    history: [
      { date: "05/01/2025", amount: 3800, reason: "Salaire mensuel" },
      { date: "05/12/2024", amount: 3800, reason: "Salaire mensuel" },
      { date: "05/11/2024", amount: 3700, reason: "Salaire mensuel" },
      { date: "05/10/2024", amount: 3700, reason: "Salaire mensuel" },
      { date: "01/10/2024", amount: 3700, reason: "Augmentation salariale", details: "Révision annuelle" }
    ]
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Lionel Djossa",
    position: "PDG",
    baseSalary: 8500,
    currency: "EUR",
    lastModified: "05/01/2025",
    paymentStatus: "Payé",
    paymentMethod: "Virement bancaire",
    leaveBalance: {
      paidLeave: 24,
      sickLeave: 12,
      rtt: 8
    },
    history: [
      { date: "05/01/2025", amount: 8500, reason: "Salaire mensuel" },
      { date: "05/12/2024", amount: 8500, reason: "Salaire mensuel" },
      { date: "05/11/2024", amount: 8500, reason: "Salaire mensuel" }
    ]
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Sophie Martin",
    position: "Directrice Marketing",
    baseSalary: 5200,
    currency: "EUR",
    lastModified: "05/01/2025",
    paymentStatus: "Payé",
    paymentMethod: "Virement bancaire",
    leaveBalance: {
      paidLeave: 15,
      sickLeave: 3,
      rtt: 6
    },
    history: [
      { date: "05/01/2025", amount: 5200, reason: "Salaire mensuel" },
      { date: "05/12/2024", amount: 5200, reason: "Salaire mensuel" },
      { date: "05/11/2024", amount: 5000, reason: "Salaire mensuel" },
      { date: "01/11/2024", amount: 5000, reason: "Augmentation salariale", details: "Promotion" }
    ]
  }
];

// Liste des employés pour le sélecteur dans le formulaire d'ajout
const EMPLOYEES_LIST = [
  { id: "EMP001", name: "Martin Dupont" },
  { id: "EMP002", name: "Lionel Djossa" },
  { id: "EMP003", name: "Sophie Martin" },
  { id: "EMP004", name: "Julie Lemaire" },
  { id: "EMP005", name: "Thomas Bernard" },
];

const EmployeesSalaries: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [salaries, setSalaries] = useState(MOCK_SALARIES);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddPayslipOpen, setIsAddPayslipOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const exportHistoryRef = useRef(null);
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    baseSalary: 0,
    paymentMethod: '',
    notes: '',
    leaveBalance: {
      paidLeave: 0,
      sickLeave: 0,
      rtt: 0
    }
  });
  
  // Form state for adding new payslip
  const [addPayslipForm, setAddPayslipForm] = useState({
    employeeId: '',
    period: '',
    baseSalary: '',
    bonuses: '',
    deductions: '',
    netAmount: '',
    paymentMethod: 'Virement bancaire',
    paymentStatus: 'En attente',
    notes: '',
    leaveBalance: {
      paidLeave: 0,
      sickLeave: 0,
      rtt: 0
    }
  });

  // Filter salaries based on search
  const filteredSalaries = salaries.filter(salary => 
    salary.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salary.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salary.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewHistory = (salary: any) => {
    setSelectedSalary(salary);
    setIsHistoryDialogOpen(true);
  };

  const handleEdit = (salary: any) => {
    setSelectedSalary(salary);
    setEditForm({
      baseSalary: salary.baseSalary,
      paymentMethod: salary.paymentMethod,
      notes: '',
      leaveBalance: salary.leaveBalance || {
        paidLeave: 0,
        sickLeave: 0,
        rtt: 0
      }
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedSalary) return;

    // Update salary information
    const updatedSalaries = salaries.map(salary => {
      if (salary.id === selectedSalary.id) {
        // Create history entry for salary change if amount changed
        let updatedHistory = [...salary.history];
        if (salary.baseSalary !== editForm.baseSalary) {
          const today = new Date();
          const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
          
          updatedHistory = [
            {
              date: formattedDate,
              amount: editForm.baseSalary,
              reason: "Modification salariale",
              details: editForm.notes || "Mise à jour manuelle"
            },
            ...updatedHistory
          ];
        }
        
        return {
          ...salary,
          baseSalary: editForm.baseSalary,
          paymentMethod: editForm.paymentMethod,
          lastModified: new Date().toLocaleDateString('fr-FR'),
          leaveBalance: editForm.leaveBalance,
          history: updatedHistory
        };
      }
      return salary;
    });

    setSalaries(updatedSalaries);
    toast.success("Informations salariales mises à jour avec succès");
    setIsEditDialogOpen(false);
  };

  const handleAddPayslip = () => {
    // Trouver l'employé dans la liste
    const employee = EMPLOYEES_LIST.find(emp => emp.id === addPayslipForm.employeeId);
    
    if (!employee) {
      toast.error("Veuillez sélectionner un employé valide");
      return;
    }
    
    // Calculer le montant net si pas encore défini
    const netAmount = addPayslipForm.netAmount || 
      (parseFloat(addPayslipForm.baseSalary) + 
      (parseFloat(addPayslipForm.bonuses) || 0) - 
      (parseFloat(addPayslipForm.deductions) || 0)).toString();
    
    // Créer un nouvel objet fiche de paie
    const newPayslip = {
      id: String(salaries.length + 1),
      employeeId: addPayslipForm.employeeId,
      employeeName: employee.name,
      position: "À définir", // Normalement, cela viendrait d'une base de données
      baseSalary: parseFloat(addPayslipForm.baseSalary),
      currency: "EUR",
      lastModified: new Date().toLocaleDateString('fr-FR'),
      paymentStatus: addPayslipForm.paymentStatus,
      paymentMethod: addPayslipForm.paymentMethod,
      leaveBalance: addPayslipForm.leaveBalance,
      history: [
        {
          date: new Date().toLocaleDateString('fr-FR'),
          amount: parseFloat(addPayslipForm.baseSalary),
          reason: `Salaire ${addPayslipForm.period}`,
          details: addPayslipForm.notes
        }
      ]
    };
    
    // Ajouter la nouvelle fiche de paie à la liste
    setSalaries([...salaries, newPayslip]);
    
    // Réinitialiser le formulaire
    setAddPayslipForm({
      employeeId: '',
      period: '',
      baseSalary: '',
      bonuses: '',
      deductions: '',
      netAmount: '',
      paymentMethod: 'Virement bancaire',
      paymentStatus: 'En attente',
      notes: '',
      leaveBalance: {
        paidLeave: 0,
        sickLeave: 0,
        rtt: 0
      }
    });
    
    toast.success("Fiche de paie ajoutée avec succès");
    setIsAddPayslipOpen(false);
  };

  const handleExportPayslip = (salary: any) => {
    // Création du PDF
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(20);
    doc.text("Bulletin de paie", 105, 15, { align: "center" });
    
    // Informations de l'employé
    doc.setFontSize(12);
    doc.text("Informations de l'employé", 15, 30);
    doc.setFontSize(10);
    doc.text(`Nom: ${salary.employeeName}`, 15, 40);
    doc.text(`ID: ${salary.employeeId}`, 15, 45);
    doc.text(`Poste: ${salary.position}`, 15, 50);
    doc.text(`Date: ${salary.lastModified}`, 15, 55);
    
    // Informations de salaire
    doc.setFontSize(12);
    doc.text("Détails du salaire", 15, 70);
    doc.setFontSize(10);
    doc.text(`Salaire de base: ${salary.baseSalary} ${salary.currency}`, 15, 80);
    doc.text(`Méthode de paiement: ${salary.paymentMethod}`, 15, 85);
    doc.text(`Statut: ${salary.paymentStatus}`, 15, 90);
    
    // Solde de congés
    doc.setFontSize(12);
    doc.text("Solde de congés", 15, 105);
    doc.setFontSize(10);
    if (salary.leaveBalance) {
      doc.text(`Congés payés: ${salary.leaveBalance.paidLeave} jours`, 15, 115);
      doc.text(`Congés maladie: ${salary.leaveBalance.sickLeave} jours`, 15, 120);
      doc.text(`RTT: ${salary.leaveBalance.rtt} jours`, 15, 125);
    } else {
      doc.text("Aucune information de congés disponible", 15, 115);
    }
    
    // Tableau d'historique simplifié
    if (salary.history && salary.history.length > 0) {
      const latestEntry = salary.history[0];
      
      doc.setFontSize(12);
      doc.text("Dernière modification", 15, 140);
      doc.setFontSize(10);
      doc.text(`Date: ${latestEntry.date}`, 15, 150);
      doc.text(`Montant: ${latestEntry.amount} ${salary.currency}`, 15, 155);
      doc.text(`Raison: ${latestEntry.reason}`, 15, 160);
      if (latestEntry.details) {
        doc.text(`Détails: ${latestEntry.details}`, 15, 165);
      }
    }
    
    // Pied de page
    doc.setFontSize(8);
    doc.text("Ce document est généré automatiquement et ne nécessite pas de signature.", 105, 280, { align: "center" });
    
    // Téléchargement du PDF
    doc.save(`Bulletin_de_paie_${salary.employeeName.replace(/ /g, '_')}.pdf`);
    
    toast.success(`Bulletin de paie de ${salary.employeeName} téléchargé`);
  };
  
  const handleExportHistory = () => {
    if (!selectedSalary) return;
    
    // Préparer les données pour l'export
    const historyData = selectedSalary.history.map((entry: any) => ({
      Date: entry.date,
      Montant: `${entry.amount} ${selectedSalary.currency}`,
      Raison: entry.reason,
      Détails: entry.details || '-'
    }));
    
    // Créer un workbook et ajouter les données
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(historyData);
    XLSX.utils.book_append_sheet(wb, ws, "Historique Salaires");
    
    // Télécharger le fichier
    XLSX.writeFile(wb, `Historique_Salaires_${selectedSalary.employeeName}.xlsx`);
    
    toast.success(`Historique des salaires de ${selectedSalary.employeeName} exporté avec succès`);
    setIsHistoryDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestion des salaires</h2>
        <p className="text-gray-500">Gestion et suivi des salaires des employés</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Rechercher par nom, poste..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddPayslipOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une fiche de paie
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Salaire de base</TableHead>
                <TableHead>Dernière modification</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell className="font-medium">{salary.employeeId}</TableCell>
                  <TableCell>{salary.employeeName}</TableCell>
                  <TableCell>{salary.position}</TableCell>
                  <TableCell>{salary.baseSalary} {salary.currency}</TableCell>
                  <TableCell>{salary.lastModified}</TableCell>
                  <TableCell>
                    <Badge className={
                      salary.paymentStatus === "Payé" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : salary.paymentStatus === "En attente"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }>
                      {salary.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewHistory(salary)}
                      title="Historique"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(salary)}
                      title="Modifier"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleExportPayslip(salary)}
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSalaries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun salaire trouvé.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Salary History Dialog */}
      {selectedSalary && (
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Historique des salaires - {selectedSalary.employeeName}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Employé:</p>
                  <p>{selectedSalary.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Poste:</p>
                  <p>{selectedSalary.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Salaire actuel:</p>
                  <p className="font-bold">{selectedSalary.baseSalary} {selectedSalary.currency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Méthode de paiement:</p>
                  <p>{selectedSalary.paymentMethod}</p>
                </div>
              </div>

              <div className="border p-4 rounded-md mt-4">
                <h3 className="text-lg font-medium mb-2">Solde de congés</h3>
                {selectedSalary.leaveBalance ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Congés payés:</p>
                      <p>{selectedSalary.leaveBalance.paidLeave} jours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Congés maladie:</p>
                      <p>{selectedSalary.leaveBalance.sickLeave} jours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">RTT:</p>
                      <p>{selectedSalary.leaveBalance.rtt} jours</p>
                    </div>
                  </div>
                ) : (
                  <p>Aucune information de congés disponible</p>
                )}
              </div>

              <h3 className="text-lg font-medium pt-4">Historique des modifications</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSalary.history.map((entry: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.amount} {selectedSalary.currency}</TableCell>
                      <TableCell>{entry.reason}</TableCell>
                      <TableCell>{entry.details || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>
              <Button onClick={handleExportHistory} ref={exportHistoryRef}>
                <Download className="h-4 w-4 mr-2" />
                Exporter l'historique
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Salary Dialog */}
      {selectedSalary && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier les informations salariales - {selectedSalary.employeeName}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Salaire de base ({selectedSalary.currency})</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  value={editForm.baseSalary}
                  onChange={(e) => setEditForm({...editForm, baseSalary: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                <Select
                  value={editForm.paymentMethod}
                  onValueChange={(value) => setEditForm({...editForm, paymentMethod: value})}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                    <SelectItem value="Chèque">Chèque</SelectItem>
                    <SelectItem value="Espèces">Espèces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border p-4 rounded-md">
                <Label className="text-md font-medium block mb-4">Solde de congés</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paidLeave">Congés payés</Label>
                    <Input
                      id="paidLeave"
                      type="number"
                      value={editForm.leaveBalance.paidLeave}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        leaveBalance: {
                          ...editForm.leaveBalance,
                          paidLeave: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sickLeave">Congés maladie</Label>
                    <Input
                      id="sickLeave"
                      type="number"
                      value={editForm.leaveBalance.sickLeave}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        leaveBalance: {
                          ...editForm.leaveBalance,
                          sickLeave: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rtt">RTT</Label>
                    <Input
                      id="rtt"
                      type="number"
                      value={editForm.leaveBalance.rtt}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        leaveBalance: {
                          ...editForm.leaveBalance,
                          rtt: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (raison de la modification)</Label>
                <Input
                  id="notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  placeholder="Ex: Augmentation annuelle, promotion, etc."
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleSaveEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Payslip Dialog */}
      <Dialog open={isAddPayslipOpen} onOpenChange={setIsAddPayslipOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle fiche de paie</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employé</Label>
              <Select
                value={addPayslipForm.employeeId}
                onValueChange={(value) => setAddPayslipForm({...addPayslipForm, employeeId: value})}
              >
                <SelectTrigger id="employeeId">
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEES_LIST.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Période</Label>
              <Input
                id="period"
                placeholder="Ex: Janvier 2025"
                value={addPayslipForm.period}
                onChange={(e) => setAddPayslipForm({...addPayslipForm, period: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Salaire de base (EUR)</Label>
              <Input
                id="baseSalary"
                type="number"
                placeholder="0.00"
                value={addPayslipForm.baseSalary}
                onChange={(e) => setAddPayslipForm({...addPayslipForm, baseSalary: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bonuses">Primes (EUR)</Label>
              <Input
                id="bonuses"
                type="number"
                placeholder="0.00"
                value={addPayslipForm.bonuses}
                onChange={(e) => setAddPayslipForm({...addPayslipForm, bonuses: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deductions">Déductions (EUR)</Label>
              <Input
                id="deductions"
                type="number"
                placeholder="0.00"
                value={addPayslipForm.deductions}
                onChange={(e) => setAddPayslipForm({...addPayslipForm, deductions: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="netAmount">Montant net (EUR)</Label>
              <Input
                id="netAmount"
                type="number"
                placeholder="Calculé automatiquement"
                value={addPayslipForm.netAmount}
                onChange={(e) => setAddPayslipForm({...addPayslipForm, netAmount: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Méthode de paiement</Label>
              <Select
                value={addPayslipForm.paymentMethod}
                onValueChange={(value) => setAddPayslipForm({...addPayslipForm, paymentMethod: value})}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                  <SelectItem value="Chèque">Chèque</SelectItem>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Statut</Label>
              <Select
                value={addPayslipForm.paymentStatus}
                onValueChange={(value) => setAddPayslipForm({...addPayslipForm, paymentStatus: value})}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Payé">Payé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border p-4 rounded-md mt-4">
            <Label className="text-md font-medium block mb-4">Informations de congés</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paidLeave">Congés payés</Label>
                <Input
                  id="paidLeave"
                  type="number"
                  value={addPayslipForm.leaveBalance.paidLeave}
                  onChange={(e) => setAddPayslipForm({
                    ...addPayslipForm,
                    leaveBalance: {
                      ...addPayslipForm.leaveBalance,
                      paidLeave: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sickLeave">Congés maladie</Label>
                <Input
                  id="sickLeave"
                  type="number"
                  value={addPayslipForm.leaveBalance.sickLeave}
                  onChange={(e) => setAddPayslipForm({
                    ...addPayslipForm,
                    leaveBalance: {
                      ...addPayslipForm.leaveBalance,
                      sickLeave: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rtt">RTT</Label>
                <Input
                  id="rtt"
                  type="number"
                  value={addPayslipForm.leaveBalance.rtt}
                  onChange={(e) => setAddPayslipForm({
                    ...addPayslipForm,
                    leaveBalance: {
                      ...addPayslipForm.leaveBalance,
                      rtt: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Notes ou commentaires sur cette fiche de paie"
              value={addPayslipForm.notes}
              onChange={(e) => setAddPayslipForm({...addPayslipForm, notes: e.target.value})}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleAddPayslip} disabled={!addPayslipForm.employeeId || !addPayslipForm.baseSalary}>
              <FileText className="h-4 w-4 mr-2" />
              Créer la fiche de paie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesSalaries;
