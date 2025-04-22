
import React from 'react';

export interface Column {
  accessorKey?: string;
  header: string;
  cell?: (props: { row: { original: any } }) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}
