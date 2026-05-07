import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api";
import type {
  CreateMatchPayload,
  UpdateMatchPayload,
  UpdateScorePayload,
} from "../api";

export function useAdminMatches() {
  return useQuery({
    queryKey: ["admin", "matches"],
    queryFn: () => adminApi.getMatches(50),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useAdminMatch(id: number) {
  return useQuery({
    queryKey: ["admin", "match", id],
    queryFn: () => adminApi.getMatch(id),
    enabled: id > 0,
    staleTime: 10_000,
  });
}

export function useCreateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMatchPayload) => adminApi.createMatch(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "matches"] });
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useUpdateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMatchPayload) => adminApi.updateMatch(payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["admin", "matches"] });
      qc.invalidateQueries({ queryKey: ["admin", "match", updated.id] });
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useUpdateScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateScorePayload) => adminApi.updateScore(payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["admin", "matches"] });
      qc.invalidateQueries({ queryKey: ["admin", "match", updated.id] });
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useDeleteMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteMatch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "matches"] });
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
