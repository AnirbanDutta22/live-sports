import express from "express";
import matchRoutes from "./modules/matches/match.routes";

const app = express();

app.use(express.json());

app.use("/api/matches", matchRoutes);

export default app;
