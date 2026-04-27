import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import type { Match, WsServerMessage } from '../types';

const MATCHES_KEY = ['matches'] as const;

async function fetchMatches(limit = 50): Promise<Match[]> {
  const res = await fetch(`/api/matches?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch matches: ${res.statusText}`);
  return res.json();
}

export function useMatches(limit = 50) {
  const queryClient = useQueryClient();

  const handleMessage = (msg: WsServerMessage) => {
    if (msg.event === 'MATCH_CREATED') {
      const newMatch = msg.data as Match;
      queryClient.setQueryData<Match[]>(MATCHES_KEY, (old = []) => {
        // Prepend and deduplicate
        const exists = old.some((m) => m.id === newMatch.id);
        if (exists) return old;
        return [newMatch, ...old];
      });
    }

    if (msg.event === 'MATCH_UPDATED') {
      const updated = msg.data as Match;
      queryClient.setQueryData<Match[]>(MATCHES_KEY, (old = []) =>
        old.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
      );
    }
  };

  const { status: wsStatus } = useWebSocket(handleMessage);

  const query = useQuery({
    queryKey: MATCHES_KEY,
    queryFn: () => fetchMatches(limit),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 3,
  });

  return { ...query, wsStatus };
}

export function useMatch(matchId: number) {
  const queryClient = useQueryClient();

  const handleMessage = (msg: WsServerMessage) => {
    if (msg.event === 'MATCH_UPDATED') {
      const updated = msg.data as Match;
      if (updated.id === matchId) {
        queryClient.setQueryData<Match[]>(['matches'], (old = []) =>
          old.map((m) => (m.id === matchId ? { ...m, ...updated } : m))
        );
      }
    }
  };

  useWebSocket(handleMessage);

  const matchesQuery = useQuery({
    queryKey: ['matches'],
    queryFn: () => fetchMatches(100),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!matchesQuery.data?.some((m) => m.id === matchId)) {
      // Fetch individual match if not in cache
      fetch(`/api/matches/${matchId}`)
        .then((r) => r.json())
        .then((match: Match) => {
          queryClient.setQueryData<Match[]>(['matches'], (old = []) => {
            const exists = old.some((m) => m.id === matchId);
            if (exists) return old;
            return [...old, match];
          });
        })
        .catch(() => {/* ignore */});
    }
  }, [matchId, matchesQuery.data, queryClient]);

  const match = matchesQuery.data?.find((m) => m.id === matchId);
  return { match, isLoading: matchesQuery.isLoading, error: matchesQuery.error };
}
