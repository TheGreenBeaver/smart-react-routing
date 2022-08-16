import neutralRoutes from './neutral';
import redRoutes from './red';
import greenRoutes from './green';
import { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AppRoute } from 'smart-react-routing';
import useCurrentAppState from '../appState';
import { getDefaultPath } from './config/links';

const routes: AppRoute<unknown>[] = [
  ...neutralRoutes,
  ...redRoutes,
  ...greenRoutes,
];
const Pages: FC = () => {
  const currentAppState = useCurrentAppState();
  return (
    <Switch>
      {routes.map((appRoute, idx) => <Route key={idx} {...appRoute} />)}
      <Redirect to={getDefaultPath(currentAppState)} />
    </Switch>
  );
};

export default Pages;
