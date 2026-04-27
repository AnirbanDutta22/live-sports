import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

// Extend the WebSocket type to include our custom property
interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  subscribedMatches: Set<number>; // Store multiple match IDs if they follow many
}

export class SocketService {
  private static wss: WebSocketServer;

  // This initializes the WS server on top of the HTTP server
  static init(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
      maxPayload: 1 * 1024 * 1024,
    });

    this.wss.on("connection", (socket: ExtendedWebSocket) => {
      socket.isAlive = true; // Initialize status
      socket.subscribedMatches = new Set(); // Initialize empty subscription set

      // Listen for the "pong" reply from the client
      socket.on("pong", () => {
        socket.isAlive = true;
      });

      console.log("New client connected to live updates");

      // --- HANDLE INCOMING SUBSCRIPTION MESSAGES ---
      socket.on("message", (rawMessage: string) => {
        try {
          const { action, matchId } = JSON.parse(rawMessage.toString());

          if (action === "SUBSCRIBE" && matchId) {
            socket.subscribedMatches.add(Number(matchId));
            console.log(`Client subscribed to match: ${matchId}`);
          }

          if (action === "UNSUBSCRIBE" && matchId) {
            socket.subscribedMatches.delete(Number(matchId));
            console.log(`Client unsubscribed from match: ${matchId}`);
          }
        } catch (error) {
          console.error("Invalid socket message format");
        }
      });
    });

    // Start the "Heartbeat" interval
    this.setupHeartbeat();
  }

  // --- TARGETED BROADCAST ---
  static broadcastToMatch(matchId: number, event: string, data: any) {
    if (!this.wss) return;

    const payload = JSON.stringify({ event, matchId, data });

    this.wss.clients.forEach((client: any) => {
      const socket = client as ExtendedWebSocket;

      // Only send if the client is connected AND subscribed to this specific match
      if (
        socket.readyState === WebSocket.OPEN &&
        socket.subscribedMatches.has(matchId)
      ) {
        socket.send(payload);
      }
    });
  }

  // Use this broadcast method anywhere in your app (like Services) to send updates
  static broadcastAll(event: string, data: any) {
    if (!this.wss) return;

    const payload = JSON.stringify({ event, data });
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

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
}
