import { createServer } from "http";
import app from "./app";
import dotenv from "dotenv";
import { SocketService } from "./sockets/socket.service";

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

SocketService.init(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Websocket running on http://localhost:${PORT}/ws`);
});
