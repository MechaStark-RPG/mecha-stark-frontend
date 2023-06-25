import React, { useState, CSSProperties, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Col, Row, Button, Container } from "react-bootstrap";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import JoinedPlayers from "./JoinedPlayers";
import useSocket from "./socket/useSocket";

import { Turn } from "./logic/GameState";
import GameContainer from "../components/GameContainer";

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
  const [playersJoined, setPlayerJoined] = useState<PlayerJoined[]>([]);
  // Is ready to start the game
  const [gameIsReady, setGameIsReady] = useState(false);
  // Actual turn
  const [turn, setTurn] = useState<Turn>();
  const [sentTurn, setSentTurn] = useState(false);
  // Actual player has the turn
  const [isTurn, setIsTurn] = useState(false);

  subscribeTo.personalTurnStart(() => {
    setIsTurn(true);
  });

  subscribeTo.personalTurnEnd(() => {
    setIsTurn(false);
    setTurn(null);
    setSentTurn(false);
  });

  // Review this...
  useEffect(() => {
    const handleDraftStart = () => {
      setGameIsReady(true);
    };
    subscribeTo.draftStart(handleDraftStart);
  }, [playersJoined]);

  //
  useEffect(() => {
    if (sentTurn && turn) {
      emit.playerTurnPass(turn);
    }
  }, [turn, sentTurn]);

  const PreDraft = () => {
    const message = isReady ? "WAITING FOR OTHERS..." : "YOU READY?";
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

  const handleEndTurn = event => {
    event.preventDefault();
    setSentTurn(true);
  };

  const OnDraft = () => {
    return (
      <div>
        <Button
          style={{ fontSize: 16, margin: 4 }}
          disabled={!isTurn}
          onClick={handleEndTurn}
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

  return (
    <div>
      <div>
        {gameIsReady ? (
          <GameContainer
            playersJoined={playersJoined}
            isTurn={isTurn}
            setTurn={setTurn}
            sentTurn={sentTurn}
          />
        ) : (
          <Button style={{ fontSize: 32, margin: 4 }} disabled>
            Game is not started
          </Button>
        )}
      </div>
      <div style={turnMenu}>
        <JoinedPlayers
          playersJoined={playersJoined}
          onPlayerJoin={updatePlayers}
        />
        {!isReady && <PreDraft />}
        {isReady && <OnDraft />}
      </div>
    </div>
  );
}

const turnMenu: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "20%",
  height: "20%",
  zIndex: 1
};
