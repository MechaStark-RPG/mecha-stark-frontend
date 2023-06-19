import React, { useState } from 'react';
import { io, Socket as SocketIOClientSocket } from 'socket.io-client';

export interface SocketContextValue {
    socket: Socket;
    setSocket: React.Dispatch<React.SetStateAction<Socket>>;
}

export const SocketContext = React.createContext<SocketContextValue>(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export class Socket {
    connection: SocketIOClientSocket | null = null;

    static socketInit(username, roomId, password, action) {
        const token = 'Some token';
        const socketUrl = 'someUrl';
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

        const instance = new Socket();
        instance.connection = socket;

        return instance;
    }
}
