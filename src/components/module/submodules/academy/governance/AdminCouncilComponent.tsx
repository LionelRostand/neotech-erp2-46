
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for administrative council
const councilMembers = [
  {
    id: '1',
    name: 'M. Mbala Etienne',
    role: 'Président',
    representation: 'Ministère de l\'Éducation',
    category: 'government'
  },
  {
    id: '2',
    name: 'Dr. Nkengne Joseph',
    role: 'Secrétaire',
    representation: 'Direction (Proviseur)',
    category: 'management'
  },
  {
    id: '3',
    name: 'Mme Tchoupo Evelyne',
    role: 'Membre',
    representation: 'Direction (Censeur)',
    category: 'management'
  },
  {
    id: '4',
    name: 'M. Ngando Pierre',
    role: 'Trésorier',
    representation: 'Direction (Intendant)',
    category: 'management'
  },
  {
    id: '5',
    name: 'Prof. Kuete Michel',
    role: 'Membre',
    representation: 'Corps enseignant',
    category: 'teaching'
  },
  {
    id: '6',
    name: 'Mme Fopa Jeanne',
    role: 'Membre',
    representation: 'Association des parents d\'élèves',
    category: 'parent'
  },
  {
    id: '7',
    name: 'M. Tamo Bernard',
    role: 'Membre',
    representation: 'Partenaire privé',
    category: 'partner'
  }
];

const functions = [
  "Définition des orientations stratégiques de l'établissement",
  "Validation du budget annuel et des projets importants",
  "Supervision des activités et conformité avec la réglementation",
  "Approbation des rapports annuels et bilans financiers",
  "Proposition des améliorations structurelles et pédagogiques"
];

const AdminCouncilComponent = () => {
  // Function to determine badge color based on category
  const getBadgeVariant = (category: string) => {
    switch(category) {
      case 'government': return 'default';
      case 'management': return 'outline';
      case 'teaching': return 'secondary';
      case 'parent': return 'success';
      case 'partner': return 'warning';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Rôle du Conseil d'Administration</h3>
        <p className="text-gray-600 mb-4">
          Le conseil d'administration définit les grandes orientations stratégiques, valide le budget annuel 
          et les projets importants, et surveille la conformité des activités avec la réglementation.
        </p>
        
        <div className="bg-primary/5 p-4 rounded-md mb-6">
          <h4 className="font-medium mb-2">Fonctions principales:</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {functions.map((func, index) => (
              <li key={index} className="text-gray-700">{func}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Composition du Conseil</h3>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Représentation</TableHead>
                <TableHead>Catégorie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {councilMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.representation}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(member.category)}>
                      {member.category === 'government' && 'État'}
                      {member.category === 'management' && 'Direction'}
                      {member.category === 'teaching' && 'Enseignant'}
                      {member.category === 'parent' && 'Parent'}
                      {member.category === 'partner' && 'Partenaire'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminCouncilComponent;
