import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import GenerateIdCardDialog from './GenerateIdCardDialog';
import { Badge } from "@/components/ui/badge";
import { id } from "date-fns/locale";

const AcademyStudents = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      firstName: 'Lionel',
      lastName: 'Djossa',
      class: '6ème A',
      studentId: '20240001',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      class: '5ème B',
      studentId: '20240002',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 3,
      firstName: 'John',
      lastName: 'Smith',
      class: '4ème C',
      studentId: '20240003',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
    },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showIdCardDialog, setShowIdCardDialog] = useState(false);

  const handleGenerateIdCard = (student) => {
    setSelectedStudent({
      ...student,
      academicYear: '2024-2025', // TODO: Get from context/settings
    });
    setShowIdCardDialog(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Élèves</CardTitle>
          <CardDescription>
            Liste des élèves inscrits dans l'établissement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Liste des élèves inscrits dans l'établissement.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Matricule</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.studentId}</TableCell>
                  <TableCell>{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleGenerateIdCard(student)}
                      >
                        Carte d'étudiant
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {selectedStudent && (
            <GenerateIdCardDialog
              open={showIdCardDialog}
              onClose={() => setShowIdCardDialog(false)}
              student={selectedStudent}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyStudents;
