
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, Award, FileText, GraduationCap } from 'lucide-react';

// Mock data for pedagogical committee members
const committeeMembers = [
  {
    id: '1',
    name: 'Mme Tchoupo Evelyne',
    position: 'Présidente (Censeur)',
    department: 'Direction'
  },
  {
    id: '2',
    name: 'Prof. Kuete Michel',
    position: 'Responsable Département Scientifique',
    department: 'Sciences'
  },
  {
    id: '3',
    name: 'M. Fotso Pascal',
    position: 'Responsable Département Littéraire',
    department: 'Lettres'
  },
  {
    id: '4',
    name: 'Mme Kengne Rosine',
    position: 'Responsable Département Langues',
    department: 'Langues'
  },
  {
    id: '5',
    name: 'M. Talla Richard',
    position: 'Responsable Évaluation',
    department: 'Évaluation'
  },
  {
    id: '6',
    name: 'Mme Djomo Pauline',
    position: 'Représentante des Parents',
    department: 'Parents'
  }
];

const activities = [
  {
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    title: "Mise en œuvre des programmes",
    description: "Assurer le suivi de l'application des programmes nationaux et adapter les méthodes pédagogiques aux besoins des élèves."
  },
  {
    icon: <Calendar className="h-5 w-5 text-primary" />,
    title: "Planification pédagogique",
    description: "Organiser le calendrier scolaire, les emplois du temps et la répartition des ressources pédagogiques."
  },
  {
    icon: <Award className="h-5 w-5 text-primary" />,
    title: "Supervision des évaluations",
    description: "Coordonner les évaluations continues, les examens périodiques et les examens de fin d'année."
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    title: "Formation des enseignants",
    description: "Organiser des sessions de formation continue pour maintenir et améliorer la qualité de l'enseignement."
  },
  {
    icon: <FileText className="h-5 w-5 text-primary" />,
    title: "Innovations pédagogiques",
    description: "Proposer des améliorations et des innovations dans les approches pédagogiques et les activités extrascolaires."
  }
];

const PedagogicalCommittee = () => {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Le comité pédagogique est responsable de la mise en œuvre du programme national, 
        de l'organisation de la planification pédagogique, et de la supervision de l'évaluation des élèves.
        Il joue un rôle central dans la qualité de l'enseignement dispensé.
      </p>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Rôle et activités du comité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{activity.icon}</div>
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Composition du comité pédagogique</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Nom</th>
                <th className="text-left p-3">Position</th>
                <th className="text-left p-3">Département</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {committeeMembers.map((member) => (
                <tr key={member.id}>
                  <td className="p-3 font-medium">{member.name}</td>
                  <td className="p-3">{member.position}</td>
                  <td className="p-3">{member.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-primary/5 p-4 rounded-md">
        <h4 className="font-medium mb-2">Fréquence des réunions</h4>
        <p className="text-gray-700">
          Le comité pédagogique se réunit une fois par mois et à la fin de chaque période d'évaluation pour analyser les résultats 
          et proposer des ajustements si nécessaire. Des réunions extraordinaires peuvent être convoquées pour traiter des 
          problèmes pédagogiques spécifiques.
        </p>
      </div>
    </div>
  );
};

export default PedagogicalCommittee;
