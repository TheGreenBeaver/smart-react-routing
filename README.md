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

Returns: `string`

Replaces colon-separated parameters with actual values

*...params*

Type: `string` | `number` | `object`

The actual values to insert. If more parameters are passed then there are placeholders in the path, the last one is
treated as a query string object

### AppRoute

A class to configure the behaviour for a specific Route

#### constructor(appLink, component, requiredState, { exact, config, layoutProps })

*appLink*

Type: `string` | [`AppLink`](#applink)

Represents the `path` prop for the corresponding `<Route />`

*component*

Type: `React.ComponentType`

The component to render at the path

*requiredState*

Type: `AppState`

The package is based on the idea that each Route can only be accessed if the application is in a certain State. This
argument should represent such state. There's a special static constant on the AppRoute class, `AppRoute.ANY` - you can
use it for some "wildcard" situations, when any state is suitable.

*exact* (optional)

Type: `boolean`

`exact` prop for `<Route />`

*config* (optional)

Type: [`Config`](#config)

The [Config](#config) to use for this exact Route. If nothing is specified, `AppRoute.defaultConfig` is used.

*layoutProps* (optional)

Type: `LayoutProps`

Props for `<StateDependentLayout />` (see [Config](#config) for details).

### Config

#### useActualState()

Returns: AppState

The hook to access the Application State that defines the accessibility of the pages.

#### getDefaultPath(actualConfig)

Returns: string

If the user visits some page they should not at current state, the path of that page is stored in
`location.state`, and after the state becomes suitable, user gets redirected back to the page they wanted to visit
initially. However, if the state is not suitable for current page anymore and there's no stored path, the one returned
by this function will be used.

*actualConfig*

Type: AppConfig

#### composeState(accessControlState)

Returns: `object`

This allows you to modify `location.state` before redirects.

*accessControlState*

Type: `{ STORED_PATH }`

#### StateDependentLayout

`React.ComponentType<LayoutProps>`

Allows wrapping the AppRoute component in some state-dependent layout. The Application State will be
passed as `state`. Should also accept `children`.

### useReturnToApp(config)

Returns: `function`

Use this when you need to redirect the user to his previous location, but the Application State has not
changed in a way that would trigger automatic redirection.

*config* (optional)

Type: [Config](#config)

### Customization

It's highly recommended that you define your own AppRoute class extending the basic one, setting
static `defaultConfig` on it. You can also override the `.compareStateFieldValue` if the fields of
your Application State are to be compared in some more complicated way than simple equality.

#### .compareStateFieldValue(requiredValue, actualValue, key)

Returns: `boolean`

*requiredValue*

The value of the field in the `requiredState`

*actualValue*

The value of the field in the `actualState`

*key*

Type: `string`

The field name

### Scripts

There are three scripts that will drastically speed up your development process.

#### init

Creates the general project structure

#### add-page-group

`add-page-group auth`

Initializes a "section" of an application

#### add-page

`add-page auth sign-in /auth/sign-in`

Adds a fresh page