import React, { useState } from 'react';

import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';

export default function CreateRoom(changeAuth) {
    const [roomId, setRoomId] = useState('');
    const [password, setRoomPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        //El juego original tiene opciones de creacion de sala
        const options = {};
        changeAuth({ roomId, password, options });
    };
    return (
        <div>
            <h2>Create New Room</h2>
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <FormControl
                        readOnly
                        name="roomId"
                        value={roomId}
                        aria-label="roomId"
                        aria-describedby="text"
                        onChange={e => setRoomId(e.target.value)}
                    />
                </InputGroup>
                <br />
                <h6>Add password to keep it exclusive</h6>
                <InputGroup>
                    <FormControl
                        placeholder="Optional: Enter room password"
                        name="password"
                        aria-label="password"
                        aria-describedby="password"
                        onChange={e => setRoomPassword(e.target.value)}
                    />
                </InputGroup>
                <br />
                <InputGroup>
                    <Button variant="light" type="submit">
                        Create
                    </Button>
                </InputGroup>
            </Form>
        </div>
    );
}
