import { z } from "zod";

export const createCommentarySchema = z.object({
  matchId: z.number().int().positive(),
  minute: z.number().int().min(0).optional(),
  sequence: z.number().int().optional(),
  period: z.string().optional(),
  eventType: z.string().optional(), // e.g., "goal", "yellow_card", "substitution"
  actor: z.string().optional(),
  team: z.string().optional(),
  message: z.string().min(1, "Commentary message cannot be empty"),
  metadata: z.record(z.string(), z.any()).optional(), // For the jsonb field
  tags: z.array(z.string()).optional(),
});

export type CreateCommentaryInput = z.infer<typeof createCommentarySchema>;
