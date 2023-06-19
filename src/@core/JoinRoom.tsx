import React, { useState } from 'react';

import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { RoomValues } from './Room';

interface JoinRoomProps {
    handleAuth: (data: RoomValues) => void;
}

export default function JoinRoom({ handleAuth }: JoinRoomProps) {
    const [roomId, setRoomId] = useState('');
    const [password, setRoomPassword] = useState('');

    console.log(handleAuth);
    const handleSubmit = event => {
        event.preventDefault();
        handleAuth({ roomId, password } as RoomValues);
    };

    return (
        <div>
            <h2>Enter Room ID</h2>
            <div>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <FormControl
                            placeholder="Enter the RoomID here"
                            aria-label="roomId"
                            name="roomId"
                            aria-describedby="text"
                            onChange={e => setRoomId(e.target.value)}
                        />
                    </InputGroup>
                    <br />
                    Leave blank if no password
                    <InputGroup>
                        <FormControl
                            placeholder="Enter room password"
                            name="password"
                            aria-label="password"
                            aria-describedby="password"
                            onChange={e => setRoomPassword(e.target.value)}
                        />
                    </InputGroup>
                    <br />
                    <InputGroup>
                        <Button variant="light" type="submit">
                            Join
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
    );
}
