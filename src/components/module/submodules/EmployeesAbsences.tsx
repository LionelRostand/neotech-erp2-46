
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle } from 'lucide-react';

const EmployeesAbsences: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample absences data - employees who haven't validated their presence
  const absentEmployees = [
    { id: 1, name: 'Thomas Martin', department: 'Marketing', lastPresence: '2025-03-10', status: 'Non validé' },
    { id: 2, name: 'Sophie Dubois', department: 'Développement', lastPresence: '2025-03-12', status: 'Non validé' },
    { id: 3, name: 'Jean Dupont', department: 'Finance', lastPresence: '2025-03-08', status: 'Non validé' },
    { id: 4, name: 'Marie Lambert', department: 'Ressources Humaines', lastPresence: '2025-03-11', status: 'Non validé' },
    { id: 5, name: 'Pierre Durand', department: 'Développement', lastPresence: '2025-03-09', status: 'Non validé' },
  ];
  
  // Filter employees based on search query
  const filteredEmployees = absentEmployees.filter(
    employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Employés sans validation de présence</CardTitle>
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Liste des employés qui n'ont pas validé leur présence dans le module "Présences".
          </p>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un employé..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">Filtrer</Button>
            <Button>Envoyer rappel</Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Dernière présence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{new Date(employee.lastPresence).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Contacter</Button>
                        <Button variant="ghost" size="sm">Valider manuellement</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Aucun employé trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesAbsences;
