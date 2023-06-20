import React from 'react';

import useSocket from './socket/useSocket';
import { PlayerJoined } from './Lobby';
import { Badge, ListGroup, ListGroupItem } from 'react-bootstrap';

interface JoinedPlayersProps {
    playersJoined: PlayerJoined[];
    onPlayerJoin: (players: string[]) => void;
}

export default function JoinedPlayers({
    playersJoined,
    onPlayerJoin,
}: JoinedPlayersProps) {
    const { subscribeTo } = useSocket();

    subscribeTo.showPlayers((err, psJoined) => {
        onPlayerJoin(psJoined);
    });

    console.log(`[DEBUG] PLAYERS JOINED ARE: ${JSON.stringify(playersJoined)}`);

    return (
        <ListGroup>
            {playersJoined.map((playerInfo, index) => {
                return (
                    <ListGroupItem key={playerInfo.id}>
                        <Badge bg="secondary">{playerInfo.username}</Badge>

                        {playerInfo.isReady ? (
                            <Badge bg="success">Ready</Badge>
                        ) : (
                            <Badge bg="danger">Not ready</Badge>
                        )}
                    </ListGroupItem>
                );
            })}
        </ListGroup>
    );
}
