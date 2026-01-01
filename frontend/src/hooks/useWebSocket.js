import * as React from 'react';
import { io } from 'socket.io-client';

// Debug: confirm React import shape at runtime
console.log('useWebSocket init: React present?', !!React, 'React.useState type:', typeof React.useState);

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
            console.log('WebSocket Connected');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('WebSocket Disconnected');
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
        console.log(`emit() called for '${eventName}', isConnected: ${isConnected}, socketRef: ${!!socketRef.current}`);
        if (socketRef.current && isConnected) {
            console.log(`emitting '${eventName}' with data:`, data);
            socketRef.current.emit(eventName, data);
        } else if (socketRef.current) {
            // Socket exists but not connected yet - retry with exponential backoff
            console.warn(`Socket not connected yet for '${eventName}', will retry...`);
            
            let retryCount = 0;
            const maxRetries = 10;
            const retryDelay = 200;
            
            const tryEmit = () => {
                if (socketRef.current?.connected) {
                    console.log(`Socket now connected, emitting '${eventName}'`);
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
        console.log(`subscribe() called for '${eventName}'`);
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