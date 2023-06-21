import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Row, Button, Container } from 'react-bootstrap';

import JoinedPlayers from './JoinedPlayers';
import useSocket from './socket/useSocket';
import MechaRPGLogic from '../MechaRPGLogic';
import { Mecha, Player, InitState } from './logic/GameState';

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
    const [gameIsReady, setGameIsReady] = useState(false);
    const [initState, setInitState] = useState<InitState>(null);

    const getInitState = pJoined => {
        // TODO: Le esta llegando pJoined

        const mecha1: Mecha = ({
            idOwner: 'Santieight',
            id: 87,
            position: { x: 10, y: 6 },
            hp: 200,
            hpTotal: 200,
            attack: 20,
            armor: 5,
            isReady: false,
        } as unknown) as Mecha;

        const mecha2: Mecha = ({
            idOwner: 'Damistone',
            id: 73,
            position: { x: 16, y: 8 },
            hp: 150,
            hpTotal: 150,
            attack: 10,
            armor: 5,
            isReady: false,
        } as unknown) as Mecha;

        const players: Player[] = [
            ({
                id: 1997,
                username: 'Santieight',
            } as unknown) as Player,
            ({
                id: 1995,
                username: 'Damistone',
            } as unknown) as Player,
        ];

        players[0].mechas = [mecha1];
        players[1].mechas = [mecha2];

        const state = ({
            players,
        } as unknown) as InitState;

        setInitState(state);
        setGameIsReady(true);
    };

    subscribeTo.personalTurnStart(() => {
        setIsTurn(true);
    });

    subscribeTo.personalTurnEnd(() => {
        setIsTurn(false);
    });

    useEffect(() => {
        const handleDraftStart = () => {
            getInitState(playersJoined);
        };
        subscribeTo.draftStart(handleDraftStart);
    }, [playersJoined]);

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
                        {gameIsReady ? (
                            <MechaRPGLogic initState={initState} isTurn={isTurn} />
                        ) : (
                            <Button style={{ fontSize: 32, margin: 4 }} disabled>
                                Game is not started
                            </Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
