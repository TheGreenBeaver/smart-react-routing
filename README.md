# smart-react-routing

This tiny library is designed to organize the routing logic in an app using [React Router](https://v5.reactrouter.com/).

## Install

**npm:**

```
$ npm install smart-react-routing
```

**yarn:**

```
$ yarn add smart-react-routing
```

## Basic Usage

```jsx
import { AppLink, AppRouting } from 'smart-react-routing';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useHistory, BrowserRouter, Route, Switch } from 'react-router-dom';

const homeLink = new AppLink('/home/:accountId');
const signInLink = new AppLink('/sign_in');

const appRouting = new AppRouting(
  () => useSelector(state => state.account),
  { getDefaultPath: ({ isAuthorized }) => isAuthorized ? homeLink.path : signInLink.path }
);

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

const homeRoute = appRouting.createAppRoute(homeLink, Home, { isAuthorized: true });
const signInRoute = appRouting.createAppRoute(signInLink, SignIn, { isAuthorized: false });

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
treated as a query object and is stringified using [query-string](https://www.npmjs.com/package/query-string);

### AppRouting

Instances of this class define the behaviour of the routes you create.

#### constructor(useCurrentAppState, { getDefaultPath, Wrapper, fits })

*useCurrentAppState*

Type: () => `AppState`

The hook to access the Application State that defines the accessibility of the pages.

*getDefaultPath* (optional)

Type: (currentAppState: `AppState`, history: `History`) => `string`

If the user visits some page they should not at current state, they get redirected to the last suitable page they've
visited (its path is stored in `location.state`). If they haven't yet, the path returned by this function is used.
The default logic for this function is to always return '/';

*Wrapper*

Type: `React.ComponentType` (optional)

Allows wrapping the pages in some state-dependent layout. The Application State will be passed as `currentAppState`.
Should also accept `children`.

*fits*

Type: (currentAppState: `AppState`, requiredAppState: `AppState`) => `boolean`

Allows overriding the way the current AppState is compared to the required one. By default, `true` is returned if all
the field values of the required state are either equal to the corresponding values of the current state or set
to `AppRouting.ANY`.

#### .createAppRoute(appLink, Component, requiredAppState, { exact, wrapperProps })

Returns: { component: `React.ComponentType`, path: `string`, exact: `boolean` } - an object ready to be passed
to `<Route />` as props.

*appLink*

Type: [`AppLink`](#appLink) | `string`

Represents the `path` prop for the corresponding `<Route />`.

*Component*

Type: `React.ComponentType`

The component to render at the path.

*requiredAppState*

Type: `AppState`

The package is based on the idea that each Route can only be accessed if the application is in a certain State. This
parameter should represent such state. There's a special static constant on the AppRouting class, `AppRouting.ANY` - you
can use it for some "wildcard" situations, when any state is suitable.

*exact* (optional)

Type: `boolean`

`exact` prop for `<Route />`. `true` by default.

*wrapperProps* (optional)

Any extra props to be passed to the Wrapper (other than `children` and `currentAppState`).

#### .useReturnToDesiredPage()

Returns: () => `void`

Use this when you need to redirect the user to their previous location, but the Application State has not changed in a
way that would trigger automatic redirection.

### Scripts

There are three scripts that will drastically speed up your development process.

#### init

`smart-react-routing init`

Initialize the project structure.

#### add-page-group

`smart-react-routing add-page-group --name auth`

Add a group of semantically similar pages.

#### add-page

`smart-react-routing add-page --group auth --name SignIn --url /auth/sign-in`

Add a new page

#### Arguments

All scripts accept two optional arguments in addition to the script-specific required ones. You can define them in
`srr-config.json` so that you don't have to type them every time you call a script.

*ts*

Use Typescript templates (default - `false`).

*root*

The root directory for the project (default - `src`).