import { SocketService } from "../../sockets/socket.service";
import { MatchData, ScoreData } from "../../validations/matches";
import { matchRepository } from "./match.repository";

export const matchService = {
  async createMatch(data: MatchData) {
    const newMatch = await matchRepository.create(data);

    // NOTIFY EVERYONE!
    SocketService.broadcastAll("MATCH_CREATED", newMatch);

    return newMatch;
  },
  async findMatch(limit: number) {
    return await matchRepository.find(limit);
  },
  async findOneMatch(matchId: number) {
    return await matchRepository.findOne(matchId);
  },
  async updateMatchScore(data: ScoreData) {
    const updatedScore = await matchRepository.updateScore(data);

    // NOTIFY
    SocketService.broadcastToMatch(
      updatedScore.matchId,
      "SCORE_UPDATED",
      updatedScore,
    );

    return updatedScore;
  },
};
