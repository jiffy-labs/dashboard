'use client';

import { useEffect, useState } from 'react';
import { DataTable2 } from '@/components/ui/data-table2';
import { columnsnew } from './columnsnew';
import { Log, ApiKey } from '@/components/types';
import { useClerk } from '@clerk/clerk-react';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { CHAINID_NETWORK_MAP } from '@/constants/data';
export default function LogTable() {
  const { user } = useClerk();
  const [data, setData] = useState<Log[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])



  const [imageSrc, setImageSrc] = useState('/loadinglight.gif');

  useEffect(() => {
    if (theme === 'dark') {
      setImageSrc('/loadingdark.gif');
    } else {
      setImageSrc('/loadinglight.gif');
    }
  }, [theme]);
  useEffect(() => {
    const fetchApiKeys = async () => {
      const response = await fetch(`https://api-dev.jiffyscan.xyz/v0/getApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`, {
        headers: {
          'x-api-key': 'TestAPIKeyDontUseInCode'
        }
      });

      const json = await response.json();
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        const formattedData = data.map((item: any) => ({
          api_key: item.api_key,
          email_id: item.email_id,
          name: item.name,
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
    };

    fetchApiKeys();
  }, [user]);

  useEffect(() => {
    if (selectedApiKey) {
      const fetchData = async () => {
        setIsLoading(true);
        const response = await fetch(`https://api-dev.jiffyscan.xyz/v0/getApiKeyLogs?limit=10&page=0&skip=0&apiKey=${selectedApiKey}`, {
          headers: {
            'x-api-key': 'TestAPIKeyDontUseInCode'
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

        setData(formattedData);
        setIsLoading(false);
      };

      fetchData();
    }
  }, [selectedApiKey]);
  if(!mounted) return null
  return (
    <>
      <div className="flex items-start justify-between flex-row">
        <h1>API Request Logs</h1>
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
         <img src={imageSrc } alt="Loading..." className="mt-[15rem]" />
        </div>
      ) : (
        <DataTable2 searchKey="requestName" columns={columnsnew} data={data} />
      )}
    </>
  );
}
