import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import useSocket from './socket/useSocket';
import { Redirect } from 'react-router-dom';
import useAuth from './auth/useAuth';

export interface RoomValues {
    roomId: string;
    password: string;
    options: object;
}

export default function Room() {
    const [action, setAction] = useState('join');
    const [error, setError] = useState(null);

    const { createSocket, initListeners } = useSocket();
    const { username } = useAuth();
    const [password, setPassword] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [available, setAvailable] = useState(false);

    const handleAuth = (data: RoomValues) => {
        setRoomId(data.roomId);
        setPassword(data.password);
        createSocket(username, data.roomId, data.password, action);
        initListeners(setAvailable, setError);
    };

    return (
        <>
            {!available && (
                <div className="p-3">
                    <Row>
                        <Col>
                            {action === 'join' && <JoinRoom handleAuth={handleAuth} />}
                        </Col>
                        <Col>
                            {action === 'create' && (
                                <CreateRoom handleAuth={handleAuth} />
                            )}
                        </Col>
                    </Row>
                    <br />

                    <Button
                        variant="light"
                        type="submit"
                        onClick={() =>
                            setAction(prevState =>
                                prevState === 'join' ? 'create' : 'join'
                            )
                        }
                    >
                        {`${action === 'join' ? 'Create New' : 'Join'} Room`}
                    </Button>
                </div>
            )}
            {available && (
                <Redirect
                    push
                    to={{
                        pathname: '/room',
                        search: `?roomId=${roomId}`,
                        state: { roomId, referrer: '/' },
                    }}
                />
            )}
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
