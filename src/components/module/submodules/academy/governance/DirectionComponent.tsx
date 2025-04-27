
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for the direction team
const directionMembers = [
  {
    id: '1',
    name: 'Dr. Nkengne Joseph',
    position: 'Proviseur',
    photo: '',
    description: 'Responsable principal de l\'établissement, supervise l\'ensemble des activités pédagogiques et administratives.',
    responsibilities: [
      "Élaboration du projet d'établissement",
      "Coordination des activités pédagogiques",
      "Gestion du personnel",
      "Représentation auprès des autorités"
    ]
  },
  {
    id: '2',
    name: 'Mme Tchoupo Evelyne',
    position: 'Censeur',
    photo: '',
    description: 'Chargée des questions pédagogiques et du suivi des programmes officiels.',
    responsibilities: [
      "Organisation des emplois du temps",
      "Suivi pédagogique des élèves",
      "Coordination des examens",
      "Suivi des programmes officiels"
    ]
  },
  {
    id: '3',
    name: 'M. Ngando Pierre',
    position: 'Intendant',
    photo: '',
    description: 'Responsable de la gestion financière et matérielle de l\'établissement.',
    responsibilities: [
      "Gestion du budget",
      "Supervision des infrastructures",
      "Gestion des fournitures et équipements",
      "Comptabilité et finances"
    ]
  },
  {
    id: '4',
    name: 'Mme Kemta Sylvie',
    position: 'Surveillant Général',
    photo: '',
    description: 'Chargée de la discipline et de la vie scolaire des élèves.',
    responsibilities: [
      "Suivi des présences et absences",
      "Supervision de la discipline",
      "Gestion des cas disciplinaires",
      "Organisation de la vie scolaire"
    ]
  }
];

const DirectionComponent = () => {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        La direction est responsable de la gestion globale de l'établissement. Elle supervise la gestion administrative, pédagogique, financière et matérielle, coordonne les activités et veille au respect des normes et règlements en vigueur.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {directionMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 flex flex-col md:flex-row gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={member.photo} alt={member.name} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.position}</p>
                  <p className="text-gray-600 mt-2">{member.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Responsabilités:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {member.responsibilities.map((resp, index) => (
                        <li key={index} className="text-sm text-gray-600">{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DirectionComponent;
