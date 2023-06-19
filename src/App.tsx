import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ROUTES, { RenderRoutes } from './routes';
import { SocketProvider } from './@core/socket/Socket';

export default function App() {
    return (
        <Router>
            <SocketProvider>
                <RenderRoutes routes={ROUTES} />
            </SocketProvider>
        </Router>
    );
}
