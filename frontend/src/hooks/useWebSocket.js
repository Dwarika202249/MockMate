import * as React from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
    const [isConnected, setIsConnected] = React.useState(false);
    const socketRef = React.useRef(null);

    React.useEffect(() => {
        // Get JWT token from localStorage
        const token = localStorage.getItem('token');
        
        // Initialize socket connection with auth token
        const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            // Pass JWT token in auth header
            auth: {
                token: token || ''
            }
        });

        // Connection event handlers
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('error', (error) => {
            console.error('WebSocket Error:', error);
        });

        // Store socket in ref
        socketRef.current = socket;

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const emit = React.useCallback((eventName, data) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(eventName, data);
        } else if (socketRef.current) {
            // Socket exists but not connected yet - retry with exponential backoff
            
            let retryCount = 0;
            const maxRetries = 10;
            const retryDelay = 200;
            
            const tryEmit = () => {
                if (socketRef.current?.connected) {
                    socketRef.current.emit(eventName, data);
                } else if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(tryEmit, retryDelay);
                } else {
                    console.error(`Failed to emit '${eventName}' after ${maxRetries} retries`);
                }
            };
            setTimeout(tryEmit, retryDelay);
        } else {
            console.error('Socket not available, cannot emit:', eventName);
        }
    }, [isConnected]);

    const subscribe = React.useCallback((eventName, callback) => {
        if (socketRef.current) {
            socketRef.current.on(eventName, callback);
            return () => socketRef.current?.off(eventName, callback);
        }
        return () => {};
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        emit,
        subscribe
    };
};