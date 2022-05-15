import { Redirect, useHistory } from 'react-router-dom';
import defaultConfig, { BasicLayoutProps, Config, BasicState } from './config';
import { ComponentType } from 'react';

type LocationState = Record<string | symbol, any>;
const STORAGE_FIELD = Symbol();

function useReturnToApp<State extends BasicState, LayoutProps extends BasicLayoutProps<State>>(
  config?: Config<State, LayoutProps>
) {
  const { useActualState, getDefaultPath } = { ...defaultConfig, ...config };
  const actualState = useActualState() as State;
  const history = useHistory();
  const { location: { state } } = history;

  function returnToApp() {
    const to = (state as LocationState)?.[STORAGE_FIELD] || getDefaultPath(actualState);
    history.replace(to);
  }

  return returnToApp;
}

function withAccessControl<State extends BasicState, LayoutProps extends BasicLayoutProps<State>>(
  Component: ComponentType,
  fits: (actualState: State) => boolean,
  layoutProps?: Omit<LayoutProps, 'children' | 'state'>,
  config?: Config<State, LayoutProps>
): ComponentType {
  const { useActualState, getDefaultPath, composeState, StateDependentLayout } = { ...defaultConfig, ...config };
  return props => {
    const history = useHistory();
    const actualState = useActualState() as State;
    const { location: { pathname, state } } = history;

    if (!fits(actualState)) {
      const savedPath = (state as LocationState)?.[STORAGE_FIELD];
      const to = {
        pathname: savedPath || getDefaultPath(actualState),
        state: composeState(savedPath ? undefined : { [STORAGE_FIELD]: pathname })
      };
      return <Redirect to={to} />;
    }

    const fullLayoutProps = { ...layoutProps, children: <Component {...props} />, state: actualState } as LayoutProps;
    return <StateDependentLayout {...fullLayoutProps} />;
  };
}

export { useReturnToApp, withAccessControl };