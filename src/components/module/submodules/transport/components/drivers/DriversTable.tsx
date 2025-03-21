
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DriversTableSkeleton from './DriversTableSkeleton';
import DriversEmptyState from './DriversEmptyState';
import DriverRow from './DriverRow';
import { useDriversData } from './hooks/useDriversData';
import { DriversTableProps } from './types/driverTypes';

const DriversTable: React.FC<DriversTableProps> = ({ searchTerm }) => {
  const { drivers, loading, error } = useDriversData();
  
  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chauffeur</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Permis</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Évaluation</TableHead>
            <TableHead>Trajets</TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <DriversTableSkeleton />
        ) : (
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <DriversEmptyState error={error} searchTerm={searchTerm} />
            ) : (
              filteredDrivers.map((driver) => (
                <DriverRow key={driver.id} driver={driver} />
              ))
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default DriversTable;
