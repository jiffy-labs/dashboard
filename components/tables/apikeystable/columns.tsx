'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, EyeOffIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ApiKey } from '@/components/types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const KeySecretCell = ({ apiKey }: { apiKey: string }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center">
      <span className="mr-2">{show ? apiKey : '*******************************'}</span>
      <Button variant="ghost" size="sm" onClick={() => setShow(!show)}>
        {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey)}>
        <CopyIcon className="h-4 w-4" />
      </Button>
      {copied && <span className="text-green-600 ml-2">Copied!</span>}
    </div>
  );
};

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: 'name',
    header: 'KEY NAME',
  },
  {
    accessorKey: 'api_key',
    header: 'KEY SECRET',
    cell: ({ getValue }) => <KeySecretCell apiKey={getValue<string>()} />,
  },
  {
    accessorKey: 'created_at',
    header: 'AGE',
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>());
      return <span>{formatDistanceToNow(date, { addSuffix: true })}</span>;
    },
  },
];
