'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ApiKey } from '@/components/types';
import { useUser } from '@clerk/nextjs';
import { createColumns } from './columns';
import { Plus, Check, Copy, Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWithTimeout,notify } from '../utils/utils';


export default function ApiKeysTable() {
  const { user } = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newApiKey, setNewApiKey] = useState<{
    apiKeyName: string;
    apiKey: string;
  } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [imageSrc, setImageSrc] = useState('/loadinglight.gif');

  useEffect(() => {
    if (theme === 'dark') {
      setImageSrc('/loadingdark.gif');
    } else {
      setImageSrc('/loadinglight.gif');
    }
  }, [theme]);

  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PROD
      : process.env.NEXT_PUBLIC_API_URL_DEV;
  const apiKey =
    process.env.NEXT_PUBLIC_API_KEY ?? 'gFQghtJC6F734nPaUYK8M3ggf9TOpojkbNTH9gR5';


  const fetchApiKeys = async () => {
    try {
      const response = await fetchWithTimeout(
        `${apiUrl}/v0/getApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`,
        {
          headers: {
            'x-api-key': apiKey
          }
        }
      );
      if (response.ok) {
        const json = await response.json();
        const data = JSON.parse(json);
        if (Array.isArray(data)) {
          setApiKeys(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch API keys:', errorData);
        notify('Failed to fetch API keys', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
      notify('Failed to fetch API keys', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [user]);

  const handleCreateApiKey = async () => {
    setIsCreating(true);

    const hasStarterPlan = apiKeys.some((key) => key.plan === 'STARTER');

    if (hasStarterPlan) {
      setIsCreating(false);
      notify('You already have an API key for the STARTER plan. Please upgrade to create one more API key.', 'error');
      return;
    }

    try {
      const response = await fetchWithTimeout(
        `${apiUrl}/v0/createApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiKey
          }
        }
      );
      const data = await response.json();
      setNewApiKey(data);
      setApiKeys([...apiKeys, data]);
      notify('API key created successfully', 'success');
    } catch (error) {
      console.error('Failed to create API key:', error);
      notify('Failed to create API key', 'error');
    } finally {
      setIsCreating(false);
      setIsDialogOpen(false); // Close the dialog box
      fetchApiKeys(); // Refresh the API keys list
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteApiKey = async (apiKeyData: ApiKey) => {
    try {
      const response = await fetchWithTimeout(
        `${apiUrl}/v0/deleteApiKey/?emailId=${user?.primaryEmailAddress?.emailAddress}&apiKey=${apiKeyData.api_key}&apiKeyName=${apiKeyData.name}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiKey
          }
        }
      );
      if (response.status === 200) {
        setApiKeys(
          apiKeys.filter((apiKey) => apiKey.api_key !== apiKeyData.api_key)
        );
        setNewApiKey(null);
        notify('API key deleted successfully', 'success');
      } else {
        alert('Something went wrong, please try again later');
        notify('Failed to delete API key', 'error');
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
      notify('Failed to delete API key', 'error');
    }
  };

  if (!mounted) return null;

  const hasStarterPlan = apiKeys.some((key) => key.plan === 'STARTER');

  return (
    <div>
      <ToastContainer />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">API Keys List</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2" /> Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {hasStarterPlan
                  ? 'API Key Creation Restricted'
                  : 'Create New API Key'}
              </DialogTitle>
            </DialogHeader>
            {hasStarterPlan ? (
              <div>
                <p>
                  You already have an API key for the STARTER plan. Please
                  upgrade to create one more API key.
                </p>
              </div>
            ) : !newApiKey ? (
              <>
                <p>Are you sure you want to create a new API key?</p>
                <Button onClick={handleCreateApiKey} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </>
            ) : (
              <div className="mt-4">
                <div className="mb-2 flex items-center">
                  <span className="mr-2">New API Key:</span>
                  <span className="font-mono">
                    {showApiKey
                      ? newApiKey.apiKey
                      : '*******************************'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(newApiKey.apiKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {copied && (
                    <span className="ml-2 text-green-600">Copied!</span>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <img src={imageSrc} alt="Loading" className="h-12 w-12" />
        </div>
      ) : (
        <DataTable
          searchKey="name"
          columns={createColumns(deleteApiKey)}
          data={apiKeys}
        />
      )}
    </div>
  );
}
