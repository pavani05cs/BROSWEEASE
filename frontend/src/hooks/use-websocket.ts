import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketOptions {
  url: string;
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  lastMessage: MessageEvent | null;
  readyState: number;
  connectionStatus: 'connecting' | 'open' | 'closing' | 'closed';
}

export function useWebSocket({
  url,
  onOpen,
  onClose,
  onError,
  autoReconnect = true,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: WebSocketOptions): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getConnectionStatus = (): 'connecting' | 'open' | 'closing' | 'closed' => {
    switch (readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'open';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'closed';
    }
  };

  const connect = useCallback(() => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    webSocketRef.current = new WebSocket(url);
    setReadyState(WebSocket.CONNECTING);

    webSocketRef.current.onopen = (event) => {
      setReadyState(WebSocket.OPEN);
      reconnectAttemptsRef.current = 0;
      if (onOpen) onOpen(event);
    };

    webSocketRef.current.onmessage = (event) => {
      setLastMessage(event);
    };

    webSocketRef.current.onclose = (event) => {
      setReadyState(WebSocket.CLOSED);
      if (onClose) onClose(event);

      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, reconnectInterval);
      }
    };

    webSocketRef.current.onerror = (event) => {
      if (onError) onError(event);
    };
  }, [url, onOpen, onClose, onError, autoReconnect, reconnectInterval, maxReconnectAttempts]);

  const sendMessage = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (webSocketRef.current?.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(data);
      }
    },
    []
  );

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [connect]);

  useEffect(() => {
    if (webSocketRef.current) {
      setReadyState(webSocketRef.current.readyState);
    }
  }, [lastMessage]);

  return {
    sendMessage,
    lastMessage,
    readyState,
    connectionStatus: getConnectionStatus(),
  };
}

export default useWebSocket;