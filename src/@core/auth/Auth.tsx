import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Location } from 'history';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { restUrl } from '../../env';
import useAuth from './useAuth';
import ErrorHandler from '../ErrorHandler';

export interface AuthContextValue {
    username: string;
    login: (newUsername: string) => void;
    logout: () => void;
    loggedIn: boolean;
}

export const AuthContext = React.createContext<AuthContextValue>(null);

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState<string>(null);

    const login = newUsername => {
        setUsername(newUsername);
    };

    const logout = () => {
        setUsername('');
    };

    const loggedIn = username !== null;

    return (
        <AuthContext.Provider value={{ username, login, logout, loggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

const verifyToken = async token => {
    console.log(`${restUrl}/auth/verify`);

    try {
        const response = await axios.post(`${restUrl}/auth/verify`, { token });
        if (response.data.success) {
            return response.data.decoded;
        }
    } catch (error) {
        console.log(`Error al intentar verify with token: ${token}`);
    }

    return undefined;
};

interface AuthProps {
    loggedIn: boolean;
    logIn: boolean;
    location: Location;
}

export default function Auth({ location }: AuthProps) {
    const { login, loggedIn, logout } = useAuth();
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [isLoginFailed, setIsLoginFailed] = useState(false);
    const [isServerDown, setIsServerDown] = useState(false);
    const [actualUsername, setActualUsername] = useState('');

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        // this.usernameInput.focus();
        if (loggedIn) {
            return setRedirectToReferrer(true);
        }

        const token = Cookies.get('fifa-profile');
        // eslint-disable-next-line consistent-return
        const innerVerifyToken = async () => {
            const decoded = await verifyToken(token);
            if (decoded) {
                login(decoded.username);
                return setRedirectToReferrer(true);
            }
        };
        innerVerifyToken();
    }, []);

    // eslint-disable-next-line consistent-return
    const handleLogin = async event => {
        event.preventDefault();
        console.log('Handle Login');
        // Send login request here. Passed when success status true from server

        try {
            const response = await axios.post(`${restUrl}/auth/login`, {
                username: actualUsername,
            });
            if (!response.data.success || !response) {
                return setIsLoginFailed(true);
            }
            // Guardo una cookie con el token
            Cookies.set('fifa-profile', response.data.token);
            login(actualUsername);
            setRedirectToReferrer(true);
        } catch (error) {
            console.log(error.message);
            setIsServerDown(true);
        }
    };

    return (
        <>
            {redirectToReferrer && (
                <Redirect to={location.state || { from: { pathname: '/' } }} />
            )}
            {isServerDown && (
                <ErrorHandler
                    redirectUrl="/"
                    error={{
                        title: 'SEVERS ARE DOWN FOR MAINTAINENCE!',
                        content: 'WE WILL BE BACK SOON, BIGGER AND BETTER',
                    }}
                    resetError={() => {
                        setIsServerDown(false);
                    }}
                />
            )}
            {isLoginFailed && (
                <ErrorHandler
                    redirectUrl="/"
                    error={{
                        title: 'LOGIN FAILED, TRY AGAIN!',
                        content: 'CHECK YOUR CREDENTIALS OR TRY ANOTHER NAME',
                    }}
                    resetError={() => {
                        setIsLoginFailed(false);
                    }}
                />
            )}
            <div className="row align-items-center justify-content-left">
                <div className="col-sm-12 col-md-6">
                    <IntroInfo />
                    <div>
                        <Form onSubmit={handleLogin}>
                            <InputGroup>
                                <FormControl
                                    placeholder="Enter your alias here"
                                    name="username"
                                    value={actualUsername}
                                    aria-label="username"
                                    aria-describedby="text"
                                    onChange={e => setActualUsername(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Button type="submit">Submit</Button>
                            </InputGroup>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

const IntroInfo = () => {
    return (
        <div>
            <div>Do you want to be a Mecha?</div>
            <div>
                Play MechaStark-RPG with your friends <br />
            </div>
            <div>
                Create or join a room to start <br /> custom draft with your friends{' '}
                <br />
            </div>
        </div>
    );
};
