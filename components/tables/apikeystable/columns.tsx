
import { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, EyeOffIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ApiKey } from '@/components/types';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

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

const DeleteButton = ({ onDelete }: { onDelete: () => Promise<void> }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? (
        <svg
          className="animate-spin h-5 w-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        <svg
          width="14"
          height="18"
          viewBox="0 0 14 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 1H10.5L9.5 0H4.5L3.5 1H0V3H14M1 16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H11C11.5304 18 12.0391 17.7893 12.4142 17.4142C12.7893 17.0391 13 16.5304 13 16V4H1V16Z"
            fill="#C5221F"
          />
        </svg>
      )}
    </Button>
  );
};

export const createColumns = (deleteApiKey: (apiKeyData: ApiKey) => Promise<void>): ColumnDef<ApiKey>[] => [
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
    id: 'actions',
    header: 'ACTIONS',
    cell: ({ row }) => (
      <DeleteButton onDelete={() => deleteApiKey(row.original)} />
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'AGE',
    cell: ({ getValue }) => {
      try {
        const date = parseISO(getValue<string>());
        return <span>{format(date, 'yyyy-MM-dd HH:mm:ss')}</span>; // Display in your desired local format
      } catch (error) {
        console.error('Error parsing date:', error);
        return <span>Error</span>; // Or handle it gracefully as per your application's needs
      }
    }
  }
];
