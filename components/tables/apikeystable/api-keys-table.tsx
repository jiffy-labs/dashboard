'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ApiKey } from '@/components/types';
import { useUser } from '@clerk/nextjs';
import { columns } from './columns';
import { Plus, Check, Copy, Eye, EyeOff } from 'lucide-react';

export default function ApiKeysTable() {
  const { user } = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newApiKey, setNewApiKey] = useState<{ apiKeyName: string, apiKey: string } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading,setIsLoading] = useState(true)
  useEffect(() => {
    const fetchApiKeys = async () => {
      const response = await fetch(`https://api-dev.jiffyscan.xyz/v0/getApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`, {
        headers: {
          'x-api-key': 'TestAPIKeyDontUseInCode'
        }
      });
      const json = await response.json();
        const data = JSON.parse(json);
      console.log("api keys fetched", data);
      if (Array.isArray(data)) {
        setApiKeys(data);
        setIsLoading(false)
      } else {
        console.error('Data is not an array:', data);
        setIsLoading(false)
      }
    };

    fetchApiKeys();
  }, [user]);

  const handleCreateApiKey = async () => {
    setIsCreating(true);
    const response = await fetch(`https://api-dev.jiffyscan.xyz/v0/createApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`, {
      method: 'GET',
      headers: {
        'x-api-key': 'TestAPIKeyDontUseInCode'
      }
    });
    const data = await response.json();
    setNewApiKey(data);
    setApiKeys([...apiKeys, data]);
    setIsCreating(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">API Keys List</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" /> Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            {!newApiKey &&(
                <>
             <p>Are you sure you want to create a new API key?</p>
            <Button onClick={handleCreateApiKey} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
            </>
            )
            }
            {newApiKey && (
              <div className="mt-4">
                <p className="font-semibold">API Key Name:</p>
                <p>{newApiKey.apiKeyName}</p>
                <p className="font-semibold mt-2">API Key:</p>
                <div className="flex items-center">
                  <span className="mr-2">{showApiKey ? newApiKey.apiKey : '**********'}</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(newApiKey.apiKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  {copied && <Check className="h-4 w-4 text-green-600 ml-2" />}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
     
     
      {isLoading ? (
          <div className="flex justify-center items-center h-full mt-[16rem]">
            <img src="/loadingeth.gif" alt="Loading..." />
          </div>
        ) : (
          <DataTable searchKey='name' columns={columns} data={apiKeys} />
        )}
        
      
    </div>
  );
}
