
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

const RecentReservations: React.FC<RecentReservationsProps> = ({ reservations }) => {
  const { toast } = useToast();

  return (
    <DataTable
      title="Réservations récentes"
      data={reservations}
      columns={[
        { key: 'id', header: 'ID' },
        { key: 'date', header: 'Date' },
        { key: 'client', header: 'Client' },
        { key: 'service', header: 'Service' },
        { 
          key: 'status', 
          header: 'Statut',
          cell: ({ row }) => {
            const { status, statusText } = row.original;
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold
                ${status === 'success' ? 'bg-green-100 text-green-800' : ''}
                ${status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${status === 'danger' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {statusText}
              </span>
            );
          }
        }
      ]}
      onRowClick={(row) => toast({
        title: "Détails de la réservation",
        description: `ID: ${row.id} - Client: ${row.client}`
      })}
    />
  );
};

export default RecentReservations;
