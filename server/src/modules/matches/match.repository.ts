import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { matches } from "../../db/schema/match";
import { getMatchStatus } from "../../utils/match-status";
import { MatchData, ScoreData } from "../../validations/matches";

export const matchRepository = {
  // CREATE A MATCH
  async create(data: MatchData) {
    const { startTime, endTime, homeScore, awayScore } = data;

    const [result] = await db
      .insert(matches)
      .values({
        ...data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    return result;
  },

  // GET ALL MATCH
  async find(limit: number) {
    const result = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);

    return result;
  },

  // GET A MATCH
  async findOne(matchId: number) {
    const [result] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId));

    return result;
  },

  // UPDATE SCORE
  async updateScore(data: ScoreData) {
    const { matchId, homeScore, awayScore } = data;

    const [result] = await db
      .update(matches)
      .set({ homeScore, awayScore })
      .where(eq(matches.id, matchId))
      .returning();

    return { matchId: result.id, homeScore, awayScore };
  },
};
