
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { GraduationCap } from 'lucide-react';
import { Employee } from '@/types/employee';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const education = employee.education || [];
  
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" value={employee.firstName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" value={employee.lastName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={employee.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={employee.phone} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={employee.address} readOnly />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input id="department" value={employee.department} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input id="position" value={employee.position} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Responsable</Label>
              <Input id="manager" value={employee.manager || "N/A"} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract">Type de contrat</Label>
              <Input id="contract" value={employee.contract} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">Date d'embauche</Label>
              <Input id="hireDate" value={employee.hireDate} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Input id="status" value={employee.status} readOnly />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Formation</h3>
          <div className="space-y-4">
            {education.length > 0 ? (
              education.map((edu, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <GraduationCap className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.school}, {edu.year}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucune formation renseignée</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
