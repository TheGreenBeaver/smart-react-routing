import AppLink from './AppLink';
import { withAccessControl } from './accessControl';
import { ComponentType } from 'react';
import defaultConfig, { BasicState, BasicLayoutProps, Config } from './config';

type Options<State extends BasicState, LayoutProps extends BasicLayoutProps<State>> = {
  exact?: boolean,
  config?: Config<State, LayoutProps>,
  layoutProps?: Omit<LayoutProps, 'children' | 'state'>
};

class AppRoute<State extends BasicState, LayoutProps extends BasicLayoutProps<State>> {
  static ANY = Symbol();
  path: string;
  exact: boolean;
  component: ComponentType;
  protected static defaultConfig = defaultConfig;

  constructor(appLink: AppLink | string, component: ComponentType, requiredState: State, {
    exact = true, config, layoutProps
  }: Options<State, LayoutProps> = {}) {
    this.path = appLink instanceof AppLink ? appLink.path : appLink;
    this.exact = exact;
    this.component = withAccessControl<State, LayoutProps>(
      component,
        actualState => this.fits(requiredState, actualState),
      layoutProps,
      config || (AppRoute.defaultConfig as Config<State, LayoutProps>
      )
    );
  }

  protected compareStateFieldValue(
    requiredValue: State[keyof State],
    actualValue: State[keyof State],
    key: string
  ): boolean
  protected compareStateFieldValue(requiredValue: State[keyof State], actualValue: State[keyof State]): boolean {
    return requiredValue === actualValue;
  }

  private fits(requiredState: State, actualState: State): boolean {
    return Object.entries(actualState).every(([key, value]) =>
      [value, AppRoute.ANY].some(actualValue => this.compareStateFieldValue(requiredState[key], actualValue, key))
    );
  }
}

export default AppRoute;