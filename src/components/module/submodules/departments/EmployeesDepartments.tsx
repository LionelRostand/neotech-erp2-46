
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Plus,
  Pencil,
  Trash2,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Department {
  id: string;
  name: string;
  manager: string;
  employees: number;
  budget: string;
  location: string;
}

const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'dep-1',
    name: 'Ressources Humaines',
    manager: 'Marie Dupont',
    employees: 12,
    budget: '320,000 €',
    location: 'Paris'
  },
  {
    id: 'dep-2',
    name: 'Développement',
    manager: 'Pierre Martin',
    employees: 28,
    budget: '750,000 €',
    location: 'Paris'
  },
  {
    id: 'dep-3',
    name: 'Marketing',
    manager: 'Sophie Bernard',
    employees: 15,
    budget: '450,000 €',
    location: 'Lyon'
  },
  {
    id: 'dep-4',
    name: 'Support Client',
    manager: 'Jean Dubois',
    employees: 22,
    budget: '380,000 €',
    location: 'Marseille'
  },
  {
    id: 'dep-5',
    name: 'Finance',
    manager: 'Claire Lefebvre',
    employees: 9,
    budget: '290,000 €',
    location: 'Paris'
  }
];

const EmployeesDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDepartments = departments.filter(
    department => department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  department.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  department.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Départements</h2>
          <p className="text-gray-500">Gestion des départements et équipes</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau département
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total départements</h3>
              <p className="text-2xl font-bold">{departments.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total employés</h3>
              <p className="text-2xl font-bold">{departments.reduce((sum, dep) => sum + dep.employees, 0)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Localités</h3>
              <p className="text-2xl font-bold">{new Set(departments.map(dep => dep.location)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-4">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          placeholder="Rechercher un département..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Département</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Employés</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Localité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map(department => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.manager}</TableCell>
                  <TableCell>{department.employees}</TableCell>
                  <TableCell>{department.budget}</TableCell>
                  <TableCell>{department.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Éditer</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesDepartments;
