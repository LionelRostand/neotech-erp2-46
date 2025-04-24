
import { ReactNode } from 'react';

export interface Column {
  header: string;
  accessorKey?: string;
  cell?: (props: { row: { original: any } }) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}
