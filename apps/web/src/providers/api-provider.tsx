'use client';
import { Apis, getApiInstance } from '@/services/http';
import { createContext, useContext } from 'react';

const ApiContext = createContext<Apis | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const api = getApiInstance();

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const api = useContext(ApiContext);

  if (!api) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return api;
}
