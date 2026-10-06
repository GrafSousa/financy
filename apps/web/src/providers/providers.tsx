'use client';

import { Toaster } from 'sonner';
import { ApiProvider } from './api-provider';
import { QueryProvider } from './query-client.provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApiProvider>
      <QueryProvider>{children}</QueryProvider>
      <Toaster />
    </ApiProvider>
  );
}
