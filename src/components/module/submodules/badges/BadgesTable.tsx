
import React from 'react';
import DataTable from '@/components/DataTable';
import { BadgeData } from './BadgeTypes';

interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
}

const BadgesTable: React.FC<BadgesTableProps> = ({ badgesList = [], onBadgeClick }) => {
  // Convert badges data to table format with a null check
  const badgesData = Array.isArray(badgesList) 
    ? badgesList.map(badge => ({
        id: badge.id,
        date: badge.date,
        client: badge.employeeName,
        amount: badge.accessLevel,
        status: badge.status,
        statusText: badge.statusText
      }))
    : [];

  return (
    <div className="mb-8">
      <DataTable 
        title="Registre des Badges" 
        data={badgesData}
        columns={[
          { header: 'ID', accessorKey: 'id' },
          { header: 'Date', accessorKey: 'date' },
          { header: 'Employé', accessorKey: 'client' },
          { header: 'Niveau', accessorKey: 'amount' },
          { header: 'Statut', accessorKey: 'statusText' }
        ]}
        onRowClick={(row) => onBadgeClick(row.id.replace('#', ''))}
      />
    </div>
  );
};

export default BadgesTable;
