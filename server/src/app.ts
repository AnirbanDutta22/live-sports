import express from "express";
import matchRoutes from "./modules/matches/match.routes";
import commentaryRoutes from "./modules/commentaries/commentary.route";

const app = express();

app.use(express.json());

app.use("/api/matches", matchRoutes);
app.use("/api/commentary", commentaryRoutes);

export default app;
