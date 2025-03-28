
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
  FileText,
  Building,
  FileDown
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { employees } from '@/data/employees';

const MOCK_SALARIES = [
  { 
    id: 1, 
    name: 'John Doe', 
    position: 'Software Engineer', 
    salary: 75000, 
    paymentDate: '25/05/2023',
    department: 'Engineering',
    status: 'paid',
    leaves: { paid: 12, taken: 4, remaining: 8 },
    rtt: { allocated: 10, taken: 2, remaining: 8 },
    employeeId: "EMP001"
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    position: 'Project Manager', 
    salary: 90000, 
    paymentDate: '25/05/2023',
    department: 'Management',
    status: 'paid',
    leaves: { paid: 15, taken: 7, remaining: 8 },
    rtt: { allocated: 12, taken: 5, remaining: 7 },
    employeeId: "EMP002"
  },
  { 
    id: 3, 
    name: 'Emily Johnson', 
    position: 'Designer', 
    salary: 65000, 
    paymentDate: '25/05/2023',
    department: 'Design',
    status: 'paid',
    leaves: { paid: 10, taken: 3, remaining: 7 },
    rtt: { allocated: 8, taken: 3, remaining: 5 },
    employeeId: "EMP003"
  },
  { 
    id: 4, 
    name: 'Michael Brown', 
    position: 'Marketing Specialist', 
    salary: 68000, 
    paymentDate: '25/05/2023',
    department: 'Marketing',
    status: 'pending',
    leaves: { paid: 12, taken: 2, remaining: 10 },
    rtt: { allocated: 8, taken: 1, remaining: 7 },
    employeeId: ""
  },
  { 
    id: 5, 
    name: 'Sarah Wilson', 
    position: 'HR Manager', 
    salary: 82000, 
    paymentDate: '25/05/2023',
    department: 'Human Resources',
    status: 'paid',
    leaves: { paid: 15, taken: 10, remaining: 5 },
    rtt: { allocated: 10, taken: 6, remaining: 4 },
    employeeId: ""
  }
];

const MOCK_HISTORY = [
  { id: 1, employeeId: 1, date: '25/04/2023', amount: 74000, reason: 'Annual salary' },
  { id: 2, employeeId: 1, date: '25/03/2023', amount: 74000, reason: 'Annual salary' },
  { id: 3, employeeId: 1, date: '25/02/2023', amount: 74000, reason: 'Annual salary' },
  { id: 4, employeeId: 2, date: '25/04/2023', amount: 88000, reason: 'Annual salary' },
  { id: 5, employeeId: 2, date: '25/03/2023', amount: 88000, reason: 'Annual salary' },
  { id: 6, employeeId: 3, date: '25/04/2023', amount: 65000, reason: 'Annual salary' },
];

const COMPANY_INFO = {
  name: "STORM GROUP",
  tagline: "Enterprise Solutions",
  address: "123 Business Street, 75000 Paris",
  siret: "SIRET: 123 456 789 00012",
  phone: "+33 1 23 45 67 89",
  email: "contact@stormgroup.com",
  website: "www.stormgroup.com",
  logo: "logo_placeholder.png", // Placeholder pour le logo
};

