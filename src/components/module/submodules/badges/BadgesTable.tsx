
import React from 'react';
import DataTable from '@/components/DataTable';
import { BadgeData } from './BadgeTypes';

interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
}

const BadgesTable: React.FC<BadgesTableProps> = ({ badgesList = [], onBadgeClick }) => {
  // Convert badges data to table format
  const badgesData = badgesList.map(badge => ({
    id: badge.id,
    date: badge.date,
    client: badge.employeeName,
    amount: badge.accessLevel,
    status: badge.status,
    statusText: badge.statusText
  }));

  return (
    <div className="mb-8">
      <DataTable 
        title="Registre des Badges" 
        data={badgesData}
        onRowClick={(row) => onBadgeClick(row.id.replace('#', ''))}
      />
    </div>
  );
};

export default BadgesTable;
