import TheRed from './TheRed';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRoute, AppRouting } from 'smart-react-routing';

const routes: AppRoute<unknown>[] = [
  appRouting.createAppRoute(links.theRed, TheRed, { likesRed: true, likesGreen: AppRouting.ANY }),
];

export default routes;
