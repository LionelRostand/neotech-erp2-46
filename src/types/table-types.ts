
import React from 'react';

export interface Column<T = any> {
  header: string;
  accessorKey?: string;
  id?: string;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data?: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}
