
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GarageService } from '../types/garage-types';

interface ServicesListProps {
  services: GarageService[];
  isLoading: boolean;
}

const ServicesList = ({ services, isLoading }: ServicesListProps) => {
  if (isLoading) {
    return <div>Chargement des services...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Durée (min)</TableHead>
          <TableHead>Prix (€)</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">Aucun service trouvé</TableCell>
          </TableRow>
        ) : (
          services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.type}</TableCell>
              <TableCell>{service.duration}</TableCell>
              <TableCell>{service.price}€</TableCell>
              <TableCell>{service.description}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ServicesList;
