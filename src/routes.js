import React from 'react';

import { Route, Switch } from 'react-router-dom';

import GameApp from './GameApp';
import Room from './@core/Room';
import Lobby from './@core/Lobby';
import Auth from './@core/auth/Auth';
import AppRouter from './AppRouter';

const ROUTES = [
    {
        path: '/auth',
        key: 'AUTH',
        exact: true,
        component: Auth,
    },
    {
        path: '/',
        key: 'APP',
        component: AppRouter,
        routes: [
            {
                path: '/',
                key: 'APP_ROOT',
                exact: true,
                component: Room,
            },
            {
                path: '/game',
                key: 'APP_GAME',
                exact: true,
                component: GameApp,
            },
            {
                path: '/room',
                key: 'APP_ROOM',
                exact: true,
                component: Lobby,
            },
        ],
    },
];

export default ROUTES;

/**
 * Render a route with potential sub routes
 */
const RouteWithSubRoutes = route => {
    return (
        <Route
            path={route.path}
            exact={route.exact}
            render={props => <route.component {...props} routes={route.routes} />}
        />
    );
};

/**
 * Use this component for any new section of routes (any config object that has a "routes" property)
 */
export const RenderRoutes = ({ routes }) => {
    return (
        <Switch>
            {routes.map((route, i) => {
                return <RouteWithSubRoutes key={route.key} {...route} />;
            })}
            <Route component={() => <h1>Not Found!</h1>} />
        </Switch>
    );
};
