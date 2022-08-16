import neutralRoutes from './neutral';
import redRoutes from './red';
import greenRoutes from './green';
import { Switch, Route, Redirect } from 'react-router-dom';
import useCurrentAppState from '../appState';
import { getDefaultPath } from './config/links';

const routes = [
  ...neutralRoutes,
  ...redRoutes,
  ...greenRoutes,
];
function Pages() {
  const currentAppState = useCurrentAppState();
  return (
    <Switch>
      {routes.map((appRoute, idx) => <Route key={idx} {...appRoute} />)}
      <Redirect to={getDefaultPath(currentAppState)} />
    </Switch>
  );
}

export default Pages;
