
import React from 'react';
import DataTable, { Transaction } from '@/components/DataTable';
import { BadgeData } from './BadgeTypes';

interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
}

const BadgesTable: React.FC<BadgesTableProps> = ({ badgesList, onBadgeClick }) => {
  // Convert badges data to table format
  const badgesData: Transaction[] = badgesList.map(badge => ({
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
        className="cursor-pointer"
        onRowClick={(row) => onBadgeClick(row.id.replace('#', ''))}
      />
    </div>
  );
};

export default BadgesTable;
