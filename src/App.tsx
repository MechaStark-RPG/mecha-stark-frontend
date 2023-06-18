import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ROUTES, { RenderRoutes } from './routes';

export default function App() {
    return (
        <Router>
            {console.log('ESTOY EN APP')}
            <RenderRoutes routes={ROUTES} />
        </Router>
    );
}
