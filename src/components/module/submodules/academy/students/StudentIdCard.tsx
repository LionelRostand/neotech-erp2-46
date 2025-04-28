
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface StudentIdCardProps {
  student: {
    firstName: string;
    lastName: string;
    class: string;
    studentId: string;
    photo?: string;
    academicYear: string;
  };
}

const StudentIdCard = ({ student }: StudentIdCardProps) => {
  return (
    <Card className="w-[350px] h-[220px] bg-gradient-to-br from-purple-100 to-white relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-purple-900 mb-1">CARTE D'ÉTUDIANT</h3>
            <p className="text-sm text-purple-700">Année académique {student.academicYear}</p>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-100">
                <User className="w-12 h-12 text-purple-300" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Nom et Prénom</p>
          <p className="text-lg font-semibold text-gray-900">{student.lastName} {student.firstName}</p>
          
          <div className="flex justify-between items-center mt-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Classe</p>
              <Badge variant="outline" className="bg-purple-50">
                {student.class}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">N° Matricule</p>
              <Badge variant="outline" className="bg-purple-50">
                {student.studentId}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentIdCard;
