import { Redirect, useHistory } from 'react-router-dom';
import AppLink from './AppLink';
import { PropsWithChildren, ComponentType } from 'react';

type BasicAppState = Record<string | number, unknown>;
type BasicWrapperProps<AppState extends BasicAppState> = PropsWithChildren<{ currentAppState: AppState }>;

type RequiredAppState<AppState extends BasicAppState> = {
  [Key in keyof AppState]: AppState[Key] | typeof AppRouting.ANY
};

type THook<AppState extends BasicAppState> = () => AppState;
type TGetDefaultPath<AppState extends BasicAppState> = (
  currentAppState: AppState,
  history: ReturnType<typeof useHistory>
) => string;
type TFits<AppState extends BasicAppState> = (
  currentAppState: AppState,
  requiredAppState: RequiredAppState<AppState>
) => boolean;
type TLocationState = Record<string | symbol, unknown> | undefined;

export type AppRoute<TProps> = {
  path: string,
  exact: boolean,
  component: ComponentType<TProps>
};

class AppRouting<AppState extends BasicAppState, WrapperProps extends BasicWrapperProps<AppState>> {
  private readonly useCurrentAppState: THook<AppState>;

  private readonly getDefaultPath: TGetDefaultPath<AppState>;
  private readonly Wrapper: ComponentType<WrapperProps>;
  private readonly fits: TFits<AppState>;

  private static STORAGE_FIELD = Symbol();

  static readonly ANY = Symbol();

  constructor(
    useCurrentAppState: THook<AppState>, {
      getDefaultPath = () => '/',
      Wrapper = ({ children }) => <>{children}</>,
      fits = (currentAppState, requiredAppState) => Object.entries(requiredAppState).every(
        ([key, requiredFieldValue]) => requiredFieldValue === AppRouting.ANY
          ? key in currentAppState
          : currentAppState[key] === requiredFieldValue
      ),
    }: {
      getDefaultPath?: TGetDefaultPath<AppState>
      Wrapper?: ComponentType<WrapperProps>,
      fits?: TFits<AppState>
    } = {}) {
    this.useCurrentAppState = useCurrentAppState;

    this.getDefaultPath = getDefaultPath;
    this.Wrapper = Wrapper;
    this.fits = fits;

    this.useReturnToDesiredPage = this.useReturnToDesiredPage.bind(this);
    this.withAccessControl = this.withAccessControl.bind(this);
  }

  private withAccessControl<TProps>(
    Component: ComponentType<TProps>,
    requiredAppState: RequiredAppState<AppState>,
    wrapperProps?: Omit<WrapperProps, 'children' | 'currentAppState'>
  ): ComponentType<TProps> {
    return (props: TProps) => {
      const history = useHistory();
      const currentAppState = this.useCurrentAppState();
      const { location: { pathname, state } } = history;
      if (!this.fits(currentAppState, requiredAppState)) {
        const savedPath = (state as TLocationState)?.[AppRouting.STORAGE_FIELD];
        const to = {
          pathname: (savedPath as string) ?? this.getDefaultPath(currentAppState, history),
          state: savedPath ? undefined : { [AppRouting.STORAGE_FIELD]: pathname },
        };
        return <Redirect to={to} />;
      }

      const fullWrapperProps = { ...wrapperProps, children: <Component {...props} />, currentAppState } as WrapperProps;
      return <this.Wrapper {...fullWrapperProps} />;
    };
  }

  useReturnToDesiredPage(): () => void {
    const currentAppState = this.useCurrentAppState();
    const history = useHistory();
    const { location: { state } } = history;
    const { getDefaultPath } = this;

    function returnToDesiredPage() {
      const to = (state as TLocationState)?.[AppRouting.STORAGE_FIELD] ?? getDefaultPath(currentAppState, history);
      history.replace(to as string);
    }

    return returnToDesiredPage;
  }

  createAppRoute<TProps>(
    appLink: AppLink | string,
    Component: ComponentType<TProps>,
    requiredAppState: RequiredAppState<AppState>,
    { exact = true, wrapperProps }: {
      exact?: boolean, wrapperProps?: Omit<WrapperProps, 'children' | 'currentAppState'>
    } = {}
  ): AppRoute<TProps> {
    return {
      path: appLink instanceof AppLink ? appLink.path : appLink,
      exact,
      component: this.withAccessControl<TProps>(Component, requiredAppState, wrapperProps),
    };
  }
}

export default AppRouting;
