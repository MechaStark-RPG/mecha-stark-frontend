import { useContext } from 'react';
import { Socket, SocketContext, SocketContextValue } from './Socket';

export default function useSocket() {
    const { socket, setSocket } = useContext(SocketContext) as SocketContextValue;

    const createSocket = (username, roomId, password, action) => {
        if (socket != null) {
            setSocket(Socket.socketInit(username, roomId, password, action));
        }
    };

    const initListeners = (setAvailable, setError) => {
        socket.connection.on(
            '[SUCCESS] Successfully initialised',
            ({ roomId, password, options }) => {
                console.log('[SUCCESS] Successfully initialised');
                setAvailable(true);
            }
        );

        socket.connection.on('Error: Incorrect password!', () => {
            console.log('Error: Incorrect password!');
            setError({
                error: {
                    title: 'INCORRECT PASSWORD',
                    content: 'Sorry, incorrect password for the room. Try again',
                },
            });
        });

        socket.connection.on('Error: Create a room first!', () => {
            console.log('Error: Create a room first!');
            setError({
                error: {
                    title: 'ROOM NOT FOUND',
                    content:
                        'Sorry, requested Room does not exist. Create a New Room or enter the correct ROOM ID',
                },
            });
        });

        socket.connection.on('Error: Room already created. Join the room!', () => {
            console.log('Error: Create a new room again or Join existing one!');
            setError({
                error: {
                    title: 'ROOM ALREADY PRESENT',
                    content:
                        'Sorry, requested Room already present, Join the existing room or Create a new room again',
                },
            });
        });
    };

    const subscribeTo = {
        showPlayers: cb => {
            socket.connection.on('show-players-joined', data =>
                cb(null, data.playersJoined)
            );
        },

        playerCollections: cb => {
            socket.connection.on('show-players-teams', data => cb(null, data.teams));
        },

        myTurnStart: cb => {
            socket.connection.on('personal-turn-start', message => {
                console.log(message);
                cb(null, message);
            });
        },

        playerTurnStart: cb => {
            socket.connection.on('player-turn-start', message => {
                console.log(message);
                cb(null, message);
            });
        },

        personalTurnEnd: cb => {
            socket.connection.on('personal-turn-end', message => {
                console.log(message);
                cb(null, message);
            });
        },

        playerTurnEnd: cb => {
            socket.connection.on('player-turn-end', message => {
                console.log(message);
                cb(null, message);
            });
        },

        draftStart: cb => {
            socket.connection.on('draft-start', message => {
                console.log(message);
                cb(null, message);
            });
        },

        draftEnd: cb => {
            socket.connection.on('draft-end', message => {
                console.log(message);
                cb(null, message);
            });
        },
    };

    const emit = {
        playerReady: () => {
            socket.connection.emit('is-ready');
        },

        playerTurnPass: turn => {
            socket.connection.emit('player-turn-pass', turn);
        },

        closeConnection: () => {
            socket.connection.close();
        },
    };

    return {
        socket,
        createSocket,
        initListeners,
        subscribeTo,
        emit,
    };
}
