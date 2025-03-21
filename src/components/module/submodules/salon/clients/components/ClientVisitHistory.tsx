
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalonVisit } from '../../types/salon-types';

interface ClientVisitHistoryProps {
  visits: SalonVisit[];
}

const ClientVisitHistory: React.FC<ClientVisitHistoryProps> = ({ visits }) => {
  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>Aucune visite enregistrée pour ce client.</p>
        <p className="text-sm mt-2">Les visites apparaîtront ici une fois que le client aura effectué sa première prestation.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Coiffeur</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Satisfaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(visit.date).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{visit.service}</TableCell>
              <TableCell>{visit.stylist}</TableCell>
              <TableCell>{visit.price} €</TableCell>
              <TableCell>
                {visit.satisfaction ? (
                  <Badge variant={
                    visit.satisfaction === 'Très satisfait' ? 'default' : 
                    visit.satisfaction === 'Satisfait' ? 'secondary' :
                    'outline'
                  }>
                    {visit.satisfaction}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Non évalué</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientVisitHistory;
