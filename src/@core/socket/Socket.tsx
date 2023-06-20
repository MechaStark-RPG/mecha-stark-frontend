import React, { useState } from 'react';
import { io, Socket as SocketIOClientSocket } from 'socket.io-client';
import { socketUrl } from '../../env';

export class Socket {
    connection: SocketIOClientSocket | null = null;

    socketInit(username, roomId, password, action) {
        const token = 'example-jwt-secret';
        const socket = io(`${socketUrl}`, {
            path: '/classic-mode',
            transports: ['websocket'],
            query: {
                username,
                roomId,
                password,
                action,
                token,
            },
        });
        this.connection = socket;
    }
}

export interface SocketContextValue {
    socket: Socket;
    setSocket: React.Dispatch<React.SetStateAction<Socket>>;
}

export const SocketContext = React.createContext<SocketContextValue>(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(new Socket());

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
