import { ColumnDef } from '@tanstack/react-table';
import { Log } from '@/components/types';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

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
      try {
        const date = parseISO(getValue<string>());
        return <span>{format(date, 'yyyy-MM-dd HH:mm:ss')}</span>; // Display in your desired local format
      } catch (error) {
        console.error('Error parsing date:', error);
        return <span>Error</span>; // Or handle it gracefully as per your application's needs
      }
    },
  },
];
