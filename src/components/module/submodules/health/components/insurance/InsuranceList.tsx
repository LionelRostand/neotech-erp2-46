
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Eye, 
  FileText, 
  MoreHorizontal,
  Trash2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Insurance } from '../../types/health-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Badge } from '@/components/ui/badge';

interface InsuranceListProps {
  searchQuery: string;
  onViewInsurance: (insurance: Insurance) => void;
  onEditInsurance: (insurance: Insurance) => void;
}

const InsuranceList: React.FC<InsuranceListProps> = ({ 
  searchQuery, 
  onViewInsurance, 
  onEditInsurance 
}) => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  const insuranceCollection = useFirestore(COLLECTIONS.HEALTH_INSURANCE);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        // This is a mock implementation - in a real app, we would fetch from Firebase
        setLoading(true);
        const mockInsurances: Insurance[] = [
          {
            id: '1',
            name: 'Assurance Maladie',
            type: 'public',
            coverageLevel: 'basic',
            contact: {
              address: '50 Avenue du Professeur André Lemierre, 75020 Paris',
              phone: '3646',
              email: 'contact@ameli.fr'
            },
            coverageDetails: {
              consultations: 70,
              medications: 65,
              hospitalization: 80,
              specialistVisits: 70
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'MGEN',
            type: 'mutual',
            coverageLevel: 'premium',
            contact: {
              address: '3 Square Max Hymans, 75015 Paris',
              phone: '3676',
              email: 'contact@mgen.fr'
            },
            coverageDetails: {
              consultations: 100,
              medications: 90,
              hospitalization: 100,
              specialistVisits: 100
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'AXA Santé',
            type: 'private',
            coverageLevel: 'advanced',
            contact: {
              address: '25 Avenue Matignon, 75008 Paris',
              phone: '01 40 75 48 00',
              email: 'contact@axa.fr'
            },
            coverageDetails: {
              consultations: 95,
              medications: 80,
              hospitalization: 95,
              specialistVisits: 90
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        // Normally we would do this:
        // const data = await insuranceCollection.getAll();
        
        setInsurances(mockInsurances);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching insurances:', error);
        setLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  // Filter insurances based on searchQuery
  const filteredInsurances = insurances.filter(insurance => 
    insurance.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    insurance.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'bg-blue-100 text-blue-800';
      case 'mutual':
        return 'bg-green-100 text-green-800';
      case 'private':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement des assurances...</div>;
  }

  if (filteredInsurances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">Aucune assurance trouvée</h3>
        <p className="text-gray-500 max-w-md mb-4">
          {searchQuery 
            ? `Aucune assurance ne correspond à "${searchQuery}"`
            : "Il n'y a actuellement aucune assurance enregistrée. Ajoutez-en une pour commencer."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Niveau de couverture</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInsurances.map((insurance) => (
            <TableRow key={insurance.id}>
              <TableCell className="font-medium">{insurance.name}</TableCell>
              <TableCell>
                <Badge className={getTypeColor(insurance.type)}>
                  {insurance.type === 'public' ? 'Publique' : 
                   insurance.type === 'mutual' ? 'Mutuelle' : 
                   insurance.type === 'private' ? 'Privée' : insurance.type}
                </Badge>
              </TableCell>
              <TableCell>
                {insurance.coverageLevel === 'basic' ? 'Basique' : 
                 insurance.coverageLevel === 'advanced' ? 'Avancé' : 
                 insurance.coverageLevel === 'premium' ? 'Premium' : insurance.coverageLevel}
              </TableCell>
              <TableCell>
                <div className="text-sm">{insurance.contact.phone}</div>
                <div className="text-xs text-gray-500">{insurance.contact.email}</div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewInsurance(insurance)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditInsurance(insurance)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InsuranceList;
