import React, { useState } from 'react';

import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';

export default function JoinRoom(changeAuth) {
    const [roomId, setRoomId] = useState('');
    const [password, setRoomPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        changeAuth({ roomId, password });
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
