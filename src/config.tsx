import { ReactNode, ComponentType, FunctionComponent } from 'react';

export type BasicState = Record<string, any>;
export type BasicLayoutProps<State extends BasicState> = { children: ReactNode, state: State };
type FullConfig<State extends BasicState, LayoutProps extends BasicLayoutProps<State>> = {
  useActualState: () => State,
  getDefaultPath: (actualState: State) => string,
  composeState: (accessControlState: { [key: symbol]: string } | undefined) => Record<string | symbol, any> | undefined,
  StateDependentLayout: ComponentType<LayoutProps>
};
export type Config<State extends BasicState, LayoutProps extends BasicLayoutProps<State>> =
  Partial<FullConfig<State, LayoutProps>>;

const DefaultLayout: FunctionComponent<BasicLayoutProps<{}>> = ({ children }) => <>{children}</>;
const defaultConfig: FullConfig<{}, BasicLayoutProps<{}>> = {
  useActualState: () => ({}),
  getDefaultPath: () => '/',
  composeState: accessControlState => accessControlState,
  StateDependentLayout: DefaultLayout
};

export default defaultConfig;