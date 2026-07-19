import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

let queryClient: QueryClient | null = null

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  }
  return queryClient
}

export function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(getQueryClient)
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export { useQuery, useMutation, useQueryClient }
export type { QueryClient }
