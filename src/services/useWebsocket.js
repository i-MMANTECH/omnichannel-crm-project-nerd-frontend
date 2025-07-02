import { useEffect, useRef } from 'react';

export default function useWebSocket(url, onMessage, onOpen, onClose, onError) {
    const wsRef = useRef(null);

    useEffect(() => {
        if (!url) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            // console.log("WebSocket connected");
            if (onOpen) onOpen();
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error("WebSocket JSON parse error", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error", error);
            if (onError) onError(error);
        };

        ws.onclose = () => {
            // console.log("WebSocket closed");
            if (onClose) onClose();
        };

        return () => {
            ws.close();
        };
    }, [url]);

    return wsRef;
}
