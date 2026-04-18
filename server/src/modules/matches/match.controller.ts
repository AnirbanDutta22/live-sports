import { Request, Response } from "express";
import {
  createMatchSchema,
  listQueryMatchesSchema,
} from "../../validations/matches";
import { matchService } from "./match.service";

const MAX_LIMIT = 100;

export const matchController = {
  async create(req: Request, res: Response) {
    // Parse the body using Zod
    const parsed = createMatchSchema.safeParse(req.body);

    if (!parsed.success) {
      // Use flatten() to get errors grouped by field name
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return res.status(400).json({
        error: "Invalid Payload",
        details: fieldErrors,
      });
    }

    try {
      const match = await matchService.createMatch(parsed.data);
      res.status(201).json(match);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to create match", details: error.message });
    }
  },
  async find(req: Request, res: Response) {
    const parsed = listQueryMatchesSchema.safeParse(req.query);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return res.status(400).json({
        error: "Invalid query",
        details: fieldErrors,
      });
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

    try {
      const matches = await matchService.findMatch(limit);
      res.status(200).json(matches);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to list matches", details: error.message });
    }
  },
};
