// hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from "react";

export default function useWebSocket(url, onMessage, options = {}) {
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const isMountedRef = useRef(false);

    // ✅ keep latest callbacks in refs (prevents reconnect on re-render)
    const onMessageRef = useRef(onMessage);
    const optionsRef = useRef(options);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const connect = useCallback(() => {
        if (!url || !isMountedRef.current) return;

        // Prevent multiple connections
        if (
            wsRef.current?.readyState === WebSocket.OPEN ||
            wsRef.current?.readyState === WebSocket.CONNECTING
        ) {
            return;
        }

        const {
            onOpen,
            onClose,
            onError,
            reconnectDelay = 2000,
            maxReconnectAttempts = Infinity,
            shouldReconnect = true,
        } = optionsRef.current || {};

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            reconnectAttemptsRef.current = 0;
            onOpen?.();
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessageRef.current?.(data);
            } catch (err) {
                // keep this quiet-ish; malformed events shouldn’t crash the socket
                console.log("WS parse error:", err?.message);
            }
        };

        ws.onerror = (err) => {
            onError?.(err);
        };

        ws.onclose = (event) => {
            wsRef.current = null;
            onClose?.(event);

            if (
                shouldReconnect &&
                isMountedRef.current &&
                reconnectAttemptsRef.current < maxReconnectAttempts
            ) {
                reconnectAttemptsRef.current += 1;

                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, reconnectDelay);
            }
        };
    }, [url]);

    useEffect(() => {
        isMountedRef.current = true;
        connect();

        return () => {
            isMountedRef.current = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            if (wsRef.current) {
                try {
                    wsRef.current.close();
                } catch { }
                wsRef.current = null;
            }
        };
    }, [connect]);

    const reconnect = useCallback(() => {
        reconnectAttemptsRef.current = 0;
        try {
            wsRef.current?.close();
        } catch { }
        connect();
    }, [connect]);

    return { wsRef, reconnect };
}
