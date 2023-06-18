import React, { useEffect, useState } from 'react';
import Socket from './useSocket';
import { initListeners } from '../initListiners';
import { Row, Col, Button } from 'react-bootstrap';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

export interface RoomValues {
    roomId: string;
    password: string;
    options: object;
}

export default function Room() {
    const [username, setUsername] = useState();
    const [socket, setSocket] = useState(null);
    const [password, setPassword] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [error, setError] = useState(null);
    const [available, setAvailable] = useState(false);
    const [action, setAction] = useState('join');

    const handleAuth = (data: RoomValues) => {
        // options -> only when action === 'create'
        const options = {};
        setRoomId(data.roomId);
        setPassword(data.password);
        const { socketInit } = Socket();
        setSocket(socketInit(username, roomId, password, action, options));
        initListeners(this, socket);
    };

    useEffect(() => {
        console.log('Arrancando Room');
    });

    useEffect(() => {
        if (socket != null) {
            socket.on('[SUCCESS] Successfully initialised', () => {
                console.log('[SUCCESS] Successfully initialised');
                setAvailable(true);
            });

            socket.on('Error: Incorrect password!', () => {
                console.log('Error: Incorrect password!');
                setError({
                    error: {
                        title: 'INCORRECT PASSWORD',
                        content: 'Sorry, incorrect password for the room. Try again',
                    },
                });
            });

            socket.on('Error: Create a room first!', () => {
                console.log('Error: Create a room first!');
                setError({
                    error: {
                        title: 'ROOM NOT FOUND',
                        content:
                            'Sorry, requested Room does not exist. Create a New Room or enter the correct ROOM ID',
                    },
                });
            });

            socket.on('Error: Room already created. Join the room!', () => {
                console.log('Error: Create a new room again or Join existing one!');
                setError({
                    error: {
                        title: 'ROOM ALREADY PRESENT',
                        content:
                            'Sorry, requested Room already present, Join the existing room or Create a new room again',
                    },
                });
            });
        }
    }, [socket]);

    return (
        <>
            <div className="p-3">
                <hr />
                <Row>
                    <Col>{action === 'join' && <JoinRoom changeAuth={handleAuth} />}</Col>
                    <Col>
                        {action === 'create' && <CreateRoom changeAuth={handleAuth} />}
                    </Col>
                </Row>
                <br />

                <Button
                    variant="light"
                    type="submit"
                    onClick={() =>
                        setAction(prevState => (prevState === 'join' ? 'create' : 'join'))
                    }
                >
                    {`${action === 'join' ? 'Create New' : 'Join'} Room`}
                </Button>
            </div>
        </>
    );
}

// <HyperLink
//   onClick={() =>
//     setAction(prevState => (prevState === 'join' ? 'create' : 'join'))
//   }
// >
//     {`${action === 'join' ? 'Create New' : 'Join'} Room`}
// </HyperLink>
