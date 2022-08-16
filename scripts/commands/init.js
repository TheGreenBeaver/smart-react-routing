const fs = require('fs');
const path = require('path');


exports.command = 'init';

exports.describe = 'Initialize the project structure';

const jsTemplates = {
  index:
`import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import useCurrentAppState from '../appState';
import { getDefaultPath } from './config/links';

const routes = [
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
`,

  appState:
`function useCurrentAppState() {
  return {};
}

export default useCurrentAppState;
`,

  links:
`
const links = {
};

function getDefaultPath(currentAppState, history) {
  return '/';
}

export default links;
export { getDefaultPath };
`,

  wrapper:
`function Wrapper({ children, currentAppState }) {
  return children;
}

export default Wrapper;
`,

  appRouting:
`import { AppRouting } from 'smart-react-routing';
import Wrapper from './Wrapper';
import { getDefaultPath } from './links';
import useCurrentAppState from '../../appState';

const appRouting = new AppRouting(useCurrentAppState, { getDefaultPath, Wrapper });

export default appRouting;
`
};

const tsTemplates = {
  index:
`import { FC } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { AppRoute } from 'smart-react-routing';
import useCurrentAppState from '../appState';
import { getDefaultPath } from './config/links';

const routes: AppRoute<unknown>[] = [
];
const Pages: FC = () => {
  const history = useHistory();
  const currentAppState = useCurrentAppState();
  return (
    <Switch>
      {routes.map((appRoute, idx) => <Route key={idx} {...appRoute} />)}
      <Redirect to={getDefaultPath(currentAppState, history)} />
    </Switch>
  );
};

export default Pages;
`,

  appState:
`export type AppState = {};

function useCurrentAppState(): AppState {
  return {};
}

export default useCurrentAppState;
`,

  links:
`import { AppState } from '../../appState';
import { useHistory } from 'react-router-dom';

const links = {
};

function getDefaultPath(currentAppState: AppState, history: ReturnType<typeof useHistory>): string {
  return '/';
}

export default links;
export { getDefaultPath };
`,

  wrapper:
`import { FC, PropsWithChildren } from 'react';
import { AppState } from '../../appState';

export type WrapperProps = PropsWithChildren<{
  currentAppState: AppState
}>;

const Wrapper: FC<WrapperProps> = ({ children, currentAppState }) => <>{children}</>;

export default Wrapper;
`,

  appRouting:
`import { AppRouting } from 'smart-react-routing';
import Wrapper, { WrapperProps } from './Wrapper';
import { getDefaultPath } from './links';
import useCurrentAppState, { AppState } from '../../appState';

const appRouting = new AppRouting<AppState, WrapperProps>(useCurrentAppState, { getDefaultPath, Wrapper });

export default appRouting;
`
};

exports.handler = async argv => {
  const { root, ts } = argv;

  const pagesDir = path.join(root, 'pages');
  const configDir = path.join(pagesDir, 'config');
  await fs.promises.mkdir(configDir, { recursive: true });

  const ext = ts ? 'ts' : 'js';
  const jsxExt = ts ? 'tsx' : 'js';
  const templates = ts ? tsTemplates : jsTemplates;

  await fs.promises.writeFile(path.join(pagesDir, `index.${jsxExt}`), templates.index);

  await fs.promises.writeFile(path.join(root, `appState.${ext}`), templates.appState);

  await fs.promises.writeFile(path.join(configDir, `links.${ext}`), templates.links);
  await fs.promises.writeFile(path.join(configDir, `Wrapper.${jsxExt}`), templates.wrapper);
  await fs.promises.writeFile(path.join(configDir, `appRouting.${ext}`), templates.appRouting);
};
