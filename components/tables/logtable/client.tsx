'use client';

import { useEffect, useState } from 'react';
import { DataTable2 } from '@/components/ui/data-table2';
import { columnsnew } from './columnsnew';
import { Log, ApiKey } from '@/components/types';
import { useClerk } from '@clerk/clerk-react';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { CHAINID_NETWORK_MAP } from '@/constants/data';
import EmptyState from '@/components/ui/empty-state';

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 5000) => {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchPromise = fetch(url, { ...options, signal });
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetchPromise;
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export default function LogTable() {
  const { user } = useClerk();
  const [data, setData] = useState<Log[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All'); // New state for status filter
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
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

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? 'TestAPIKeyDontUseInCode';

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetchWithTimeout(`${apiUrl}/v0/getApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`, {
          headers: {
            'x-api-key': apiKey
          }
        });

        const json = await response.json();
        const data = JSON.parse(json);
        if (Array.isArray(data)) {
          const formattedData = data.map((item: any) => ({
            api_key: item.api_key,
            email_id: item.email_id,
            name: item.name,
            plan: item.plan,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));

          setApiKeys(formattedData);
          if (formattedData.length > 0) {
            setSelectedApiKey(formattedData[0].api_key);
          }
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
      }
    };

    fetchApiKeys();
  }, [user]);

  useEffect(() => {
    if (selectedApiKey) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetchWithTimeout(`${apiUrl}/v0/getApiKeyLogs?limit=10&page=0&skip=0&apiKey=${selectedApiKey}`, {
            headers: {
              'x-api-key': apiKey
            }
          });

          const data = await response.json();

          const formattedData = data.map((item: any) => ({
            id: item.requestId,
            chain: item.chainId === -1 ? 'N/A' : CHAINID_NETWORK_MAP[item.chainId as keyof typeof CHAINID_NETWORK_MAP],
            request: JSON.stringify(item.request, null, 2),
            response: JSON.stringify(item.response, null, 2),
            httpCode: item.status,
            age: item.created_at,
            requestName: item.method,
            responseStatus: item.response?.result?.success !== undefined ? (item.response.result.success ? 'Success' : 'Failure') : (item.status === 200 ? 'Success' : 'Failure')
          }));

          // Apply status filter
          const filteredData = statusFilter === 'All' ? formattedData : formattedData.filter((item: { responseStatus: string; }) => item.responseStatus === statusFilter);

          setData(filteredData);
        } catch (error) {
          console.error('Failed to fetch logs:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedApiKey, statusFilter]);

  if (!mounted) return null;

  return (
    <>
      <div className="flex items-start justify-between flex-row">
        <div className="w-full md:w-auto">
          <Select onValueChange={setStatusFilter} defaultValue="All">
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failure">Failure</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          {apiKeys.length > 0 && (
            <Select onValueChange={setSelectedApiKey} defaultValue={selectedApiKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select API Key" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {apiKeys.map((apiKey) => (
                    <SelectItem key={apiKey.api_key} value={apiKey.api_key}>
                      {apiKey.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <EmptyState />
        </div>
      ) : (
        <DataTable2 searchKey="requestName" columns={columnsnew} data={data} />
      )}
    </>
  );
}
