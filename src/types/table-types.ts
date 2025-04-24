
import { ReactNode } from 'react';

export interface Column {
  accessorKey?: string;
  header: string;
  cell?: (props: { row: { original: any } }) => ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

export interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}
