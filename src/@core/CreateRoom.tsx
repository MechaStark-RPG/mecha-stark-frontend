import React, { useState, CSSProperties } from 'react';

import {
    Form,
    FormControl,
    InputGroup,
    Button,
    Container,
    Row,
    Col,
} from 'react-bootstrap';
import { RoomValues } from './Room';

interface CreateMenuRoomProps {
    handleAuth: (data: RoomValues) => void;
}

export default function CreateRoom({ handleAuth }: CreateMenuRoomProps) {
    const [roomId, setRoomId] = useState('');
    const [password, setRoomPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        // El juego original tiene opciones de creacion de sala
        const options = {};
        handleAuth({ roomId, password, options });
    };
    return (
        <div style={backgroundDiv}>\
        <div style={textBox}>
            CONNECTED AS wallet-name
        </div>
            <div style={textBox}>
                <div style={principalText}>
                    Create New Room
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="roomId">
                        <Form.Control
                            type="text"
                            style={inputText}
                            placeholder="Enter room ID (other players can join later using this ID)"
                            value={roomId}
                            onChange={e => setRoomId(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label style={connectWalletText}>Optionally, you can add a password to make it private.</Form.Label>
                        <Form.Control
                            style={inputText}
                            type="password"
                            placeholder="Optional: Enter room password"
                            value={password}
                            onChange={e => setRoomPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button style={flags} variant="light" type="submit">
                        Create room
                    </Button>
                </Form>

            </div>
        </div>
    );
}

const backgroundDiv: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    backgroundImage: "url('./assets/map.png')",
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat',
    opacity: 0.9,
  };

  const textBox: CSSProperties = {
    border: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: '1%',
    marginBottom: '4rem',
    borderRadius: '5px',
    gridTemplateColumns: '1fr',
    maxWidth: '70%',
    margin: 'auto',
    zIndex: 1,
  };

  const principalText: CSSProperties = {
    fontSize: '50px',
    color: '#ffffff',
    font: 'Roboto',
  };
  
  const connectWalletText: CSSProperties = {
    fontSize: '20px',
    color: '#ffffff',
    font: 'Roboto',
  };  

  const flags: CSSProperties = {
    font: 'Roboto',
    textAlign: 'center',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    fontSize: '16px',
    color: 'white',
    width: '30%',
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
  
  const inputText: CSSProperties = {
    width: '100%',
    borderRadius: '4px',
    fontSize: 'large',
    backgroundColor: 'white',
    backgroundSize: '20px 20px',
    backgroundImage: 'url(\'https://cdn-icons-png.flaticon.com/512/4803/4803345.png\')',
    backgroundPosition: '10px 10px',
    backgroundRepeat: 'no-repeat',
    padding: '12px 20px 12px 40px',
    marginBottom: '4px',
  }