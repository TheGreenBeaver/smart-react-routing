import TheGreen from './TheGreen';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRoute, AppRouting } from 'smart-react-routing';

const routes: AppRoute<unknown>[] = [
  appRouting.createAppRoute(links.theGreen, TheGreen, { likesGreen: true, likesRed: AppRouting.ANY }),
];

export default routes;
