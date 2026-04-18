import { MatchData } from "../validations/matches";

export function getMatchStatus(
  startTime: MatchData["startTime"],
  endTime: MatchData["endTime"],
  now = new Date(),
) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || now < start) {
    return "scheduled";
  }

  if (now >= end) {
    return "finished";
  }

  return "live";
}
