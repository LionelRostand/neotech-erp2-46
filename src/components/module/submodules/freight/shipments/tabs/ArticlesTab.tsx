
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShipmentLine } from '@/types/freight';

interface ArticlesTabProps {
  lines: ShipmentLine[];
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({ lines }) => {
  if (!lines || lines.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Aucun article dans cette expédition
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Article</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Poids</TableHead>
            <TableHead>Type d'emballage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line, index) => (
            <TableRow key={line.id || index}>
              <TableCell>{line.productName}</TableCell>
              <TableCell>{line.quantity}</TableCell>
              <TableCell>{line.weight} kg</TableCell>
              <TableCell>{line.packageType || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArticlesTab;
