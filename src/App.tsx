import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ROUTES, { RenderRoutes } from './routes';
import { SocketProvider } from './@core/socket/Socket';
import { AuthProvider } from './@core/auth/AuthContext';

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <SocketProvider>
                    <RenderRoutes routes={ROUTES} />
                </SocketProvider>
            </AuthProvider>
        </Router>
    );
}
