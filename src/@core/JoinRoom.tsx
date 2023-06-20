import React, { useState } from 'react';

import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { RoomValues } from './Room';

interface JoinRoomProps {
    handleAuth: (data: RoomValues) => void;
}

export default function JoinRoom({ handleAuth }: JoinRoomProps) {
    const [roomId, setRoomId] = useState('');
    const [password, setRoomPassword] = useState('');
    const handleSubmit = event => {
        event.preventDefault();
        handleAuth({ roomId, password } as RoomValues);
    };

    return (
        <div className="text-center">
            <h2>Enter Room ID</h2>
            <div className="mx-auto" style={{ maxWidth: '300px' }}>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <FormControl
                            placeholder="Enter the Room ID here"
                            aria-label="roomId"
                            name="roomId"
                            aria-describedby="text"
                            onChange={e => setRoomId(e.target.value)}
                        />
                    </InputGroup>
                    <br />
                    <p className="text-muted">Leave blank if no password</p>
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
