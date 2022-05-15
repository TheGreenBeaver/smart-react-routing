# smart-react-routing

This tiny library is designed to organize the routing logic in an app using react-router.

## Install

**npm:**

```
$ npm install smart-react-routing
```

**yarn:**

```
$ yarn add smart-react-routing
```

## Usage

```jsx
import { AppLink, AppRoute as BaseAppRoute } from 'smart-react-routing';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useHistory, BrowserRouter, Route, Switch } from 'react-router-dom';


const homeLink = new AppLink('/home/:accountId');
const signInLink = new AppLink('/sign_in');

class AppRoute extends BaseAppRoute {
  static defaultConfig = {
    useActualState: () => useSelector(state => state.account),
    getDefaultPath: ({ isAuthorized }) => isAuthorized ? homeLink.path : signInLink.path
  };
}

function Home() {
  return <h1>Home</h1>;
}

function SignIn() {
  const history = useHistory();
  const signIn = () => axios
    .post('/api/sign_in')
    .then(({ data }) => history.push(homeLink.compose(data.accountId)));
  return <button onClick={signIn}>Sign In</button>;
}

const homeRoute = new AppRoute(homeLink, Home, { isAuthorized: true });
const signInRoute = new AppRoute(signInLink, SignIn, { isAuthorized: false });

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route {...homeRoute} />
        <Route {...signInRoute} />
      </Switch>
    </BrowserRouter>
  );
}
```

## API

### AppLink

Represents a path to some page

#### constructor(path)

*path*

Type: `string`

Like the ones you use for `<Route />`, a URL-like string with colon-separated path parameters.

#### .compose(...params)

Replaces colon-separated parameters with actual values

*...params*

Type: `string` | `number` | `object`

Returns: `string`

The actual values to insert. If more parameters are passed then there are placeholders in the path, the last one is
treated as a query string object

### AppRoute

A class to configure the behaviour for a specific Route

#### constructor(appLink, component, requiredState, { exact, config, layoutProps })

*appLink*

Type: `string` | [AppLink](###AppLink)

Represents the `path` prop for the corresponding `<Route />`

*component*

Type: `React.ComponentType`

The component to render at the path

*requiredState*

Type: `object`

The package is based on the idea that each Route can only be accessed if the application is in a certain State. This
argument should represent such state. There's a special static constant on the AppRoute class, `AppRoute.ANY` - you can
use it for some "wildcard" situations, when any state is suitable.

*exact*

Type: `boolean`

`exact` prop for `<Route />`

*config*

Type: `Config`