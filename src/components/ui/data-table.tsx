
import React from 'react';
import { cn } from "@/lib/utils";
import { Column, DataTableProps } from '@/types/table-types';
import { Skeleton } from './skeleton'; 

export function DataTable<T>({ 
  columns, 
  data = [], 
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) {
  
  // Ensure columns and data are always arrays
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];
  
  // Log info for debugging
  console.log(`DataTable rendering with ${safeColumns.length} columns and ${safeData.length} rows`);
  
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-md border border-gray-200">
        <div className="overflow-x-auto">
          <div className="w-full min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50 px-6 py-3">
              {safeColumns.map((column, idx) => (
                <Skeleton key={idx} className="h-4 w-24 my-2" />
              ))}
            </div>
            <div className="divide-y divide-gray-200 bg-white">
              {[1, 2, 3, 4, 5].map((_, rowIndex) => (
                <div key={rowIndex} className="px-6 py-4">
                  {safeColumns.map((_, colIndex) => (
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

  if (!safeData.length) {
    return (
      <div className="w-full rounded-md border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Function to render cell content, handling both cell functions and accessorKey
  const renderCellContent = (column: Column<T>, row: T) => {
    try {
      if (typeof column.cell === 'function') {
        return column.cell({ row: { original: row } });
      } else if (column.accessorKey && typeof column.accessorKey === 'string' && row) {
        // If there's an accessorKey but no cell function, just display the raw value
        const value = (row as any)[column.accessorKey];
        return value !== undefined && value !== null ? value : '';
      }
    } catch (error) {
      console.error('Error rendering cell content:', error);
      return null;
    }
    return null;
  };

  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {safeColumns.map((column, index) => (
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
            {safeData.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={cn(
                  "hover:bg-gray-50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {safeColumns.map((column, colIndex) => (
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
