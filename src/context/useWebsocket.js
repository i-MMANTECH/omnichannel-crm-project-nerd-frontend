// hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';

export default function useWebSocket(url, onMessage, options = {}) {
    const {
        onOpen,
        onClose,
        onError,
        reconnectDelay = 2000,
        maxReconnectAttempts = Infinity,
        shouldReconnect = true
    } = options;

    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const isMountedRef = useRef(true);

    const connect = useCallback(() => {
        if (!url || !isMountedRef.current) return;

        // Prevent multiple connections
        if (wsRef.current?.readyState === WebSocket.OPEN ||
            wsRef.current?.readyState === WebSocket.CONNECTING) {
            console.log('🔒 WebSocket already connected or connecting');
            return;
        }

        console.log('🔌 Connecting to WebSocket:', url);

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('✅ WebSocket connected');
            reconnectAttemptsRef.current = 0; // Reset reconnect attempts on success
            if (onOpen) onOpen();
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 WebSocket message received:', data.type || 'unknown type');
                onMessage(data);
            } catch (error) {
                console.error('❌ WebSocket JSON parse error:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            if (onError) onError(error);
        };

        ws.onclose = (event) => {
            console.log('🔄 WebSocket disconnected:', {
                code: event.code,
                reason: event.reason,
                wasClean: event.wasClean
            });

            wsRef.current = null;

            if (onClose) onClose(event);

            // Auto-reconnect logic
            if (shouldReconnect &&
                isMountedRef.current &&
                reconnectAttemptsRef.current < maxReconnectAttempts) {

                reconnectAttemptsRef.current++;
                console.log(`🔄 Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);

                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, reconnectDelay);
            } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                console.log('❌ Max reconnection attempts reached');
            }
        };
    }, [url, onMessage, onOpen, onClose, onError, reconnectDelay, maxReconnectAttempts, shouldReconnect]);

    useEffect(() => {
        isMountedRef.current = true;
        connect();

        return () => {
            console.log('🔌 Cleaning up WebSocket connection...');
            isMountedRef.current = false;

            // Clear reconnection timeout
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            // Close WebSocket
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [connect]);

    // Expose manual reconnect function
    const reconnect = useCallback(() => {
        console.log('🔄 Manual reconnection triggered');
        if (wsRef.current) {
            wsRef.current.close();
        }
        reconnectAttemptsRef.current = 0;
        connect();
    }, [connect]);

    return { wsRef, reconnect };
}