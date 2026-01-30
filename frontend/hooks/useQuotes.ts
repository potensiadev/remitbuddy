/**
 * React Query hook for fetching remittance quotes
 */
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Quote, QuoteResponse, QueryParams } from '../types';

interface UseQuotesParams {
  queryParams: QueryParams;
  amount: string | number;
  apiBaseUrl: string;
  enabled?: boolean;
}

interface UseQuotesResult {
  results: Quote[];
  bestProvider: Quote | null;
  worstProvider: Quote | null;
  savings: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  dataUpdatedAt: number;
}

async function fetchQuotes(
  apiBaseUrl: string,
  country: string,
  currency: string,
  amount: string | number
): Promise<QuoteResponse> {
  const url = `${apiBaseUrl}/api/getRemittanceQuote?receive_country=${country}&receive_currency=${currency}&send_amount=${amount}&_t=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No providers available for this route');
  }

  return data;
}

export function useQuotes({
  queryParams,
  amount,
  apiBaseUrl,
  enabled = true,
}: UseQuotesParams): UseQuotesResult {
  const { receive_country, receive_currency } = queryParams;

  const query = useQuery({
    queryKey: ['quotes', receive_country, receive_currency, amount],
    queryFn: () => fetchQuotes(apiBaseUrl, receive_country, receive_currency, amount),
    enabled: enabled && Boolean(receive_country) && Boolean(receive_currency) && Boolean(amount),
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const results = query.data?.results || [];
  const bestProvider = results.length > 0 ? results[0] : null;
  const worstProvider = results.length > 1 ? results[results.length - 1] : null;
  const savings =
    bestProvider && worstProvider
      ? Math.round(bestProvider.recipient_gets - worstProvider.recipient_gets)
      : 0;

  return {
    results,
    bestProvider,
    worstProvider,
    savings,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt,
  };
}

export default useQuotes;
