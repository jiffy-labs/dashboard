import { ColumnDef } from '@tanstack/react-table';
import { Log } from '@/components/types';
import { formatDistanceToNow } from 'date-fns';
export const columnsnew: ColumnDef<Log>[] = [
  {
    accessorKey: 'chain',
    header: 'Chain',
  },
  {
    accessorKey: 'requestName',
    header: 'Request Method',
  },
  {
    accessorKey: 'responseStatus',
    header: 'Response Status',
  },
  {
    accessorKey: 'httpCode',
    header: 'HTTP Code',
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>());
      return <span>{formatDistanceToNow(date, { addSuffix: true })}</span>;
    },
  },
];
