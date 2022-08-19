import { AppRoute, AppRouting } from '../src';
import { proxy, useSnapshot } from 'valtio';
import { FC, PropsWithChildren, useEffect } from 'react';
import { fireEvent, render, waitFor, RenderResult } from '@testing-library/react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import { createMemoryHistory, History, MemoryHistoryBuildOptions } from 'history';

function renderWithRouter(
  appRoutes: AppRoute<unknown>[],
  links: string[],
  options: MemoryHistoryBuildOptions = { initialEntries: ['/'] }
): [History, (newUrl: string) => void, RenderResult] {
  const history = createMemoryHistory(options);
  const renderResult = render(
    <Router history={history}>
      {links.map((link, idx) => (
        <Link key={idx} to={link}>{link}</Link>
      ))}
      <Switch>
        {appRoutes.map((appRoute, idx) => <Route key={idx} {...appRoute} />)}
      </Switch>
    </Router>
  );
  const goTo = (newUrl: string) => fireEvent.click(renderResult.getByText(newUrl));
  return [history, goTo, renderResult];
}

describe('AppRouting', () => {
  it('Should allow or disallow access based on App State', () => {
    type AppState = { isAuthorized: boolean };
    type WrapperProps = PropsWithChildren<{ currentAppState: AppState }>;

    const appRouting = new AppRouting<AppState, WrapperProps>(() => ({ isAuthorized: false }));

    const PublicPage: FC = () => <div>PublicPage</div>;
    const PrivatePage: FC = () => <div>PrivatePage</div>;

    const publicRoute = appRouting.createAppRoute('/public', PublicPage, { isAuthorized: false });
    const privateRoute = appRouting.createAppRoute('/private', PrivatePage, { isAuthorized: true });

    const [history, goTo] = renderWithRouter([publicRoute, privateRoute], ['/private', '/public']);
    goTo('/private');
    expect(history.location.pathname).toBe('/');

    goTo('/public');
    expect(history.location.pathname).toBe('/public');
  });

  it('Should automatically return to desired page when state fits', async () => {
    type AppState = { isAdmin: boolean };
    type WrapperProps = PropsWithChildren<{ currentAppState: AppState }>;

    const appStateStore = proxy<AppState>({ isAdmin: false });
    const appRouting = new AppRouting<AppState, WrapperProps>(() => useSnapshot(appStateStore), {
      getDefaultPath: currentAppState => currentAppState.isAdmin ? '/admin/2' : '/',
    });

    const PublicPage: FC = () => <div>PublicPage</div>;
    const AdminPage1: FC = () => <div>AdminPage1</div>;
    const AdminPage2: FC = () => <div>AdminPage2</div>;

    const publicRoute = appRouting.createAppRoute('/', PublicPage, { isAdmin: false });
    const adminRoute1 = appRouting.createAppRoute('/admin/1', AdminPage1, { isAdmin: true });
    const adminRoute2 = appRouting.createAppRoute('/admin/2', AdminPage2, { isAdmin: true });

    const [history, goTo] = renderWithRouter(
      [publicRoute, adminRoute1, adminRoute2], ['/admin/1', '/admin/2']
    );

    goTo('/admin/1');
    expect(history.location.pathname).toBe('/');

    appStateStore.isAdmin = true;
    await waitFor(() => expect(history.location.pathname).toBe('/admin/1'));
  });

  it('Should support wildcard in requiredAppState', () => {
    type AppState = { category: string };
    type WrapperProps = PropsWithChildren<{ currentAppState: AppState }>;

    const appStateStore = proxy<AppState>({ category: 'meat' });
    const appRouting = new AppRouting<AppState, WrapperProps>(() => useSnapshot(appStateStore), {
      getDefaultPath: () => '/menu',
    });

    const MenuPage: FC = () => <div>Menu</div>;
    const MeatPage: FC = () => <div>Meat</div>;

    const menuRoute = appRouting.createAppRoute('/menu', MenuPage, { category: AppRouting.ANY });
    const meatRoute = appRouting.createAppRoute('/meat', MeatPage, { category: 'meat' });

    const [history] = renderWithRouter([menuRoute, meatRoute], [], { initialEntries: ['/menu'] });
    appStateStore.category = 'meat';
    expect(history.location.pathname).toBe('/menu');
  });

  it('Should allow manually returning to desired page', () => {
    type AppState = { isAdmin: boolean };
    type WrapperProps = PropsWithChildren<{ currentAppState: AppState }>;

    const appStateStore = proxy<AppState>({ isAdmin: false });
    const appRouting = new AppRouting<AppState, WrapperProps>(() => useSnapshot(appStateStore), {
      getDefaultPath: currentAppState => currentAppState.isAdmin ? '/admin/2' : '/',
    });

    const PublicPage: FC = () => {
      const returnToDesiredPage = appRouting.useReturnToDesiredPage();
      return (
        <div>
          <button onClick={returnToDesiredPage}>Return</button>
          PublicPage
        </div>
      );
    };
    const AdminPage1: FC = () => <div>AdminPage1</div>;
    const AdminPage2: FC = () => <div>AdminPage2</div>;

    const publicRoute = appRouting.createAppRoute('/', PublicPage, { isAdmin: AppRouting.ANY });
    const adminRoute1 = appRouting.createAppRoute('/admin/1', AdminPage1, { isAdmin: true });
    const adminRoute2 = appRouting.createAppRoute('/admin/2', AdminPage2, { isAdmin: true });

    const [history, goTo, { getByText }] = renderWithRouter(
      [publicRoute, adminRoute1, adminRoute2], ['/admin/1', '/admin/2']
    );

    goTo('/admin/1');
    expect(history.location.pathname).toBe('/');

    appStateStore.isAdmin = true;
    expect(history.location.pathname).toBe('/');

    fireEvent.click(getByText('Return'));
    expect(history.location.pathname).toBe('/admin/1');
  });

  it('Should render the HOC but not the actual page and not cause extra renders', () => {
    type AppState = { isAdmin: boolean };
    type WrapperProps = PropsWithChildren<{ currentAppState: AppState }>;

    const appRouting = new AppRouting<AppState, WrapperProps>(() => ({ isAdmin: false }), {
      getDefaultPath: currentAppState => currentAppState.isAdmin ? '/admin' : '/public',
    });
    type Stats = { mounted: number, unmounted: number };
    const publicPageStats: Stats = { mounted: 0, unmounted: 0 };
    const adminPageStats: Stats = { mounted: 0, unmounted: 0 };

    const PublicPage: FC = () => {
      useEffect(() => {
        publicPageStats.mounted++;
        return () => {
          publicPageStats.unmounted++;
        };
      }, []);
      return <div>PublicPage</div>;
    };
    const AdminPage: FC = () => {
      useEffect(() => {
        adminPageStats.mounted++;
        return () => {
          adminPageStats.unmounted++;
        };
      }, []);
      return <div>AdminPage</div>;
    };

    const publicRoute = appRouting.createAppRoute('/public', PublicPage, { isAdmin: false });
    const adminRoute = appRouting.createAppRoute('/admin', AdminPage, { isAdmin: true });
    jest.spyOn(adminRoute as { component: FC }, 'component');

    const [, goTo] = renderWithRouter([publicRoute, adminRoute], ['/admin', '/public']);
    goTo('/admin');
    expect(publicPageStats).toEqual<Stats>({ mounted: 1, unmounted: 0 });
    expect(adminPageStats).toEqual<Stats>({ mounted: 0, unmounted: 0 });
    goTo('/admin');
    expect(adminRoute.component).toHaveBeenCalledTimes(2);
    expect(publicPageStats).toEqual<Stats>({ mounted: 2, unmounted: 1 });
    expect(adminPageStats).toEqual<Stats>({ mounted: 0, unmounted: 0 });
  });
});