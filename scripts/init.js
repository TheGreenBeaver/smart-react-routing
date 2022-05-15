const fs = require('fs');
const path = require('path');

const indexFileContent =
`import { Switch, Route } from 'react-router-dom';

const routes = [
];
function Routing() {
  return (
    <Switch>
      {routes.map((appRoute) => <Route key={appRoute.component.name} {...appRoute} />)}
    </Switch>
  );
}

export default Routing;
`;

const linksFileContent =
`const links = {
};

function getDefaultPath(state) {
  return '/';
}

export default links;
export { getDefaultPath };
`;

const layoutFileContent =
`function Layout({ children, state }) {
  return children;
}

export default Layout;
`;

const appRouteFileContent =
`import { AppRoute as AppRouteBase, defaultConfig } from 'smart-react-routing';
import Layout from './Layout';
import { getDefaultPath } from './links';

class AppRoute extends AppRouteBase {
  static defaultConfig = {
    ...defaultConfig,
    StateDependentLayout: Layout,
    getDefaultPath,
  };
}

export default AppRoute;
`;

async function run() {
  const pagesDir = path.join('src', 'pages');
  const configDir = path.join(pagesDir, 'config');
  await fs.promises.mkdir(configDir, { recursive: true });

  await fs.promises.writeFile(path.join(pagesDir, 'index.js'), indexFileContent);

  await fs.promises.writeFile(path.join(configDir, 'links.js'), linksFileContent);
  await fs.promises.writeFile(path.join(configDir, 'Layout.js'), layoutFileContent);
  await fs.promises.writeFile(path.join(configDir, 'AppRoute.js'), appRouteFileContent);
}

run();