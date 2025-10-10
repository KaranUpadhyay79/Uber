
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`); // Replace with your server URL

const SocketProvider = ({ children }) => {
    useEffect(() => {
        // Basic connection logic
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // return () => {
        //     socket.disconnect();
        // }
 
    }, []);

    const sendMessage = (eventName , message) => {
        // If socket not connected yet, wait for connect and send once
        if (!socket || !socket.connected) {
            socket.once('connect', () => {
                console.log('Socket connected — emitting queued event', eventName);
                socket.emit(eventName, message);
            });
        } else {
            socket.emit(eventName, message);
        }
    }

    const receiveMessage = (eventName, callback) => {
        // Remove any previous handler to avoid duplicates, then attach
        try {
            socket.off(eventName);
        } catch (e) {
            // ignore if off not available yet
        }
        socket.on(eventName, callback);
    };

    return (
        <SocketContext.Provider value={{ socket ,sendMessage, receiveMessage}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;