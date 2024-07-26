'use client'
import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import axios from 'axios';
import { Log, ApiKey } from '@/components/types';
import { useClerk } from '@clerk/clerk-react';
import { format, parseISO, addDays } from 'date-fns';

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

const Metrics: React.FC = () => {
  const { user } = useClerk();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [filter, setFilter] = useState<'7days' | '30days'>('7days');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [chartData, setChartData] = useState<{ labels: string[], datasets: any[] }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetchWithTimeout(`${apiUrl}/v0/getApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`, {
          headers: {
            'x-api-key': apiKey
          }
        });
        if (response.ok) {
          const json = await response.json();
          const data = JSON.parse(json);
          console.log(data);
          if (Array.isArray(data)) {
            setApiKeys(data);
          } else {
            console.error('Data is not an array:', data);
          }
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch API keys:', errorData);
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, [user]);

  useEffect(() => {
    if (!selectedApiKey) {
      console.debug('selectedApiKey is empty or undefined');
      return;
    }

    const [api_key, api_name] = selectedApiKey.split('|');
    if (!api_key || !api_name) {
      console.warn('API key or API name is undefined');
      return;
    }


    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/v0/getApiKeyUsage?apiKeyName=${api_name}&dateRange=${filter === '7days' ? 7 : 30}`, {
          headers: {
            'x-api-key': apiKey
          }
        });

        const data = response.data;

        const startDate = parseISO(data.startDate);
        const labels = data.items.map((_: any, index: number) => format(addDays(startDate, index), 'yyyy-MM-dd'));

        const datasets = [{
          label: 'Credits Consumed',
          data: data.items.map((item: any) => item[0]),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }, {
          label: 'Credits Left',
          data: data.items.map((item: any) => item[1]),
          backgroundColor: 'rgba(192, 75, 192, 0.2)',
          borderColor: 'rgba(192, 75, 192, 1)',
          borderWidth: 1,
        }];

        setChartData({ labels, datasets });
      } catch (error) {
        console.error('Error fetching API data:', error);
        // Handle error
      }
    };

    fetchData();
  }, [filter, selectedApiKey]);

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? 'TestApiKeyOnlyUseDashboardForProd';

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">Daily Requests</h2>
      </div>
      <div className="flex xs:flex-col lg:justify-between mb-8 gap-2">
        <select
          className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value as '7days' | '30days')}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
        <div className=''>
          {apiKeys.length > 0 && (
            <select
              className="w-full px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:outline-none"
              value={selectedApiKey}
              onChange={(e) => setSelectedApiKey(e.target.value)}
            >
              <option value="">Select an API Key</option>
              {apiKeys.map((apiKey) => (
                <option key={apiKey.api_key} value={`${apiKey.api_key}|${apiKey.name}`}>
                  {apiKey.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <BarChart data={chartData} />
      </div>
    </div>
  );
};

export default Metrics;
