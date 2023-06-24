import React, { useState, CSSProperties } from 'react';

import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { RoomValues } from './Room';
import handleDisconnect from './auth/Auth';
import CreateRoom from './CreateRoom';

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
        <div style={backgroundDiv}>
            <div style={textBox}>
                <div style={connectWalletText}>
                    Connected with wallet: wallet-address
                </div>
                <button style={flags}
                    // onClick={() => handleDisconnect()}
                    >Disconnect Wallet</button>
            </div>
            <div style={textBox}>
                <div style={principalText}>
                    Join a created room
                </div>
                <div>
                 <Form onSubmit={handleSubmit}>
                     <InputGroup>
                         <FormControl
                            style={inputText}
                            placeholder="Enter the Room ID here"
                            aria-label="roomId"
                            name="roomId"
                            aria-describedby="text"
                            onChange={e => setRoomId(e.target.value)}
                         />
                     </InputGroup>
                     <br />
                     <p style={connectWalletText}>Leave blank if no password</p>
                     <InputGroup>
                         <FormControl
                            style={inputText}
                            placeholder="Enter room password"
                            name="password"
                            aria-label="password"
                            aria-describedby="password"
                            onChange={e => setRoomPassword(e.target.value)}
                         />
                     </InputGroup>
                     <br />
                     <InputGroup>
                         <Button style={flags} variant="light" type="submit">
                             Join room
                         </Button>
                     </InputGroup>
                 </Form>
             </div>
            </div>
        </div>
    );
}

const backgroundDiv: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
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