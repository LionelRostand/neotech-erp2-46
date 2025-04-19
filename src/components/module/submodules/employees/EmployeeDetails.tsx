
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import EmployeeProfileHeader from './EmployeeProfileHeader';
import InformationsTab from './tabs/InformationsTab';
import DocumentsTab from './tabs/DocumentsTab';
import CompetencesTab from './tabs/CompetencesTab';
import HorairesTab from './tabs/HorairesTab';
import CongesTab from './tabs/CongesTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface EmployeeDetailsProps {
  employee: Employee;
  onExportPdf: () => void;
  onEdit: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ 
  employee, 
  onExportPdf,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState('infos');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee>(employee);
  
  const handleEditTab = () => {
    if (activeTab === 'infos') {
      onEdit();
    } else {
      // Activer le mode édition pour l'onglet actif
      setIsEditing(true);
      toast.info(`Mode édition activé pour l'onglet ${getTabName(activeTab)}`);
    }
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    toast.success(`Modifications enregistrées pour l'onglet ${getTabName(activeTab)}`);
  };

  const getTabName = (tabId: string): string => {
    switch (tabId) {
      case 'infos': return 'Informations';
      case 'documents': return 'Documents';
      case 'competences': return 'Compétences';
      case 'horaires': return 'Horaires';
      case 'conges': return 'Congés';
      case 'evaluations': return 'Évaluations';
      default: return tabId;
    }
  };

  const handleEmployeeUpdate = (updatedEmp: Employee) => {
    console.log('Employee updated:', updatedEmp);
    setUpdatedEmployee(updatedEmp);
  };

  const handleExportPdf = () => {
    // Create PDF document
    const doc = new jsPDF();
    
    // Add company logo on left side (placeholder for now)
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, 15, 50, 25, 3, 3, 'FD');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("LOGO", 40, 30, { align: "center" });
    
    // Add company information on right side
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Enterprise Solutions", 140, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123 Avenue des Affaires", 140, 26, { align: "center" });
    doc.text("75000 Paris, France", 140, 32, { align: "center" });
    doc.text("contact@enterprise-solutions.fr", 140, 38, { align: "center" });
    
    // Add horizontal separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 50, 195, 50);
    
    // Document title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(`FICHE EMPLOYÉ`, 105, 65, { align: "center" });
    
    // Employee information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Informations personnelles", 20, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const personalInfo = [
      [`Nom: ${updatedEmployee.lastName}`, `Prénom: ${updatedEmployee.firstName}`],
      [`Email: ${updatedEmployee.email}`, `Téléphone: ${updatedEmployee.phone || "Non renseigné"}`],
      // Use optional chaining to safely access education
      [`Date de naissance: ${updatedEmployee.birthDate || "Non renseignée"}`, `Adresse: ${
        typeof updatedEmployee.address === 'object' 
          ? `${updatedEmployee.address.street}, ${updatedEmployee.address.city}` 
          : updatedEmployee.address || "Non renseignée"
      }`]
    ];
    
    let yPos = 90;
    personalInfo.forEach(row => {
      doc.text(row[0], 25, yPos);
      doc.text(row[1], 120, yPos);
      yPos += 10;
    });
    
    // Professional information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Informations professionnelles", 20, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const professionalInfo = [
      [`Poste: ${updatedEmployee.position}`, `Département: ${updatedEmployee.department}`],
      [`Date d'embauche: ${updatedEmployee.hireDate}`, `Manager: ${updatedEmployee.manager || "Aucun"}`],
      // Fixed: Using contract instead of contractType
      [`Type de contrat: ${updatedEmployee.contract || "Non spécifié"}`, `Statut: ${updatedEmployee.status || "Actif"}`]
    ];
    
    yPos += 20;
    professionalInfo.forEach(row => {
      doc.text(row[0], 25, yPos);
      doc.text(row[1], 120, yPos);
      yPos += 10;
    });
    
    // Save PDF
    doc.save(`fiche-employe-${updatedEmployee.firstName.toLowerCase()}-${updatedEmployee.lastName.toLowerCase()}.pdf`);
    toast.success("Document PDF exporté avec succès");
    
    // Also call the parent onExportPdf to manage any UI updates
    onExportPdf();
  };

  return (
    <div className="space-y-6">
      <EmployeeProfileHeader 
        employee={updatedEmployee} 
        onEmployeeUpdate={handleEmployeeUpdate}
      />

      <Tabs defaultValue="infos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-6 mb-6">
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="infos">
          <InformationsTab 
            employee={updatedEmployee}
            onEmployeeUpdated={handleEmployeeUpdate}
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab 
            employee={updatedEmployee}
            onEmployeeUpdated={handleEmployeeUpdate}
          />
        </TabsContent>
        
        <TabsContent value="competences">
          <CompetencesTab 
            employee={updatedEmployee}
            onEmployeeUpdated={handleEmployeeUpdate}
            isEditing={isEditing && activeTab === 'competences'}
            onFinishEditing={handleFinishEditing}
          />
        </TabsContent>
        
        <TabsContent value="horaires">
          <HorairesTab 
            employee={updatedEmployee}
          />
        </TabsContent>
        
        <TabsContent value="conges">
          <CongesTab 
            employee={updatedEmployee}
          />
        </TabsContent>
        
        <TabsContent value="evaluations">
          <EvaluationsTab 
            employee={updatedEmployee}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={handleExportPdf}>Exporter PDF</Button>
        <Button variant={isEditing ? "default" : "outline"} onClick={isEditing ? handleFinishEditing : handleEditTab}>
          {isEditing ? "Terminer" : "Modifier"}
        </Button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
