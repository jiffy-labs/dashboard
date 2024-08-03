// src/utils/utils.ts

export const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeout: number = 10000
  ) => {
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
  
  import { toast } from 'react-toastify';
  
  export const notify = (message: string, type: 'success' | 'error' = 'success') => {
    toast(message, {
      type,
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  