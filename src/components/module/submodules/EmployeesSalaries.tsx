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
      rtt: 4
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

    const updatedSalaries = salaries.map(salary => {
      if (salary.id === selectedSalary.id) {
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
    const employee = EMPLOYEES_LIST.find(emp => emp.id === addPayslipForm.employeeId);
    
    if (!employee) {
      toast.error("Veuillez sélectionner un employé valide");
      return;
    }
    
    const netAmount = addPayslipForm.netAmount || 
      (parseFloat(addPayslipForm.baseSalary) + 
      (parseFloat(addPayslipForm.bonuses) || 0) - 
      (parseFloat(addPayslipForm.deductions) || 0)).toString();
    
    const newPayslip = {
      id: String(salaries.length + 1),
      employeeId: addPayslipForm.employeeId,
      employeeName: employee.name,
      position: "À définir",
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
    
    setSalaries([...salaries, newPayslip]);
    
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
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN DE PAIE', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`EN EUROS - ${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`, 105, 22, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 25, 195, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Storm Group', 15, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('19 rue de Turbigo', 15, 40);
    doc.text('75002 PARIS 02', 15, 45);
    
    doc.text('N° SIRET: 91415699700027', 15, 55);
    doc.text('N°APE: 70222', 15, 60);
    
    doc.text('Convention Collective: BUREAUX D\'ÉTUDES', 15, 65);
    doc.text('TECHNIQUES, CABINETS D\'INGÉNIEURS-', 15, 70);
    doc.text('CONSEILS ET SOCIÉTÉS DE CONSEILS (SYNTEC)', 15, 75);
    doc.text('- 1486', 15, 80);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${salary.employeeName}`, 140, 35);
    doc.setFont('helvetica', 'normal');
    doc.text('721 Résidence de l\'Aquitaine', 140, 40);
    doc.text('77190 DAMMARIE LES LYS', 140, 45);
    
    doc.text(`Début de période: ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, 140, 55);
    doc.text(`Fin de période: ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, 140, 60);
    
    doc.setFillColor(240, 250, 255);
    doc.rect(15, 90, 180, 65, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bonjour ${salary.employeeName.split(' ')[0]}`, 25, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Voici votre bulletin de paie de ${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`, 25, 110);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Votre salaire avant impôt', 25, 125);
    doc.text(`${salary.baseSalary.toFixed(2)} €`, 175, 125, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Prélèvement à la source (3,60 %)`, 25, 132);
    const taxAmount = (salary.baseSalary * 0.036).toFixed(2);
    doc.text(`${taxAmount} €`, 175, 132, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Votre salaire après impôt', 25, 142);
    const netSalary = (salary.baseSalary - parseFloat(taxAmount)).toFixed(2);
    doc.text(`${netSalary} €`, 175, 142, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Ce montant vous sera transféré le ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, 25, 149);
    
    doc.setFillColor(250, 250, 240);
    doc.rect(15, 165, 180, 100, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Congés disponibles', 105, 175, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Jours posés en ${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`, 105, 182, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.text('CP N-2', 25, 195);
    doc.text(`${salary.leaveBalance.paidLeave.toFixed(2)} jours`, 175, 195, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text('+ Acquis', 30, 205);
    doc.text(`${salary.leaveBalance.paidLeave.toFixed(2)} j`, 175, 205, { align: 'right' });
    
    doc.text('- Pris', 30, 212);
    doc.text(`0,00 j`, 175, 212, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.text('CP N-1', 25, 225);
    doc.text(`${salary.leaveBalance.rtt.toFixed(2)} jours`, 175, 225, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text('+ Acquis', 30, 235);
    doc.text(`${salary.leaveBalance.rtt.toFixed(2)} j`, 175, 235, { align: 'right' });
    
    doc.text('- Pris', 30, 242);
    doc.text(`0,00 j`, 175, 242, { align: 'right' });
    
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 260, 25, 25, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(20, 265, 15, 15, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(22, 267, 11, 11, 'F');
    
    doc.setFontSize(7);
    doc.text('Vérifiez', 20, 290);
    doc.text('l\'intégrité', 20, 295);
    doc.text('du bulletin', 20, 300);
    
    doc.text('CODE DE VÉRIFICATION: S18241', 15, 310);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Retrouvez tous les détails de votre fichier en deuxième', 105, 285, { align: 'center' });
    doc.text('page de votre bulletin de paie', 105, 292, { align: 'center' });
    
    doc.addPage();
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN DE PAIE - EN EUROS', 105, 15, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text('Storm Group', 20, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('19 rue de Turbigo', 20, 35);
    doc.text('75002 PARIS 02', 20, 40);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${salary.employeeName}`, 105, 30, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('721 Résidence de l\'Aquitaine', 105, 35, { align: 'center' });
    doc.text('77190 DAMMARIE LES LYS', 105, 40, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Détail du salarié', 180, 30, { align: 'right' });
    
    doc.autoTable({
      startY: 50,
      head: [['DÉSIGNATION', 'BASE', 'PART SALARIÉ', 'PART EMPLOYEUR']],
      body: [
        ['Salaire de base', '151,67', `${(salary.baseSalary * 0.85).toFixed(2)}`, ''],
        ['Heures supplémentaires contractuelles 25 %', '17,33', `${(salary.baseSalary * 0.15).toFixed(2)}`, ''],
        [`Rémunération brute ⓘ`, '', `${salary.baseSalary.toFixed(2)}`, ''],
        ['Sécurité sociale plafonnée', `${salary.baseSalary.toFixed(2)}`, `${(salary.baseSalary * 0.055).toFixed(2)}`, `${(salary.baseSalary * 0.088).toFixed(2)}`],
        ['Complémentaire Tranche 1', `${(salary.baseSalary * 0.82).toFixed(2)}`, `${(salary.baseSalary * 0.041).toFixed(2)}`, `${(salary.baseSalary * 0.062).toFixed(2)}`],
        ['CSG déductible de l\'impôt sur le revenu', `${(salary.baseSalary * 0.98).toFixed(2)}`, `${(salary.baseSalary * 0.068).toFixed(2)}`, ''],
        ['Prélèvement à la source', '', `${taxAmount}`, ''],
        ['Net à payer', '', `${netSalary}`, ''],
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 30, halign: 'right' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' },
      },
    });
    
    doc.autoTable({
      startY: 190,
      head: [['Soldes de congés', 'CP N-2', 'CP N-1', 'CP N']],
      body: [
        ['Acquis', `${salary.leaveBalance.paidLeave.toFixed(2)}`, `${salary.leaveBalance.sickLeave.toFixed(2)}`, `${salary.leaveBalance.rtt.toFixed(2)}`],
        ['Pris', '0,00', '0,00', '0,00'],
        ['Solde', `${salary.leaveBalance.paidLeave.toFixed(2)}`, `${salary.leaveBalance.sickLeave.toFixed(2)}`, `${salary.leaveBalance.rtt.toFixed(2)}`],
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 30, halign: 'center' },
      },
    });
    
    doc.setFillColor(240, 240, 240);
    doc.circle(185, 270, 8, 'F');
    doc.setTextColor(30, 50, 140);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('P', 183, 272);
    doc.text('F', 187, 272);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('PayFit', 190, 270);
    
    doc.setFontSize(6);
    doc.text('Dans votre intérêt, et pour vous aider à faire valoir vos droits, conservez ce document sans limitation de durée.', 105, 280, { align: 'center' });
    doc.text('Pour la définition des termes employés, se reporter au site internet www.service-public.fr rubrique cotisations sociales', 105, 285, { align: 'center' });
    
    doc.save(`bulletin_de_paie_${salary.employeeName.replace(/\s+/g, '_')}_${new Date().toLocaleString('fr-FR', { month: 'numeric', year: 'numeric' })}.pdf`);
    
    toast.success(`Bulletin de paie de ${salary.employeeName} téléchargé avec succès`);
  };

  const handleExportHistory = () => {
    if (!selectedSalary) return;
    
    const historyData = selectedSalary.history.map((entry: any) => ({
      Date: entry.date,
      Montant: `${entry.amount} ${selectedSalary.currency}`,
      Raison: entry.reason,
      Détails: entry.details || '-'
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(historyData);
    XLSX.utils.book_append_sheet(wb, ws, "Historique Salaires");
    
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
