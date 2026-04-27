import { commentaryRepository } from "./commentary.repository";
import { CreateCommentaryInput } from "../../validations/commentaries";
import { SocketService } from "../../sockets/socket.service";

export const commentaryService = {
  async addCommentary(data: CreateCommentaryInput) {
    const newComment = await commentaryRepository.create(data);

    // Targeted Broadcast!
    // Only people subscribed to this matchId will get the update.
    SocketService.broadcastToMatch(data.matchId, "NEW_COMMENTARY", newComment);

    return newComment;
  },

  async getMatchCommentary(matchId: number) {
    return await commentaryRepository.getByMatchId(matchId);
  },
};
