import { SocketService } from "../../sockets/socket.service";
import { MatchData } from "../../validations/matches";
import { matchRepository } from "./match.repository";

export const matchService = {
  async createMatch(data: MatchData) {
    const newMatch = await matchRepository.create(data);

    // NOTIFY EVERYONE!
    SocketService.broadcast("MATCH_CREATED", newMatch);

    return newMatch;
  },
  async findMatch(limit: number) {
    return await matchRepository.find(limit);
  },
};
