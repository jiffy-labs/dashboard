'use client';

import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import axios from 'axios';
import { Log, ApiKey } from '@/components/types';
import { useClerk } from '@clerk/clerk-react';
import { format, parseISO, addDays } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWithTimeout, notify } from '../utils/utils';



const Metrics: React.FC = () => {
  const { user } = useClerk();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [filter, setFilter] = useState<'7days' | '30days'>('7days');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: any[];
  }>({
    labels: [],
    datasets: []
  });


  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? 'TestApiKeyOnlyUseDashboardForProd';

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetchWithTimeout(`${apiUrl}/v0/getApiKeys?emailId=${user?.primaryEmailAddress?.emailAddress}`, {
          headers: {
            'x-api-key': apiKey,
          },
        });
        if (response.ok) {
          const json = await response.json();
          const data = JSON.parse(json);
          console.log(data);
          if (Array.isArray(data)) {
            setApiKeys(data);
          } else {
            console.error('Data is not an array::', data);
            notify('Data is not an array', 'error');
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
        const labels = data.items.map((_: any, index: number) =>
          format(addDays(startDate, index), 'yyyy-MM-dd')
        );

        const datasets = [
          {
            label: 'Credits Consumed',
            data: data.items.map((item: any) => item[0]),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Credits Left',
            data: data.items.map((item: any) => item[1]),
            backgroundColor: 'rgba(192, 75, 192, 0.2)',
            borderColor: 'rgba(192, 75, 192, 1)',
            borderWidth: 1
          }
        ];

        setChartData({ labels, datasets });
      } catch (error) {
        console.error('Error fetching API data:', error);
        notify('Error fetching API data', 'error');
      }
    };

    fetchData();
  }, [filter, selectedApiKey]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 md:p-10">
      <ToastContainer />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 md:text-4xl">
          Daily Requests
        </h2>
      </div>
      <div className="xs:flex-col mb-8 flex gap-2 lg:justify-between">
        <select
          className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 focus:outline-none dark:bg-gray-700 dark:text-gray-300"
          value={filter}
          onChange={(e) => setFilter(e.target.value as '7days' | '30days')}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
        <div className="">
          {apiKeys.length > 0 && (
            <select
              className="w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 focus:outline-none dark:bg-gray-700 dark:text-gray-300"
              value={selectedApiKey}
              onChange={(e) => setSelectedApiKey(e.target.value)}
            >
              <option value="">Select an API Key</option>
              {apiKeys.map((apiKey) => (
                <option
                  key={apiKey.api_key}
                  value={`${apiKey.api_key}|${apiKey.name}`}
                >
                  {apiKey.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
        <BarChart data={chartData} />
      </div>
    </div>
  );
};

export default Metrics;
