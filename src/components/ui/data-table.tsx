
import React from 'react';
import { cn } from "@/lib/utils";
import { Column, DataTableProps } from '@/types/table-types';
import { Skeleton } from './skeleton'; 

export function DataTable<T>({ 
  columns, 
  data, 
  isLoading = false,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-md border border-gray-200">
        <div className="overflow-x-auto">
          <div className="w-full min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50 px-6 py-3">
              {columns.map((column, idx) => (
                <Skeleton key={idx} className="h-4 w-24 my-2" />
              ))}
            </div>
            <div className="divide-y divide-gray-200 bg-white">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div key={rowIndex} className="px-6 py-4">
                  {columns.map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-4 w-full my-2" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full rounded-md border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Function to render cell content, handling both cell functions and accessorKey
  const renderCellContent = (column: Column, row: T) => {
    if (typeof column.cell === 'function') {
      return column.cell({ row: { original: row } });
    } else if (column.accessorKey && typeof column.accessorKey === 'string') {
      // If there's an accessorKey but no cell function, just display the raw value
      return (row as any)[column.accessorKey];
    }
    return null;
  };

  console.log("DataTable rendering with data:", data);

  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex || `row-${rowIndex}`}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderCellContent(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
