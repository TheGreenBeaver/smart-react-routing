import Home from './Home';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRoute, AppRouting } from 'smart-react-routing';

const routes: AppRoute<unknown>[] = [
  appRouting.createAppRoute(links.home, Home, { likesGreen: AppRouting.ANY, likesRed: AppRouting.ANY }),
];

export default routes;
