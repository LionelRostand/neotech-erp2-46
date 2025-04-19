
import React from 'react';
import DataTable from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  date: string;
  client: string;
  service: string;
  status: "success" | "warning" | "danger";
  statusText: string;
}

interface RecentReservationsProps {
  reservations: Reservation[];
}

const RecentReservations: React.FC<RecentReservationsProps> = ({ reservations = [] }) => {
  const { toast } = useToast();

  return (
    <DataTable
      title="Réservations récentes"
      data={reservations}
      columns={[
        { header: 'ID', accessorKey: 'id' },
        { header: 'Date', accessorKey: 'date' },
        { header: 'Client', accessorKey: 'client' },
        { header: 'Service', accessorKey: 'service' },
        { header: 'Statut', accessorKey: 'statusText' }
      ]}
      onRowClick={(row) => toast({
        title: "Détails de la réservation",
        description: `ID: ${row.id} - Client: ${row.client}`
      })}
    />
  );
};

export default RecentReservations;
