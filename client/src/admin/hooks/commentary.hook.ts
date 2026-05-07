import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api";
import type { CreateCommentaryPayload } from "../api";

export function useAdminCommentary(matchId: number) {
  return useQuery({
    queryKey: ["admin", "commentary", matchId],
    queryFn: () => adminApi.getCommentary(matchId),
    enabled: matchId > 0,
    staleTime: 10_000,
  });
}

export function useCreateCommentary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentaryPayload) =>
      adminApi.createCommentary(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["admin", "commentary", variables.matchId],
      });
      qc.invalidateQueries({ queryKey: ["commentary", variables.matchId] });
    },
  });
}
