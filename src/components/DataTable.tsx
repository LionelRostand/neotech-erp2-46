
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableProps<T> {
  title: string;
  data?: T[];  // Make data optional with ?
  columns: { header: string; accessorKey: keyof T }[];
  onRowClick?: (row: T) => void;  // Add optional onRowClick prop
}

function DataTable<T>({ title, data = [], columns, onRowClick }: DataTableProps<T>) {  // Add default empty array
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="relative overflow-x-auto">
        {data && data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {String(row[column.accessorKey] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
