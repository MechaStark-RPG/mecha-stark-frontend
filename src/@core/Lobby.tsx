import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Row, Button } from 'react-bootstrap';

import JoinedPlayers from './JoinedPlayers';
import useSocket from './socket/useSocket';

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
    const { emit } = useSocket();
    const [isReady, setIsReady] = useState(false);
    const [isTurn, setIsTurn] = useState(false);
    const [playersJoined, setPlayerJoined] = useState<PlayerJoined[]>([]);
    const [currentCollectionId, setCurrentCollectionId] = useState('current-user');

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

    const switchCollection = playerId => {
        setCurrentCollectionId(playerId);
    };

    return (
        <>
            {!roomId && <Redirect to="/" />}
            <JoinedPlayers
                playersJoined={playersJoined}
                changeCollectionTo={switchCollection}
                onPlayerJoin={updatePlayers}
            />
            <Row className="mh-100 no-gutters">
                {!isReady && <PreDraft />}
                {isReady && <OnDraft />}

                <Col lg={3} md={6}>
                    <br />
                    <h4>
                        PASSWORD - <b>{password || 'none'}</b>{' '}
                    </h4>
                    <br />
                </Col>
            </Row>
            );
        </>
    );
}
