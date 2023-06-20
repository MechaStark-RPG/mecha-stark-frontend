import useAuth from './@core/auth/useAuth';
import React from 'react';
import { Redirect } from 'react-router';
import { RenderRoutes } from './routes';

export default function AppRouter(props) {
    const { loggedIn } = useAuth();

    return (
        <>
            {!loggedIn && (
                <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />
            )}
            {loggedIn && <RenderRoutes {...props} />}
        </>
    );
}
