import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import type { Commentary, WsServerMessage } from "../types";

function commentaryKey(matchId: number) {
  return ["commentary", matchId] as const;
}

async function fetchCommentary(matchId: number): Promise<Commentary[]> {
  const res = await fetch(`/api/commentary/match/${matchId}`);
  if (!res.ok) throw new Error(`Failed to fetch commentary: ${res.statusText}`);
  return res.json();
}

export function useCommentary(matchId: number) {
  const queryClient = useQueryClient();
  // Track newly added comment IDs for flash animation
  const newCommentIds = useRef(new Set<number>());

  const handleMessage = (msg: WsServerMessage) => {
    if (msg.event === "NEW_COMMENTARY") {
      const newComment = msg.data as Commentary;
      if (newComment.matchId !== matchId) return;

      // Track as "new" for animation
      newCommentIds.current.add(newComment.id);
      // Clear after animation duration
      setTimeout(() => newCommentIds.current.delete(newComment.id), 1500);

      queryClient.setQueryData<Commentary[]>(
        commentaryKey(matchId),
        (old = []) => {
          const exists = old.some((c) => c.id === newComment.id);
          if (exists) return old;
          // Prepend (backend returns desc, so new items go first)
          return [newComment, ...old];
        },
      );
    }
  };

  const {
    status: wsStatus,
    subscribe,
    unsubscribe,
  } = useWebSocket(handleMessage);

  // Subscribe/unsubscribe on mount/unmount
  useEffect(() => {
    // Subscribe when connected — handled in ws hook welcome event too
    subscribe(matchId);

    return () => {
      unsubscribe(matchId);
    };
  }, [matchId, subscribe, unsubscribe]);

  // Re-subscribe on reconnect
  useEffect(() => {
    if (wsStatus === "connected") {
      subscribe(matchId);
    }
  }, [wsStatus, matchId, subscribe]);

  const query = useQuery({
    queryKey: commentaryKey(matchId),
    queryFn: () => fetchCommentary(matchId),
    staleTime: 15_000,
    retry: 3,
  });

  const isNew = (id: number) => newCommentIds.current.has(id);

  return { ...query, wsStatus, isNew };
}
