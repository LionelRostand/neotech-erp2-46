
import React from 'react';
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export interface Transaction {
  id: string;
  date: string;
  client: string;
  amount: string;
  status: "success" | "warning" | "danger";
  statusText: string;
}

export interface Column {
  key: string;
  header: string;
  cell?: (props: { row: { original: any } }) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns?: Column[];
  className?: string;
  onRowClick?: (row: T) => void;
}

const DataTable = <T extends Record<string, any>>({ 
  title, 
  data, 
  columns, 
  className, 
  onRowClick 
}: DataTableProps<T>) => {
  
  // Use provided columns or default Transaction columns
  const tableColumns = columns || [
    { key: 'id', header: 'ID' },
    { key: 'date', header: 'Date' },
    { key: 'client', header: 'Client' },
    { key: 'amount', header: 'Montant' },
    { 
      key: 'status', 
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.original.status}>{row.original.statusText}</StatusBadge>
    }
  ];

  return (
    <div className={cn("bg-white rounded-xl shadow-sm overflow-hidden", className)}>
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
              {tableColumns.map((column, index) => (
                <th key={index} className="px-6 py-4 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, rowIndex) => (
              <tr 
                key={rowIndex}
                className={cn(
                  "text-gray-700 text-sm hover:bg-gray-50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {tableColumns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 font-medium">
                    {column.cell 
                      ? column.cell({ row: { original: item } })
                      : item[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
