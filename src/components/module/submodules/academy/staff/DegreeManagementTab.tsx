
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileBadge2, FileText } from 'lucide-react';

// Mock data for degrees - replace with actual data later
const degrees = [
  {
    id: '1',
    employeeName: 'Thierry Bernard',
    title: 'Master en Mathématiques',
    institution: 'Université de Yaoundé I',
    year: '2018',
    verified: true,
    type: 'Master',
  },
  {
    id: '2',
    employeeName: 'Marie Tamo',
    title: 'Licence en Physique',
    institution: 'Université de Douala',
    year: '2015',
    verified: true,
    type: 'Licence',
  },
  {
    id: '3',
    employeeName: 'Paul Biya',
    title: 'DIPES II en Chimie',
    institution: 'ENS Yaoundé',
    year: '2020',
    verified: false,
    type: 'DIPES',
  },
];

const DegreeManagementTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Diplômes et Qualifications</h2>
          <p className="text-muted-foreground">
            Gestion des diplômes et qualifications du personnel
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FileBadge2 className="h-4 w-4" />
          Nouveau diplôme
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">15</CardTitle>
            <CardDescription>Total des diplômes</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Diplômes vérifiés</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>En attente de vérification</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des diplômes</CardTitle>
          <CardDescription>Consultez et gérez les diplômes du personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Diplôme</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {degrees.map((degree) => (
                <TableRow key={degree.id}>
                  <TableCell className="font-medium">{degree.employeeName}</TableCell>
                  <TableCell>{degree.title}</TableCell>
                  <TableCell>{degree.institution}</TableCell>
                  <TableCell>{degree.year}</TableCell>
                  <TableCell>
                    <Badge variant={degree.verified ? "default" : "secondary"}>
                      {degree.verified ? 'Vérifié' : 'En attente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">Voir le document</span>
                    </Button>
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

export default DegreeManagementTab;
