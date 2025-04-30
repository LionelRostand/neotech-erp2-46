
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getStatusDisplay } from './utils/employeeUtils';

// Import placeholder components for the tabs
const InformationsTab = ({ employee }: { employee: Employee }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><span className="font-medium">Nom:</span> {employee.lastName}</div>
      <div><span className="font-medium">Prénom:</span> {employee.firstName}</div>
      <div><span className="font-medium">Email:</span> {employee.email}</div>
      <div><span className="font-medium">Téléphone:</span> {employee.phone || 'Non spécifié'}</div>
      <div><span className="font-medium">Date de naissance:</span> {employee.birthDate || 'Non spécifiée'}</div>
    </div>
    
    <h3 className="text-lg font-medium mt-6 mb-4">Informations professionnelles</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><span className="font-medium">Poste:</span> {employee.position || 'Non spécifié'}</div>
      <div><span className="font-medium">Email professionnel:</span> {employee.professionalEmail || 'Non spécifié'}</div>
      <div><span className="font-medium">Département:</span> {employee.departmentName || employee.department || 'Non spécifié'}</div>
      <div><span className="font-medium">Date d'embauche:</span> {employee.hireDate || 'Non spécifiée'}</div>
      <div><span className="font-medium">Type de contrat:</span> {employee.contract?.toUpperCase() || 'Non spécifié'}</div>
    </div>
  </div>
);

const DocumentsTab = ({ employee }: { employee: Employee }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Documents</h3>
    {employee.documents && employee.documents.length > 0 ? (
      <ul className="space-y-2">
        {employee.documents.map((doc, index) => (
          <li key={index} className="p-3 border rounded-md">
            {doc.title} - {doc.type}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">Aucun document disponible</p>
    )}
  </div>
);

const PresencesTab = ({ employee }: { employee: Employee }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Registre des présences</h3>
    <p className="text-gray-500">Aucune donnée de présence disponible</p>
  </div>
);

const CongesTab = ({ employee }: { employee: Employee }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Congés</h3>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="text-xl font-bold text-green-700">12 jours</div>
        <div className="text-sm text-green-600">Congés payés disponibles</div>
      </div>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="text-xl font-bold text-blue-700">3 jours</div>
        <div className="text-sm text-blue-600">RTT disponibles</div>
      </div>
    </div>
    <h4 className="font-medium mb-2">Historique des congés</h4>
    <p className="text-gray-500">Aucun congé pris cette année</p>
  </div>
);

const CompetencesTab = ({ employee }: { employee: Employee }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Compétences</h3>
    {employee.skills && employee.skills.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {employee.skills.map((skill, index) => (
          <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
            {typeof skill === 'string' ? skill : skill.name}
          </Badge>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">Aucune compétence enregistrée</p>
    )}
  </div>
);

const EvaluationsTab = ({ employee }: { employee: Employee }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Évaluations</h3>
    {employee.evaluations && employee.evaluations.length > 0 ? (
      <ul className="space-y-4">
        {employee.evaluations.map((eval, index) => (
          <li key={index} className="p-4 border rounded-md">
            <div className="font-medium">{eval.type} - {eval.date}</div>
            <div>Score: {eval.score}/5</div>
            <div className="text-sm text-gray-600 mt-2">{eval.comments}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">Aucune évaluation disponible</p>
    )}
  </div>
);

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  const [activeTab, setActiveTab] = useState("informations");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Avatar className="h-16 w-16 border">
            {employee.photoURL || employee.photo ? (
              <AvatarImage
                src={employee.photoURL || employee.photo}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{employee.firstName} {employee.lastName}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>{employee.position || 'Poste non spécifié'}</span>
              {employee.department && <span>• {employee.departmentName || employee.department}</span>}
              <div className="ml-auto">
                <Badge variant="outline" className={`${employee.status === 'active' || employee.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {getStatusDisplay(employee.status)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full overflow-x-auto flex">
            <TabsTrigger value="informations" className="flex-1">Informations</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="presences" className="flex-1">Présences</TabsTrigger>
            <TabsTrigger value="conges" className="flex-1">Congés</TabsTrigger>
            <TabsTrigger value="competences" className="flex-1">Compétences</TabsTrigger>
            <TabsTrigger value="evaluations" className="flex-1">Évaluations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations" className="pt-4">
            <InformationsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="documents" className="pt-4">
            <DocumentsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="presences" className="pt-4">
            <PresencesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="conges" className="pt-4">
            <CongesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="competences" className="pt-4">
            <CompetencesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="evaluations" className="pt-4">
            <EvaluationsTab employee={employee} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
