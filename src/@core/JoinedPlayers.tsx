import React from 'react';

import useSocket from './socket/useSocket';
import { PlayerJoined } from './Lobby';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

interface JoinedPlayersProps {
    playersJoined: PlayerJoined[];
    onPlayerJoin: (players: string[]) => void;
    changeCollectionTo: (string: string) => void;
}

export default function JoinedPlayers({
    playersJoined,
    onPlayerJoin,
    changeCollectionTo,
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
                    <ListGroupItem
                        key={playerInfo.id}
                        onClick={() => {
                            changeCollectionTo(playerInfo.id);
                        }}
                    >
                        {playerInfo.username}
                        {playerInfo.isReady ? 'READY' : 'NOT READY'}
                    </ListGroupItem>
                );
            })}
        </ListGroup>
    );
}
