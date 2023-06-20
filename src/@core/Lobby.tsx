import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Row, Button, Container } from 'react-bootstrap';

import JoinedPlayers from './JoinedPlayers';
import useSocket from './socket/useSocket';
import GameApp from '../GameApp';

interface LobbyProps {
    roomId: string;
    password: string;
}

export type PlayerJoined = {
    id: string;
    isReady: boolean;
    username: string;
};

export default function Lobby({ roomId, password }: LobbyProps) {
    const { emit, subscribeTo } = useSocket();
    const [isReady, setIsReady] = useState(false);
    const [isTurn, setIsTurn] = useState(false);
    const [playersJoined, setPlayerJoined] = useState<PlayerJoined[]>([]);

    subscribeTo.personalTurnStart(() => {
        setIsTurn(true);
    });

    subscribeTo.personalTurnEnd(() => {
        setIsTurn(false);
    });

    const PreDraft = () => {
        const message = isReady ? 'WAITING FOR OTHERS...' : 'YOU READY?';
        return (
            <Button
                style={{ fontSize: 32, margin: 4 }}
                disabled={isReady}
                onClick={() => {
                    emit.playerReady();
                    setIsReady(true);
                }}
            >
                {message}
            </Button>
        );
    };

    const OnDraft = () => {
        return (
            <div>
                <Button
                    style={{ fontSize: 16, margin: 4 }}
                    disabled={!isTurn}
                    onClick={() => {
                        emit.playerTurnPass('Data del turno...');
                    }}
                >
                    <div>
                        <span style={{ fontSize: 24 }}>
                            END TURN <br />
                        </span>
                    </div>
                </Button>
            </div>
        );
    };

    const updatePlayers = psJoined => {
        setPlayerJoined(psJoined);
    };

    //           {!roomId && <Redirect to="/" />}
    return (
        <>
            <Container fluid>
                <Row>
                    <Col
                        xs={12}
                        md={3}
                        className="d-flex flex-column"
                        style={{ height: '100vh' }}
                    >
                        <JoinedPlayers
                            playersJoined={playersJoined}
                            onPlayerJoin={updatePlayers}
                        />
                        {!isReady && <PreDraft />}
                        {isReady && <OnDraft />}
                    </Col>
                    <Col
                        xs={12}
                        md={9}
                        className="d-flex flex-column"
                        style={{ height: '100vh' }}
                    >
                        <GameApp />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
