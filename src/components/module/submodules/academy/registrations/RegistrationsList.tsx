
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for registrations
const registrations = [
  {
    id: '1',
    studentName: 'Kamga Jean Paul',
    class: '3ème',
    registrationDate: '2024-08-10',
    status: 'complete',
    documentsComplete: true
  },
  {
    id: '2',
    studentName: 'Nguefack Marie',
    class: '1ère',
    registrationDate: '2024-08-11',
    status: 'pending',
    documentsComplete: false
  },
  {
    id: '3',
    studentName: 'Mbarga Alain',
    class: 'Terminale',
    registrationDate: '2024-08-09',
    status: 'complete',
    documentsComplete: true
  },
  {
    id: '4',
    studentName: 'Essomba Claire',
    class: '5ème',
    registrationDate: '2024-08-12',
    status: 'pending',
    documentsComplete: true
  },
  {
    id: '5',
    studentName: 'Fotso Michel',
    class: '2nde',
    registrationDate: '2024-08-10',
    status: 'complete',
    documentsComplete: true
  },
];

const RegistrationsList = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input placeholder="Rechercher un élève..." className="max-w-sm" />
        </div>
        
        <div className="flex gap-2 items-center">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="complete">Complété</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              <SelectItem value="6eme">6ème</SelectItem>
              <SelectItem value="5eme">5ème</SelectItem>
              <SelectItem value="4eme">4ème</SelectItem>
              <SelectItem value="3eme">3ème</SelectItem>
              <SelectItem value="2nde">2nde</SelectItem>
              <SelectItem value="1ere">1ère</SelectItem>
              <SelectItem value="terminale">Terminale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de l'élève</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">{registration.studentName}</TableCell>
                <TableCell>{registration.class}</TableCell>
                <TableCell>{new Date(registration.registrationDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <Badge variant={registration.status === 'complete' ? 'success' : 'outline'}>
                    {registration.status === 'complete' ? 'Complétée' : 'En attente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={registration.documentsComplete ? 'success' : 'destructive'}>
                    {registration.documentsComplete ? 'Complets' : 'Incomplets'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage de 5 inscriptions sur 5
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Précédent
          </Button>
          <Button variant="outline" size="sm" disabled>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsList;
