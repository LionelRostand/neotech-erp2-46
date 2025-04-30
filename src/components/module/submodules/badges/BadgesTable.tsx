
import React from 'react';
import DataTable, { Transaction } from '@/components/DataTable';
import { BadgeData } from './BadgeTypes';

interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
  loading?: boolean;
}

const BadgesTable: React.FC<BadgesTableProps> = ({ badgesList = [], onBadgeClick, loading = false }) => {
  // Convert badges data to table format
  const badgesData: Transaction[] = Array.isArray(badgesList) ? badgesList.map(badge => ({
    id: badge.id || '',
    date: badge.date || '',
    client: badge.employeeName || '',
    amount: badge.accessLevel || '',
    status: badge.status || 'warning',
    statusText: badge.statusText || 'Inconnu'
  })) : [];

  if (loading) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800">Registre des Badges</h2>
          <div className="mt-4 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <DataTable 
        title="Registre des Badges" 
        data={badgesData}
        className="cursor-pointer"
        onRowClick={(row) => onBadgeClick(row.id)}
      />
    </div>
  );
};

export default BadgesTable;
