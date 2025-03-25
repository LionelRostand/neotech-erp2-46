
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, Edit, Trash2, FileText, Filter, Plus, Search, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { employees } from '@/data/employees';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Types
interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'expired' | 'terminated';
  salary: number;
  position: string;
  department: string;
  documents: string[];
}

// Sample contracts data
const initialContracts: Contract[] = [
  {
    id: 'CTR001',
    employeeId: 'EMP001',
    employeeName: 'Martin Dupont',
    type: 'CDI',
    startDate: '2020-05-15',
    endDate: null,
    status: 'active',
    salary: 45000,
    position: 'Développeur Frontend',
    department: 'IT',
    documents: ['Contrat signé', 'Fiche de poste']
  },
  {
    id: 'CTR002',
    employeeId: 'EMP002',
    employeeName: 'Lionel Djossa',
    type: 'CDI',
    startDate: '2019-03-10',
    endDate: null,
    status: 'active',
    salary: 65000,
    position: 'Directeur Technique',
    department: 'Direction',
    documents: ['Contrat signé', 'Accord de confidentialité']
  },
  {
    id: 'CTR003',
    employeeId: 'EMP003',
    employeeName: 'Sophie Martin',
    type: 'CDD',
    startDate: '2022-01-15',
    endDate: '2023-01-14',
    status: 'expired',
    salary: 38000,
    position: 'Chargée de Marketing',
    department: 'Marketing',
    documents: ['Contrat signé', 'Avenant prolongation']
  }
];

const EmployeesContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for editing or adding
  const [formData, setFormData] = useState<Partial<Contract>>({
    employeeId: '',
    type: 'CDI',
    startDate: '',
    endDate: '',
    salary: 0,
    position: '',
    department: '',
    documents: []
  });
  
  // Filter contracts based on search query
  const filteredContracts = contracts.filter(contract =>
    contract.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.position.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle viewing contract details
  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewDialogOpen(true);
  };
  
  // Handle editing contract
  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setFormData(contract);
    setIsEditDialogOpen(true);
  };
  
  // Handle deleting contract
  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) : value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle contract deletion confirmation
  const confirmDeleteContract = () => {
    if (selectedContract) {
      setContracts(contracts.filter(contract => contract.id !== selectedContract.id));
      toast.success(`Contrat de ${selectedContract.employeeName} supprimé avec succès`);
      setIsDeleteDialogOpen(false);
      setSelectedContract(null);
    }
  };
  
  // Handle contract update
  const handleUpdateContract = () => {
    if (selectedContract && formData) {
      // Validate required fields
      if (!formData.employeeId || !formData.type || !formData.startDate || !formData.salary) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
      
      // Find the employee
      const employee = employees.find(emp => emp.id === formData.employeeId);
      if (!employee) {
        toast.error("Employé non trouvé");
        return;
      }
      
      // Update the contract
      const updatedContract: Contract = {
        ...selectedContract,
        ...formData,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        status: formData.endDate && new Date(formData.endDate) < new Date() ? 'expired' : 'active'
      };
      
      setContracts(contracts.map(contract => 
        contract.id === selectedContract.id ? updatedContract : contract
      ));
      
      toast.success(`Contrat de ${updatedContract.employeeName} mis à jour avec succès`);
      setIsEditDialogOpen(false);
      setSelectedContract(null);
      setFormData({});
    }
  };
  
  // Handle adding a new contract
  const handleAddContract = () => {
    // Validate required fields
    if (!formData.employeeId || !formData.type || !formData.startDate || !formData.salary) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Find the employee
    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    // Create a new contract
    const newContract: Contract = {
      id: `CTR${contracts.length + 1}`.padStart(6, '0'),
      employeeId: formData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: formData.type || 'CDI',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || null,
      status: 'active',
      salary: formData.salary || 0,
      position: formData.position || employee.position,
      department: formData.department || employee.department,
      documents: formData.documents || []
    };
    
    setContracts([...contracts, newContract]);
    toast.success(`Contrat pour ${newContract.employeeName} ajouté avec succès`);
    setIsAddDialogOpen(false);
    setFormData({});
  };
  
  // Handle downloading contract as PDF
  const handleDownloadContract = (contract: Contract) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("CONTRAT DE TRAVAIL", 105, 20, { align: "center" });
    
    // Add contract type subheader
    doc.setFontSize(16);
    doc.text(`${contract.type}`, 105, 30, { align: "center" });
    
    // Add horizontal line
    doc.setDrawColor(44, 62, 80);
    doc.line(20, 35, 190, 35);
    
    // Add contract information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Company information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ENTRE LES SOUSSIGNÉS :", 20, 45);
    doc.setFont("helvetica", "normal");
    doc.text("La société Enterprise Solutions, représentée par M. Jean Directeur", 20, 55);
    doc.text("Siège social : 123 Avenue des Affaires, 75000 Paris", 20, 62);
    doc.text("SIRET : 123 456 789 00010", 20, 69);
    doc.text("Ci-après désignée « l'employeur »", 20, 76);
    
    // Employee information
    doc.setFont("helvetica", "bold");
    doc.text("ET :", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`M./Mme ${contract.employeeName}`, 20, 100);
    doc.text(`Demeurant à : [Adresse de l'employé]`, 20, 107);
    doc.text(`Ci-après désigné(e) « le salarié »`, 20, 114);
    
    // Contract details
    doc.setFont("helvetica", "bold");
    doc.text("IL A ÉTÉ CONVENU CE QUI SUIT :", 20, 130);
    doc.setFont("helvetica", "normal");
    
    // Article 1
    doc.setFont("helvetica", "bold");
    doc.text("Article 1 : Engagement", 20, 140);
    doc.setFont("helvetica", "normal");
    doc.text(`Le salarié est engagé en qualité de ${contract.position} au sein du département`, 20, 147);
    doc.text(`${contract.department}, à compter du ${new Date(contract.startDate).toLocaleDateString('fr-FR')}.`, 20, 154);
    
    if (contract.endDate) {
      doc.text(`Ce contrat est conclu pour une durée déterminée jusqu'au ${new Date(contract.endDate).toLocaleDateString('fr-FR')}.`, 20, 161);
    } else {
      doc.text("Ce contrat est conclu pour une durée indéterminée.", 20, 161);
    }
    
    // Article 2
    doc.setFont("helvetica", "bold");
    doc.text("Article 2 : Rémunération", 20, 175);
    doc.setFont("helvetica", "normal");
    doc.text(`Le salarié percevra une rémunération annuelle brute de ${contract.salary.toLocaleString('fr-FR')} euros,`, 20, 182);
    doc.text("versée sur 12 mois.", 20, 189);
    
    // Add signatures section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Fait à Paris, le " + new Date().toLocaleDateString('fr-FR'), 20, 240);
    
    doc.text("Signature de l'employeur", 40, 260);
    doc.text("Signature du salarié", 140, 260);
    doc.text("(Précédée de la mention « Lu et approuvé »)", 120, 267);
    
    // Add contract ID as footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Réf: ${contract.id}`, 185, 290, { align: "right" });
    
    // Save the PDF
    doc.save(`contrat-${contract.id}-${contract.employeeName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    toast.success("Contrat téléchargé avec succès");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Gestion des contrats</h2>
          <p className="text-gray-500">Gérez les contrats de travail des employés</p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button size="sm" onClick={() => {
            setFormData({
              employeeId: '',
              type: 'CDI',
              startDate: new Date().toISOString().split('T')[0],
              endDate: '',
              salary: 0,
              position: '',
              department: '',
              documents: []
            });
            setIsAddDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contrat
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher par employé, type, département..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-mono text-xs">{contract.id}</TableCell>
                  <TableCell className="font-medium">{contract.employeeName}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    {contract.endDate 
                      ? new Date(contract.endDate).toLocaleDateString('fr-FR') 
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contract.status === 'active' ? 'bg-green-100 text-green-800' :
                      contract.status === 'expired' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contract.status === 'active' ? 'Actif' :
                       contract.status === 'expired' ? 'Expiré' :
                       'Résilié'}
                    </span>
                  </TableCell>
                  <TableCell>{contract.position}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewContract(contract)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownloadContract(contract)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditContract(contract)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteContract(contract)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredContracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    Aucun contrat trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Contract Dialog */}
      {selectedContract && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Détails du contrat</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedContract.employeeName}</h3>
                  <p className="text-gray-500">{selectedContract.position}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedContract.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedContract.status === 'expired' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedContract.status === 'active' ? 'Actif' :
                   selectedContract.status === 'expired' ? 'Expiré' :
                   'Résilié'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">ID du contrat</p>
                  <p className="font-mono">{selectedContract.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Département</p>
                  <p>{selectedContract.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type de contrat</p>
                  <p>{selectedContract.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salaire annuel</p>
                  <p>{selectedContract.salary.toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de début</p>
                  <p>{new Date(selectedContract.startDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de fin</p>
                  <p>{selectedContract.endDate 
                      ? new Date(selectedContract.endDate).toLocaleDateString('fr-FR') 
                      : 'N/A'}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Documents associés</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {selectedContract.documents.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedContract.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-2">Aucun document associé</p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => handleDownloadContract(selectedContract)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger le contrat
              </Button>
              <Button onClick={() => handleEditContract(selectedContract)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Contract Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le contrat</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="employeeId" className="text-right text-sm font-medium">
                Employé
              </label>
              <div className="col-span-3">
                <Select 
                  value={formData.employeeId} 
                  onValueChange={(value) => handleSelectChange('employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type de contrat
              </label>
              <div className="col-span-3">
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Intérim">Intérim</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="position" className="text-right text-sm font-medium">
                Poste
              </label>
              <div className="col-span-3">
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-right text-sm font-medium">
                Département
              </label>
              <div className="col-span-3">
                <Input
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="salary" className="text-right text-sm font-medium">
                Salaire annuel
              </label>
              <div className="col-span-3">
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startDate" className="text-right text-sm font-medium">
                Date de début
              </label>
              <div className="col-span-3">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right text-sm font-medium">
                Date de fin
              </label>
              <div className="col-span-3">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  disabled={formData.type === 'CDI'}
                />
                {formData.type === 'CDI' && (
                  <p className="text-xs text-gray-500 mt-1">Non applicable pour un CDI</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateContract}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Contract Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouveau contrat</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="employeeId" className="text-right text-sm font-medium">
                Employé
              </label>
              <div className="col-span-3">
                <Select 
                  value={formData.employeeId} 
                  onValueChange={(value) => handleSelectChange('employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type de contrat
              </label>
              <div className="col-span-3">
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Intérim">Intérim</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="position" className="text-right text-sm font-medium">
                Poste
              </label>
              <div className="col-span-3">
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Développeur Frontend"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-right text-sm font-medium">
                Département
              </label>
              <div className="col-span-3">
                <Input
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: IT"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="salary" className="text-right text-sm font-medium">
                Salaire annuel
              </label>
              <div className="col-span-3">
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: 45000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startDate" className="text-right text-sm font-medium">
                Date de début
              </label>
              <div className="col-span-3">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right text-sm font-medium">
                Date de fin
              </label>
              <div className="col-span-3">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  disabled={formData.type === 'CDI'}
                />
                {formData.type === 'CDI' && (
                  <p className="text-xs text-gray-500 mt-1">Non applicable pour un CDI</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddContract}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer le contrat de {selectedContract?.employeeName} ?</p>
            <p className="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteContract}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les contrats</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Type de contrat
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Intérim">Intérim</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Statut
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                  <SelectItem value="terminated">Résilié</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Département
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Direction">Direction</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date début (min)
                </label>
                <Input type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date début (max)
                </label>
                <Input type="date" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline">
              Réinitialiser
            </Button>
            <Button>
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesContracts;
