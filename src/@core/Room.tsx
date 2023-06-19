import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import useSocket from './socket/useSocket';

export interface RoomValues {
    roomId: string;
    password: string;
    options: object;
}

export default function Room() {
    const { createSocket, initListeners } = useSocket();
    const [username, setUsername] = useState();
    const [socket, setSocket] = useState(null);
    const [password, setPassword] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [error, setError] = useState(null);
    const [available, setAvailable] = useState(false);
    const [action, setAction] = useState('join');

    const handleAuth = (data: RoomValues) => {
        setRoomId(data.roomId);
        setPassword(data.password);
        createSocket(username, roomId, password, action);
        initListeners(setAvailable, setError);
    };

    useEffect(() => {
        console.log('Arrancando Room');
    });

    return (
        <>
            <div className="p-3">
                <hr />
                <Row>
                    <Col>{action === 'join' && <JoinRoom handleAuth={handleAuth} />}</Col>
                    <Col>
                        {action === 'create' && <CreateRoom handleAuth={handleAuth} />}
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
