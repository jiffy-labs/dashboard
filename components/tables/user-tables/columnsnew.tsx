// components/columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { Log } from '../../types';

export const columnsnew: ColumnDef<Log>[] = [
 
  
  {
    accessorKey: 'chain',
    header: 'CHAIN'
  },
  {
    accessorKey: 'chain',
    header: 'REQUEST'
  },
  {
    accessorKey: 'response',
    header: 'RESPONSE'
  },
  {
    accessorKey: 'httpCode',
    header: 'HTTP CODE'
  },
  {
    accessorKey: 'age',
    header: 'AGE'
  },
  
];
