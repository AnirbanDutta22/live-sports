import { MatchData } from "../../validations/matches";
import { matchRepository } from "./match.repository";

export const matchService = {
  async createMatch(data: MatchData) {
    return await matchRepository.create(data);
  },
  async findMatch(limit: number) {
    return await matchRepository.find(limit);
  },
};
