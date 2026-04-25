import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

export class SocketService {
  private static wss: WebSocketServer;

  // Every 30 seconds, check all clients
  private static setupHeartbeat() {
    const interval = setInterval(() => {
      this.wss.clients.forEach((socket: any) => {
        if (socket.isAlive === false) {
          console.log("Terminating dead connection");
          return socket.terminate();
        }

        socket.isAlive = false; // Assume dead until they pong back
        socket.ping(); // Send the ping
      });
    }, 30000);

    this.wss.on("close", () => clearInterval(interval));
  }

  // This initializes the WS server on top of the HTTP server
  static init(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
      maxPayload: 1 * 1024 * 1024,
    });

    this.wss.on("connection", (socket: any) => {
      socket.isAlive = true; // Initialize status

      // Listen for the "pong" reply from the client
      socket.on("pong", () => {
        socket.isAlive = true;
      });

      console.log("New client connected to live updates");

      socket.on("message", (message: string) => {
        // Handle incoming messages from client here
        console.log("Received:", message.toString());
      });
    });

    // Start the "Heartbeat" interval
    this.setupHeartbeat();
  }

  // Use this broadcast method anywhere in your app (like Services) to send updates
  static broadcast(event: string, data: any) {
    if (!this.wss) return;

    const payload = JSON.stringify({ event, data });
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}
