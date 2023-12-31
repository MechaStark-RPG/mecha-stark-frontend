import React, { useEffect, useState, CSSProperties } from 'react';
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
    const { walletData } = useAuth();
    const [password, setPassword] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [available, setAvailable] = useState(false);

    const handleAuth = (data: RoomValues) => {
        setRoomId(data.roomId);
        setPassword(data.password);
        createSocket(walletData.walletAddress, roomId, password, action);
        initListeners(setAvailable, setError);
    };

    return (
        <>
            {!available && (
                <div className="p-3">
                    <Row>
                        <Col>
                            {action === 'join' && <JoinRoom walletData={walletData} handleAuth={handleAuth} />}
                        </Col>
                        <Col>
                            {action === 'create' && (
                                <CreateRoom walletData={walletData} handleAuth={handleAuth} />
                            )}
                        </Col>
                    </Row>
                    <br />

                    <Button
                        style={flags}
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

const flags: CSSProperties = {
    font: 'Roboto',
    textAlign: 'center',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    paddingTop: '2%',
    fontSize: '16px',
    color: 'white',
    padding: '12px 20px 12px 20px',
    backgroundSize: '20px 20px',
    backgroundPosition: '10px 10px',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'rgba(21, 161, 222, 0.9)',
    marginLeft: '1%',
    marginRight: '1%',
    marginBottom: '1%',
    marginTop: '1%',
    overflow: 'hidden',
  }

