import { db } from "../../db";
import { commentary } from "../../db/schema/commentary";
import { eq, desc, asc } from "drizzle-orm";
import { CreateCommentaryInput } from "../../validations/commentaries";

export const commentaryRepository = {
  async create(data: CreateCommentaryInput) {
    const [newComment] = await db.insert(commentary).values(data).returning();
    return newComment;
  },

  async getByMatchId(matchId: number) {
    return await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      // Get the latest commentary first
      .orderBy(desc(commentary.createdAt), desc(commentary.sequence));
  },
};
