
import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

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
    history: [
      { date: "05/01/2025", amount: 5200, reason: "Salaire mensuel" },
      { date: "05/12/2024", amount: 5200, reason: "Salaire mensuel" },
      { date: "05/11/2024", amount: 5000, reason: "Salaire mensuel" },
      { date: "01/11/2024", amount: 5000, reason: "Augmentation salariale", details: "Promotion" }
    ]
  }
];

const EmployeesSalaries: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [salaries, setSalaries] = useState(MOCK_SALARIES);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    baseSalary: 0,
    paymentMethod: '',
    notes: ''
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
      notes: ''
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
          history: updatedHistory
        };
      }
      return salary;
    });

    setSalaries(updatedSalaries);
    toast.success("Informations salariales mises à jour avec succès");
    setIsEditDialogOpen(false);
  };

  const handleExportPayslip = (salary: any) => {
    toast.success(`Bulletin de paie de ${salary.employeeName} téléchargé`);
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
        <Button>
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
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
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
              <Button onClick={() => {
                handleExportPayslip(selectedSalary);
                setIsHistoryDialogOpen(false);
              }}>Exporter l'historique</Button>
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
    </div>
  );
};

export default EmployeesSalaries;
