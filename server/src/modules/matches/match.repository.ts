import { desc } from "drizzle-orm";
import { db } from "../../db";
import { matches } from "../../db/schema/match";
import { getMatchStatus } from "../../utils/match-status";
import { MatchData } from "../../validations/matches";

export const matchRepository = {
  // CREATE
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

  // GET
  async find(limit: number) {
    const result = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);

    return result;
  },
};
