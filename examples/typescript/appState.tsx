import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react';

export type AppState = {
  likesGreen: boolean,
  likesRed: boolean
};
type AppStateLogic = {
  appState: AppState,
  setAppState: Dispatch<SetStateAction<AppState>>
};

const AppStateContext = createContext<AppStateLogic>({
  appState: { likesGreen: false, likesRed: false }, setAppState: () => undefined,
});

function useAppStateLogic(): AppStateLogic {
  return useContext(AppStateContext);
}

function useCurrentAppState(): AppState {
  return useAppStateLogic().appState;
}

const AppStateProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>({ likesGreen: false, likesRed: false });
  const appStateLogic = useMemo<AppStateLogic>(() => ({
    appState, setAppState,
  }), [appState, setAppState]);

  return (
    <AppStateContext.Provider value={appStateLogic}>
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateProvider, useAppStateLogic };
export default useCurrentAppState;
