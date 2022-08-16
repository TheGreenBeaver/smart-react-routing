import secureRoutes from './secure';
import miscRoutes from './misc';
import perksRoutes from './perks';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import useCurrentAppState from '../appState';
import { getDefaultPath } from './config/links';

const routes = [
  ...secureRoutes,
  ...miscRoutes,
  ...perksRoutes,
];
function Pages() {
  const history = useHistory();
  const currentAppState = useCurrentAppState();
  return (
    <Switch>
      {routes.map((appRoute, idx) => <Route key={idx} {...appRoute} />)}
      <Redirect to={getDefaultPath(currentAppState, history)} />
    </Switch>
  );
}

export default Pages;
