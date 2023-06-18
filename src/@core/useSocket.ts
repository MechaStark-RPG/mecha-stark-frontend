import { io } from 'socket.io-client';

export default function Socket() {
    const socketInit = (username, roomId, password, action, options) => {
        const token = 'Some token';
        const sockerUrl = 'someUrl';
        const socket = io(`${sockerUrl}`, {
            path: '/classic-mode',
            transports: ['websocket'],
            query: {
                username,
                roomId,
                password,
                action,
                token,
                options: options && JSON.stringify(options),
            },
        });

        return socket;
    };

    return {
        socketInit,
    };
}