const EmployeesSalaries = () => {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewSalaryDialog, setShowNewSalaryDialog] = useState(false);
  const [filteredSalaries, setFilteredSalaries] = useState(MOCK_SALARIES);
  const [editForm, setEditForm] = useState({
    salary: '',
    position: '',
    department: '',
  });
  const [newSalaryForm, setNewSalaryForm] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    employeeId: '',
  });
  
  const getEmployeeDetails = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };
  
  React.useEffect(() => {
    const results = MOCK_SALARIES.filter(employee => 
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSalaries(results);
  }, [search]);
  
  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setEditForm({
      salary: employee.salary.toString(),
      position: employee.position,
      department: employee.department,
    });
    setShowEditDialog(true);
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Informations mises à jour avec succès",
      description: "Les modifications ont été enregistrées."
    });
    setShowEditDialog(false);
  };
  
  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setShowDetailsDialog(true);
  };
  
  const handleViewHistory = (employee: any) => {
    setSelectedEmployee(employee);
    setShowHistoryDialog(true);
  };
  
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalaries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salaires");
    XLSX.writeFile(workbook, "salaires.xlsx");
    toast({
      title: "Exportation réussie",
      description: "Les données ont été exportées en Excel avec succès"
    });
  };
  
  const handleCreateSalary = () => {
    if (!newSalaryForm.employeeId && !newSalaryForm.name) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un employé ou saisir un nom",
        variant: "destructive"
      });
      return;
    }
    
    if (!newSalaryForm.salary) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un salaire",
        variant: "destructive"
      });
      return;
    }
    
    const selectedEmployeeDetails = newSalaryForm.employeeId 
      ? employees.find(emp => emp.id === newSalaryForm.employeeId) 
      : null;
      
    const employeeName = selectedEmployeeDetails 
      ? `${selectedEmployeeDetails.firstName} ${selectedEmployeeDetails.lastName}`
      : newSalaryForm.name;
      
    const employeePosition = selectedEmployeeDetails
      ? selectedEmployeeDetails.position
      : newSalaryForm.position;
      
    const employeeDepartment = selectedEmployeeDetails
      ? selectedEmployeeDetails.department
      : newSalaryForm.department;
    
    const newSalary = {
      id: MOCK_SALARIES.length + 1,
      name: employeeName,
      position: employeePosition,
      department: employeeDepartment,
      salary: parseFloat(newSalaryForm.salary),
      paymentDate: newSalaryForm.paymentDate,
      status: newSalaryForm.status,
      leaves: { paid: 12, taken: 0, remaining: 12 },
      rtt: { allocated: 10, taken: 0, remaining: 10 },
      employeeId: newSalaryForm.employeeId
    };
    
    setFilteredSalaries([newSalary, ...filteredSalaries]);
    toast({
      title: "Nouvelle fiche de paie créée",
      description: "La fiche de paie a été créée avec succès"
    });
    setShowNewSalaryDialog(false);
    
    setNewSalaryForm({
      name: '',
      position: '',
      department: '',
      salary: '',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      employeeId: '',
    });
  };
  
  const handleEmployeeSelection = (employeeId: string) => {
    setNewSalaryForm({
      ...newSalaryForm,
      employeeId,
      name: '',
    });
  };
  
  // Fonction améliorée pour générer un bulletin de paie PDF complet
  const generatePayStubPDF = (employee: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    
    // Ajout du logo et en-tête de l'entreprise
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 15, 180, 25, 'F');
    
    // Logo (simulé par un rectangle coloré)
    doc.setFillColor(60, 80, 180);
    doc.rect(20, 17, 20, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("LOGO", 30, 30, { align: "center" });
    
    // Nom de l'entreprise
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.text(COMPANY_INFO.name, 50, 25);
    
    // Coordonnées de l'entreprise
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(COMPANY_INFO.tagline, 50, 30);
    doc.text(COMPANY_INFO.address, 50, 34);
    doc.text(COMPANY_INFO.siret, 50, 38);
    
    // Informations de contact
    doc.text(COMPANY_INFO.phone, 160, 25);
    doc.text(COMPANY_INFO.email, 160, 30);
    doc.text(COMPANY_INFO.website, 160, 35);
    
    // Titre du document
    doc.setFillColor(230, 230, 230);
    doc.rect(15, 45, 180, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("BULLETIN DE PAIE", 105, 52, { align: "center" });
    
    // Période et informations du document
    doc.setFontSize(10);
    doc.text(`Période: ${employee.paymentDate}`, 15, 63);
    doc.text(`N° Bulletin: BP-${employee.id.toString().padStart(5, '0')}`, 160, 63);
    
    // Informations employé
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 68, 180, 35, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("INFORMATIONS EMPLOYÉ", 105, 75, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    // Colonne gauche
    doc.text("Nom et prénom:", 20, 82);
    doc.text("Poste:", 20, 88);
    doc.text("Département:", 20, 94);
    doc.text("ID Employé:", 20, 100);
    
    // Colonne droite
    doc.setTextColor(40, 40, 40);
    doc.text(employee.name, 70, 82);
    doc.text(employee.position, 70, 88);
    doc.text(employee.department, 70, 94);
    doc.text(employee.employeeId || `EMP${employee.id.toString().padStart(3, '0')}`, 70, 100);
    
    // Détail de la rémunération
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 110, 180, 80, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("DÉTAIL DE LA RÉMUNÉRATION", 105, 118, { align: "center" });
    
    // Tableau rémunération
    doc.autoTable({
      startY: 125,
      head: [['Description', 'Base', 'Taux', 'Montant']],
      body: [
        ['Salaire Brut Annuel', '-', '-', `${employee.salary.toLocaleString('fr-FR')} €`],
        ['Salaire Mensuel Brut', '-', '-', `${(employee.salary / 12).toLocaleString('fr-FR')} €`],
        ['Heures supplémentaires', '0', '25%', '0.00 €'],
        ['Prime d\'ancienneté', '-', '-', '0.00 €'],
        ['Prime de performance', '-', '-', '0.00 €'],
        ['Avantages en nature', '-', '-', '0.00 €'],
        ['Cotisations sociales', `${(employee.salary / 12).toLocaleString('fr-FR')} €`, '25%', `${((employee.salary / 12) * 0.25).toLocaleString('fr-FR')} €`],
        ['Salaire Net Mensuel', '-', '-', `${((employee.salary / 12) * 0.75).toLocaleString('fr-FR')} €`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
      margin: { left: 15, right: 15 },
    });
    
    // Section congés et RTT
    const finalY = (doc as any).autoTable.previous.finalY + 10;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(15, finalY, 180, 50, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("SUIVI DES CONGÉS ET RTT", 105, finalY + 8, { align: "center" });
    
    // Tableau congés et RTT
    doc.autoTable({
      startY: finalY + 15,
      head: [['Type', 'Droits acquis', 'Pris', 'Restants']],
      body: [
        ['Congés Payés', `${employee.leaves.paid} jours`, `${employee.leaves.taken} jours`, `${employee.leaves.remaining} jours`],
        ['RTT', `${employee.rtt.allocated} jours`, `${employee.rtt.taken} jours`, `${employee.rtt.remaining} jours`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
      margin: { left: 15, right: 15 },
    });
    
    // Pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Ce document est strictement confidentiel. Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 287, { align: "center" });
        doc.text(`Page ${i} / ${pageCount}`, 195, 287, { align: "right" });
        doc.text(`${COMPANY_INFO.name}`, 15, 287);
    }
    
    // Enregistrement du PDF
    doc.save(`bulletin_paie_${employee.name.replace(/\s+/g, '_')}_${employee.paymentDate.replace(/\//g, '-')}.pdf`);
    
    toast({
      title: "Bulletin de paie généré",
      description: `Le bulletin de paie de ${employee.name} a été téléchargé`
    });
  };

  // Fonction pour générer un contrat de travail en PDF
  const generateEmploymentContract = (employee: any) => {
    const doc = new jsPDF();
    
    // En-tête avec logo
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 15, 180, 25, 'F');
    
    // Logo (simulé)
    doc.setFillColor(60, 80, 180);
    doc.rect(20, 17, 20, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("LOGO", 30, 30, { align: "center" });
    
    // Informations de l'entreprise
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.text(COMPANY_INFO.name, 50, 25);
    
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(COMPANY_INFO.tagline, 50, 30);
    doc.text(COMPANY_INFO.address, 50, 34);
    doc.text(COMPANY_INFO.siret, 50, 38);
    
    // Titre du document
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE", 105, 60, { align: "center" });
    
    // Partie 1: Parties contractantes
    doc.setFontSize(12);
    doc.text("ENTRE LES SOUSSIGNÉS:", 15, 75);
    
    doc.setFontSize(10);
    doc.text(`${COMPANY_INFO.name}, ${COMPANY_INFO.address}`, 20, 85);
    doc.text(`Représentée par M. Jean DIRECTEUR, en qualité de Directeur Général`, 20, 90);
    doc.text(`Ci-après désignée "l'Employeur" ou "la Société", d'une part,`, 20, 95);
    
    doc.text("ET", 15, 105);
    
    doc.text(`${employee.name}, demeurant à [Adresse de l'employé]`, 20, 115);
    doc.text(`Numéro de sécurité sociale: _______________________`, 20, 120);
    doc.text(`Ci-après désigné(e) "le Salarié", d'autre part,`, 20, 125);
    
    doc.text("IL A ÉTÉ CONVENU CE QUI SUIT:", 15, 135);
    
    // Partie 2: Engagement
    doc.setFontSize(11);
    doc.text("Article 1 - Engagement", 15, 145);
    doc.setFontSize(10);
    doc.text(`La société ${COMPANY_INFO.name} engage ${employee.name} à compter du [Date de début de contrat] en qualité de ${employee.position}, statut cadre, coefficient ___, niveau ___, sous réserve des résultats de la visite médicale d'embauche.`, 20, 155, { maxWidth: 170, align: 'justify' });
    
    // Partie 3: Période d'essai
    doc.setFontSize(11);
    doc.text("Article 2 - Période d'essai", 15, 170);
    doc.setFontSize(10);
    doc.text(`Le présent contrat est conclu pour une période d'essai de 3 mois, qui s'achèvera le [Date de fin de période d'essai]. Durant cette période, chacune des parties pourra rompre le contrat sans indemnité, en respectant un préavis conformément aux dispositions légales et conventionnelles en vigueur.`, 20, 180, { maxWidth: 170, align: 'justify' });
    
    // Partie 4: Fonctions
    doc.setFontSize(11);
    doc.text("Article 3 - Fonctions", 15, 200);
    doc.setFontSize(10);
    doc.text(`Le Salarié exercera les fonctions de ${employee.position} au sein du département ${employee.department}. À ce titre, il/elle aura notamment pour missions et responsabilités : [Détail des missions et responsabilités].`, 20, 210, { maxWidth: 170, align: 'justify' });
    
    // Nouvelle page
    doc.addPage();
    
    // Partie 5: Rémunération
    doc.setFontSize(11);
    doc.text("Article 4 - Rémunération", 15, 25);
    doc.setFontSize(10);
    doc.text(`En contrepartie de son travail, le Salarié percevra une rémunération annuelle brute de ${employee.salary.toLocaleString('fr-FR')} euros, versée sur 12 mois, soit un salaire mensuel brut de ${(employee.salary / 12).toLocaleString('fr-FR')} euros.`, 20, 35, { maxWidth: 170, align: 'justify' });
    
    // Partie 6: Durée du travail
    doc.setFontSize(11);
    doc.text("Article 5 - Durée du travail", 15, 55);
    doc.setFontSize(10);
    doc.text(`La durée du travail du Salarié est fixée à 35 heures par semaine. Le Salarié pourra être amené à effectuer des heures supplémentaires en fonction des nécessités du service, qui seront rémunérées conformément aux dispositions légales et conventionnelles en vigueur.`, 20, 65, { maxWidth: 170, align: 'justify' });
    
    // Partie 7: Congés payés
    doc.setFontSize(11);
    doc.text("Article 6 - Congés payés", 15, 85);
    doc.setFontSize(10);
    doc.text(`Le Salarié bénéficiera de congés payés dans les conditions fixées par les dispositions légales et conventionnelles, soit 25 jours ouvrés par an pour un temps plein. Le Salarié bénéficiera également de ${employee.rtt.allocated} jours de RTT par an.`, 20, 95, { maxWidth: 170, align: 'justify' });
    
    // Partie 8: Confidentialité
    doc.setFontSize(11);
    doc.text("Article 7 - Confidentialité", 15, 115);
    doc.setFontSize(10);
    doc.text(`Le Salarié s'engage à respecter la plus stricte confidentialité concernant l'ensemble des documents, informations et méthodes dont il pourrait avoir connaissance dans le cadre de ses fonctions, pendant toute la durée du contrat et après sa cessation, quelle qu'en soit la cause.`, 20, 125, { maxWidth: 170, align: 'justify' });
    
    // Partie 9: Convention collective
    doc.setFontSize(11);
    doc.text("Article 8 - Convention collective", 15, 145);
    doc.setFontSize(10);
    doc.text(`Le présent contrat est régi par la Convention Collective Nationale applicable à la société : [Nom de la convention collective]. Une copie de cette convention est à la disposition du Salarié au sein des locaux de l'entreprise.`, 20, 155, { maxWidth: 170, align: 'justify' });
    
    // Partie 10: Signatures
    doc.setFontSize(11);
    doc.text("Fait en deux exemplaires originaux", 15, 185);
    doc.text(`À Paris, le ${new Date().toLocaleDateString('fr-FR')}`, 15, 195);
    
    doc.text("Pour la société", 40, 215);
    doc.text("M. Jean DIRECTEUR", 40, 225);
    doc.text("Le Salarié", 145, 215);
    doc.text(`${employee.name}`, 145, 225);
    doc.text("(Signature précédée de la mention", 30, 235);
    doc.text("\"Lu et approuvé\")", 45, 242);
    
    // Pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Document confidentiel - ${COMPANY_INFO.name}`, 105, 287, { align: "center" });
        doc.text(`Page ${i} / ${pageCount}`, 195, 287, { align: "right" });
    }
    
    // Enregistrement du PDF
    doc.save(`contrat_travail_${employee.name.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "Contrat généré",
      description: `Le contrat de travail de ${employee.name} a été téléchargé`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Gestion des salaires</h2>
              <p className="text-muted-foreground">Gérez et suivez les salaires des employés</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Exporter Excel
              </Button>
              <Button onClick={() => setShowNewSalaryDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </div>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, poste, département..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead className="text-right">Salaire Annuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalaries.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">#{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-right">{employee.salary.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>
                      <Badge 
                        variant={employee.status === 'paid' ? 'default' : 'outline'}
                        className={employee.status === 'paid' ? 'bg-green-500' : ''}
                      >
                        {employee.status === 'paid' ? 'Payé' : 'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDetails(employee)}
                          title="Voir les détails"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewHistory(employee)}
                          title="Historique des salaires"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(employee)}
                          title="Modifier"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => generatePayStubPDF(employee)}
                          title="Télécharger bulletin de paie"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => generateEmploymentContract(employee)}
                          title="Télécharger contrat"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du salaire</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Employé</Label>
                  <p className="font-medium">{selectedEmployee.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">ID</Label>
                  <p className="font-medium">#{selectedEmployee.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Poste</Label>
                  <p className="font-medium">{selectedEmployee.position}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Département</Label>
                  <p className="font-medium">{selectedEmployee.department}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Salaire Annuel</Label>
                  <p className="font-medium">{selectedEmployee.salary.toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Salaire Mensuel</Label>
                  <p className="font-medium">{(selectedEmployee.salary / 12).toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Dernière paie</Label>
                  <p className="font-medium">{selectedEmployee.paymentDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Statut</Label>
                  <Badge 
                    variant={selectedEmployee.status === 'paid' ? 'default' : 'outline'}
                    className={selectedEmployee.status === 'paid' ? 'bg-green-500' : ''}
                  >
                    {selectedEmployee.status === 'paid' ? 'Payé' : 'En attente'}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Détail des congés et RTT</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Congés payés acquis</Label>
                    <p className="font-medium">{selectedEmployee.leaves.paid} jours</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Congés payés pris</Label>
                    <p className="font-medium">{selectedEmployee.leaves.taken} jours</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Congés payés restants</Label>
                    <p className="font-medium">{selectedEmployee.leaves.remaining} jours</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">RTT alloués</Label>
                    <p className="font-medium">{selectedEmployee.rtt.allocated} jours</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">RTT pris</Label>
                    <p className="font-medium">{selectedEmployee.rtt.taken} jours</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">RTT restants</Label>
                    <p className="font-medium">{selectedEmployee.rtt.remaining} jours</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Historique des salaires</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-medium">{selectedEmployee.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedEmployee.position}</p>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Raison</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_HISTORY
                      .filter(h => h.employeeId === selectedEmployee.id)
                      .map((history) => (
                        <TableRow key={history.id}>
                          <TableCell>{history.date}</TableCell>
                          <TableCell>{history.amount.toLocaleString('fr-FR')} €</TableCell>
                          <TableCell>{history.reason}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier les informations salariales</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employé</Label>
                <div className="font-medium">{selectedEmployee.name}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Input
                  id="position"
                  value={editForm.position}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salaire annuel (€)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={editForm.salary}
                  onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                />
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm text-muted-foreground">Congés et RTT</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <Label htmlFor="leaves-paid" className="text-xs">Acquis</Label>
                    <Input
                      id="leaves-paid"
                      type="number"
                      value={selectedEmployee.leaves.paid}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaves-taken" className="text-xs">Pris</Label>
                    <Input
                      id="leaves-taken"
                      type="number"
                      value={selectedEmployee.leaves.taken}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaves-remaining" className="text-xs">Restants</Label>
                    <Input
                      id="leaves-remaining"
                      type="number"
                      value={selectedEmployee.leaves.remaining}
                      className="h-8"
                      disabled
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <Label className="text-sm text-muted-foreground">RTT</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div>
                      <Label htmlFor="rtt-allocated" className="text-xs">Alloués</Label>
                      <Input
                        id="rtt-allocated"
                        type="number"
                        value={selectedEmployee.rtt.allocated}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rtt-taken" className="text-xs">Pris</Label>
                      <Input
                        id="rtt-taken"
                        type="number"
                        value={selectedEmployee.rtt.taken}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rtt-remaining" className="text-xs">Restants</Label>
                      <Input
                        id="rtt-remaining"
                        type="number"
                        value={selectedEmployee.rtt.remaining}
                        className="h-8"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveChanges}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showNewSalaryDialog} onOpenChange={setShowNewSalaryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouvelle fiche de paie</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee-select">Sélectionnez un employé</Label>
              <Select
                value={newSalaryForm.employeeId || ""}
                onValueChange={handleEmployeeSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {!newSalaryForm.employeeId && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'employé</Label>
                  <Input
                    id="name"
                    value={newSalaryForm.name}
                    onChange={(e) => setNewSalaryForm({ ...newSalaryForm, name: e.target.value })}
                    placeholder="Nom complet"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input
                    id="position"
                    value={newSalaryForm.position}
                    onChange={(e) => setNewSalaryForm({ ...newSalaryForm, position: e.target.value })}
                    placeholder="Poste occupé"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={newSalaryForm.department}
                    onChange={(e) => setNewSalaryForm({ ...newSalaryForm, department: e.target.value })}
                    placeholder="Département"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salaire annuel (€)</Label>
              <Input
                id="salary"
                type="number"
                value={newSalaryForm.salary}
                onChange={(e) => setNewSalaryForm({ ...newSalaryForm, salary: e.target.value })}
                placeholder="Ex: 45000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date de paiement</Label>
              <Input
                id="paymentDate"
                type="date"
                value={newSalaryForm.paymentDate}
                onChange={(e) => setNewSalaryForm({ ...newSalaryForm, paymentDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={newSalaryForm.status}
                onValueChange={(value) => setNewSalaryForm({ ...newSalaryForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSalaryDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateSalary}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesSalaries;
