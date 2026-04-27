import { useEffect, useRef, useCallback, useState } from 'react';
import type { ConnectionStatus, WsClientMessage, WsServerMessage } from '../types';

type MessageHandler = (msg: WsServerMessage) => void;

const WS_URL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;
const PING_INTERVAL = 25000;

// Singleton WebSocket instance shared across all components
let sharedWs: WebSocket | null = null;
let messageHandlers = new Set<MessageHandler>();
let reconnectAttempts = 0;
let pingTimer: ReturnType<typeof setInterval> | null = null;
let statusListeners = new Set<(status: ConnectionStatus) => void>();
let currentStatus: ConnectionStatus = 'disconnected';

function notifyStatus(status: ConnectionStatus) {
  currentStatus = status;
  statusListeners.forEach((fn) => fn(status));
}

function connectWs() {
  if (sharedWs && sharedWs.readyState === WebSocket.OPEN) return;
  if (sharedWs && sharedWs.readyState === WebSocket.CONNECTING) return;

  notifyStatus('connecting');

  try {
    sharedWs = new WebSocket(WS_URL);
  } catch {
    notifyStatus('error');
    scheduleReconnect();
    return;
  }

  sharedWs.onopen = () => {
    reconnectAttempts = 0;
    notifyStatus('connected');
    startPing();
  };

  sharedWs.onmessage = (evt) => {
    try {
      const msg = JSON.parse(evt.data) as WsServerMessage;
      messageHandlers.forEach((handler) => handler(msg));
    } catch {
      // Ignore malformed messages
    }
  };

  sharedWs.onclose = () => {
    stopPing();
    notifyStatus('disconnected');
    scheduleReconnect();
  };

  sharedWs.onerror = () => {
    notifyStatus('error');
  };
}

function scheduleReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;
  reconnectAttempts++;
  setTimeout(() => {
    if (messageHandlers.size > 0) connectWs();
  }, RECONNECT_DELAY * reconnectAttempts);
}

function startPing() {
  stopPing();
  pingTimer = setInterval(() => {
    if (sharedWs?.readyState === WebSocket.OPEN) {
      sharedWs.send(JSON.stringify({ action: 'PING' }));
    }
  }, PING_INTERVAL);
}

function stopPing() {
  if (pingTimer) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
}

export function sendWsMessage(msg: WsClientMessage) {
  if (sharedWs?.readyState === WebSocket.OPEN) {
    sharedWs.send(JSON.stringify(msg));
    return true;
  }
  return false;
}

/**
 * useWebSocket — shared, persistent WebSocket connection hook.
 * Multiple components can use this simultaneously; only one socket is created.
 */
export function useWebSocket(onMessage?: MessageHandler) {
  const [status, setStatus] = useState<ConnectionStatus>(currentStatus);
  const handlerRef = useRef<MessageHandler | undefined>(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    // Register status listener
    const statusListener = (s: ConnectionStatus) => setStatus(s);
    statusListeners.add(statusListener);

    // Register message handler wrapper
    const wrappedHandler: MessageHandler = (msg) => {
      handlerRef.current?.(msg);
    };

    if (onMessage) {
      messageHandlers.add(wrappedHandler);
    }

    // Connect if not already connected
    connectWs();

    return () => {
      statusListeners.delete(statusListener);
      if (onMessage) {
        messageHandlers.delete(wrappedHandler);
      }
      // If no more handlers, allow natural closure
      if (messageHandlers.size === 0) {
        stopPing();
        sharedWs?.close();
        sharedWs = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const subscribe = useCallback((matchId: number) => {
    const sent = sendWsMessage({ action: 'SUBSCRIBE', matchId });
    if (!sent) {
      // Queue subscription after reconnect
      const retryHandler: MessageHandler = (msg) => {
        if (msg.event === 'WELCOME') {
          sendWsMessage({ action: 'SUBSCRIBE', matchId });
          messageHandlers.delete(retryHandler);
        }
      };
      messageHandlers.add(retryHandler);
    }
  }, []);

  const unsubscribe = useCallback((matchId: number) => {
    sendWsMessage({ action: 'UNSUBSCRIBE', matchId });
  }, []);

  return { status, subscribe, unsubscribe };
}
