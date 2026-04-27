import { Request, Response } from "express";
import { createCommentarySchema } from "../../validations/commentaries";
import { commentaryService } from "./commentary.service";

export const commentaryController = {
  async create(req: Request, res: Response) {
    const parsed = createCommentarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    try {
      const comment = await commentaryService.addCommentary(parsed.data);
      res.status(201).json(comment);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to add commentary" });
    }
  },

  async getForMatch(req: Request, res: Response) {
    const matchId = parseInt(req.params.matchId as string);
    if (isNaN(matchId))
      return res.status(400).json({ error: "Invalid match ID" });

    try {
      const comments = await commentaryService.getMatchCommentary(matchId);
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch commentary" });
    }
  },
};
