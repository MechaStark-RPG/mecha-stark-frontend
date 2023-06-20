import React, { useState } from 'react';

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
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6}>
                    <h2>Create New Room</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="roomId">
                            <Form.Control
                                type="text"
                                placeholder="Enter the RoomID here"
                                value={roomId}
                                onChange={e => setRoomId(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Add password to keep it exclusive</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Optional: Enter room password"
                                value={password}
                                onChange={e => setRoomPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="light" type="submit">
                            Create
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
