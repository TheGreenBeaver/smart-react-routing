import { createContext, useContext, useMemo, useState } from 'react';
import * as PropTypes from 'prop-types';

const AppStateContext = createContext({
  appState: { likesGreen: false, likesRed: false }, setAppState: () => undefined,
});

function useAppStateLogic() {
  return useContext(AppStateContext);
}

function useCurrentAppState() {
  return useAppStateLogic().appState;
}

function AppStateProvider({ children }) {
  const [appState, setAppState] = useState({ likesGreen: false, likesRed: false });
  const appStateLogic = useMemo(() => ({
    appState, setAppState,
  }), [appState, setAppState]);

  return (
    <AppStateContext.Provider value={appStateLogic}>
      {children}
    </AppStateContext.Provider>
  );
}

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppStateProvider, useAppStateLogic };
export default useCurrentAppState;
